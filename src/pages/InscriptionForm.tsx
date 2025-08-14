// src/pages/InscriptionForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Send, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";

// Tipagem mais forte
interface InscriptionFormData {
  discipuladores: string;
  lider: string;
  nomeCompleto: string;
  anjoGuarda: string;
  sexo: string;
  idade: string;
  whatsapp: string;
  situacao: string;
  nomeResponsavel1: string;
  whatsappResponsavel1: string;
  nomeResponsavel2: string;
  whatsappResponsavel2: string;
  nomeResponsavel3: string;
  whatsappResponsavel3: string;
}

// Validação com Zod
const inscriptionSchema = z.object({
  situacao: z.string().nonempty(),
  nomeCompleto: z.string().nonempty(),
  sexo: z.string().nonempty(),
  idade: z.string().nonempty(),
  whatsapp: z.string().nonempty(),
  nomeResponsavel1: z.string().optional(),
  whatsappResponsavel1: z.string().optional()
});

const InscriptionForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InscriptionFormData>({
    discipuladores: "",
    lider: "",
    nomeCompleto: "",
    anjoGuarda: "",
    sexo: "",
    idade: "",
    whatsapp: "",
    situacao: "",
    nomeResponsavel1: "",
    whatsappResponsavel1: "",
    nomeResponsavel2: "",
    whatsappResponsavel2: "",
    nomeResponsavel3: "",
    whatsappResponsavel3: ""
  });
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const discipuladoresOptions = [
    "Arthur e Beatriz",
    "José Gomes e Edna",
    "Rosana",
    "Rafael Ângelo e Ingrid"
  ].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const lideresMap: { [key: string]: string[] } = {
    "Arthur e Beatriz": ["Maria e Mauro", "Welligton e Nathalia", "Rafael Vicente e Fabiana", "Lucas e Gabriela Tangerino", "Marcio e Rita", "Alfredo e Luana"].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    "José Gomes e Edna": ["Celina", "Junior e Patricia", "José Gomes e Edna", "Eliana", "Vinicius e Eliane"].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    "Rosana": ["Deusa", "Maria Sandrimara"].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    "Rafael Ângelo e Ingrid": ["Renan e Edziane", "Vladimir e Elaine", "Rafael Ângelo e Ingrid", "Hugo e Luciane", "Alexandre e Carol"].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  };

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const { data, error } = await supabase
        .from('event_settings')
        .select('registrations_open')
        .single();
      if (error) {
        console.error("Erro ao buscar status das inscrições:", error);
        setIsRegistrationsOpen(false);
      } else {
        setIsRegistrationsOpen(data.registrations_open);
      }
    };
    fetchRegistrationStatus();
  }, []);

  // Componente reutilizável para campos de responsável
  const ResponsavelInput = ({ index }: { index: 1 | 2 | 3 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`nomeResponsavel${index}`}>Responsável {index} {index === 1 ? '*' : '(opcional)'}:</Label>
        <Input
          id={`nomeResponsavel${index}`}
          type="text"
          value={formData[`nomeResponsavel${index}` as keyof InscriptionFormData] as string}
          onChange={(e) =>
            setFormData({
              ...formData,
              [`nomeResponsavel${index}`]: e.target.value
            })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`whatsappResponsavel${index}`}>WhatsApp {index} {index === 1 ? '*' : '(opcional)'}:</Label>
        <Input
          id={`whatsappResponsavel${index}`}
          type="tel"
          value={formData[`whatsappResponsavel${index}` as keyof InscriptionFormData] as string}
          onChange={(e) =>
            setFormData({
              ...formData,
              [`whatsappResponsavel${index}`]: e.target.value
            })
          }
        />
      </div>
    </div>
  );

  const getAnjoGuardaValue = () => {
    if (formData.situacao === "Encontrista") return formData.anjoGuarda;
    if (formData.situacao === "Pastor, obreiro ou discipulador") return formData.nomeCompleto;
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegistrationsOpen) {
      toast({
        title: "Inscrições Encerradas",
        description: "As inscrições para o Encontro com Deus estão encerradas no momento.",
        variant: "destructive"
      });
      return;
    }

    const parseResult = inscriptionSchema.safeParse(formData);
    if (!parseResult.success) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios corretamente.",
        variant: "destructive"
      });
      return;
    }

    if (formData.situacao === "Encontrista" && (!formData.nomeResponsavel1 || !formData.whatsappResponsavel1)) {
      toast({
        title: "Campos obrigatórios para Encontrista",
        description: "O primeiro contato de responsável é obrigatório. Preencha com familiares ou responsáveis para caso seja necessário acionar.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const isPastorObreiro = formData.situacao === "Pastor, obreiro ou discipulador";
      const inscriptionData = {
        nome_completo: formData.nomeCompleto,
        anjo_guarda: getAnjoGuardaValue(),
        sexo: formData.sexo,
        idade: formData.idade,
        whatsapp: formData.whatsapp,
        discipuladores: isPastorObreiro ? formData.nomeCompleto : formData.discipuladores,
        lider: isPastorObreiro ? formData.nomeCompleto : formData.lider,
        irmao_voce_e: formData.situacao,
        responsavel_1_nome: formData.nomeResponsavel1 || null,
        responsavel_1_whatsapp: formData.whatsappResponsavel1 || null,
        responsavel_2_nome: formData.nomeResponsavel2 || null,
        responsavel_2_whatsapp: formData.whatsappResponsavel2 || null,
        responsavel_3_nome: formData.nomeResponsavel3 || null,
        responsavel_3_whatsapp: formData.whatsappResponsavel3 || null,
        status_pagamento: 'Pendente',
        valor: 200.00
      };

      console.log("Dados da inscrição:", inscriptionData);

      const { data, error } = await supabase
        .from('inscriptions')
        .insert([inscriptionData])
        .select();

      if (error) throw error;

      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Sua inscrição foi registrada. Aguarde a confirmação do pagamento."
      });

      setFormData({
        discipuladores: "",
        lider: "",
        nomeCompleto: "",
        anjoGuarda: "",
        sexo: "",
        idade: "",
        whatsapp: "",
        situacao: "",
        nomeResponsavel1: "",
        whatsappResponsavel1: "",
        nomeResponsavel2: "",
        whatsappResponsavel2: "",
        nomeResponsavel3: "",
        whatsappResponsavel3: ""
      });
    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro na inscrição",
        description: "Ocorreu um erro ao processar sua inscrição. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-divine bg-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-glow rounded-full flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-primary">Formulário de Inscrição</CardTitle>
              <p className="text-muted-foreground">Encontro com Deus - 29 a 31 de Agosto</p>
            </CardHeader>
            <CardContent>
              {!isRegistrationsOpen ? (
                <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-300 rounded-lg text-red-800">
                  <AlertTriangle className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Inscrições Encerradas!</h3>
                  <p className="text-center">As inscrições para o Encontro com Deus estão encerradas no momento.</p>
                  <p className="text-center mt-2">Fique atento para futuras oportunidades!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* BLOCO: Irmão, você é */}
                  <div className="space-y-2 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
                    <Label className="text-lg font-bold">Irmão, você é: *</Label>
                    <Select
                      value={formData.situacao}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          situacao: value,
                          anjoGuarda:
                            value === 'Equipe' ||
                            value === 'Cozinha' ||
                            value === 'Acompanhante' ||
                            value === 'Pastor, obreiro ou discipulador'
                              ? value
                              : ''
                        })
                      }
                    >
                      <SelectTrigger className="border-yellow-400">
                        <SelectValue placeholder="Selecione sua situação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Encontrista">Encontrista</SelectItem>
                        <SelectItem value="Equipe">Equipe</SelectItem>
                        <SelectItem value="Acompanhante">Acompanhante</SelectItem>
                        <SelectItem value="Cozinha">Cozinha</SelectItem>
                        <SelectItem value="Pastor, obreiro ou discipulador">Pastor, obreiro ou discipulador</SelectItem>
                      </SelectContent>
                    </Select>

                    {formData.situacao === 'Acompanhante' && (
                      <p className="text-sm text-yellow-800 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                        <strong>Aviso:</strong> A opção de Acompanhante é para quem vai servir como equipe pela primeira vez.
                      </p>
                    )}
                  </div>

                  {/* BLOCO: Nome completo */}
                  <div className="space-y-2">
                    <Label htmlFor="nomeCompleto">Seu nome completo: *</Label>
                    <Input
                      id="nomeCompleto"
                      type="text"
                      value={formData.nomeCompleto}
                      onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  {/* BLOCO: Anjo da Guarda */}
                  {formData.situacao === 'Encontrista' && (
                    <div className="space-y-2">
                      <Label htmlFor="anjoGuarda">Quem é seu Anjo da Guarda (Pessoa que te convidou)?</Label>
                      <Input
                        id="anjoGuarda"
                        type="text"
                        value={formData.anjoGuarda}
                        onChange={(e) => setFormData({ ...formData, anjoGuarda: e.target.value })}
                        placeholder="Nome da pessoa que te convidou"
                      />
                    </div>
                  )}

                  {/* BLOCO: Discipuladores e Líderes */}
                  {!(formData.situacao === "Pastor, obreiro ou discipulador") && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="discipuladores">Seus discipuladores, são: *</Label>
                        <Select value={formData.discipuladores} onValueChange={(value) => setFormData({ ...formData, discipuladores: value, lider: "" })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seus discipuladores" />
                          </SelectTrigger>
                          <SelectContent>
                            {discipuladoresOptions.map((discipulador) => (
                              <SelectItem key={discipulador} value={discipulador}>
                                {discipulador}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lider">Seu líder é: *</Label>
                        <Select value={formData.lider} onValueChange={(value) => setFormData({ ...formData, lider: value })} disabled={!formData.discipuladores}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu líder" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.discipuladores && lideresMap[formData.discipuladores]?.map((lider) => (
                              <SelectItem key={lider} value={lider}>
                                {lider}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* BLOCO: Sexo e Idade */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sexo">Sexo: *</Label>
                      <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idade">Idade: *</Label>
                      <Input
                        id="idade"
                        type="number"
                        value={formData.idade}
                        onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                        placeholder="Sua idade"
                        min="1"
                        max="120"
                      />
                    </div>
                  </div>

                  {/* BLOCO: WhatsApp */}
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">Compartilhe seu WhatsApp: *</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  {/* BLOCO: Responsáveis */}
                  {formData.situacao === 'Encontrista' && (
                    <div className="bg-red-50 border-2 border-red-400 p-6 rounded-lg space-y-6">
                      <h3 className="text-lg font-semibold text-red-700">Contatos de Pessoas Responsáveis</h3>
                      <p className="text-sm text-red-800 mb-2">
                        Estes contatos devem ser preenchidos com familiares ou responsáveis, para caso seja necessário acionar.
                      </p>
                      {[1, 2, 3].map((i) => <ResponsavelInput key={i} index={i as 1 | 2 | 3} />)}
                    </div>
                  )}

                  {/* BLOCO: PIX */}
                  <div className="bg-orange-50 border-2 border-orange-400 p-4 rounded-lg">
                    <p className="text-sm text-orange-800 mb-2">
                      <strong>Atenção:</strong> Após a inscrição, realizar o pagamento via PIX no valor de R$200,00. Para isso, utilize a chave PIX: videiraosascoencontro@gmail.com e envie o comprovante para o WhatsApp do discipulador ou líder que você cadastrou, ou para a pessoa que te convidou.
                    </p>
                  </div>

                  {/* BOTÃO */}
                  <Button type="submit" variant="divine" size="lg" className="w-full" disabled={loading}>
                    <Send className="mr-2 h-5 w-5" />
                    {loading ? "Enviando..." : "Finalizar Inscrição"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InscriptionForm;

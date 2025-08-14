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

// Componente para inputs de responsáveis
interface ResponsavelInputProps {
  index: 1 | 2 | 3;
  valueNome?: string;
  onChangeNome?: (val: string) => void;
  valueWhats?: string;
  onChangeWhats?: (val: string) => void;
}

const ResponsavelInput = ({ index, valueNome, onChangeNome, valueWhats, onChangeWhats }: ResponsavelInputProps) => (
  <div className="space-y-2">
    <Label htmlFor={`nomeResponsavel${index}`}>Responsável {index}:</Label>
    <Input
      id={`nomeResponsavel${index}`}
      type="text"
      value={valueNome || ""}
      onChange={(e) => onChangeNome?.(e.target.value)}
    />
    <Label htmlFor={`whatsappResponsavel${index}`}>WhatsApp {index}:</Label>
    <Input
      id={`whatsappResponsavel${index}`}
      type="tel"
      value={valueWhats || ""}
      onChange={(e) => onChangeWhats?.(e.target.value)}
    />
  </div>
);

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

  // Função centralizada para definir anjoGuarda
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
        description: "É necessário preencher pelo menos o primeiro responsável. Estes contatos precisam ser de familiares para caso seja necessário acionar.",
        variant: "destructive"
      });
      return;
    }

    // 🔹 Validação que você pediu
    if (formData.situacao !== "Pastor, obreiro ou discipulador") {
      if (!formData.discipuladores || !formData.lider) {
        toast({
          title: "Discipulador e Líder obrigatórios",
          description: "Por favor, selecione seus discipuladores e líder antes de prosseguir.",
          variant: "destructive"
        });
        return;
      }
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
        description: "Sua inscrição foi registrada. Após a inscrição, realizar o pagamento via PIX no valor de R$200,00. Para isso, utilize a chave PIX: chave PIX: videiraosascoencontro@gmail.com e envie o comprovante para o WhatsApp do discipulador ou líder que você cadastrou, ou para a pessoa que te convidou."
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
                  {/* Situação */}
                  <div className="space-y-2">
                    <Label htmlFor="situacao">Irmão, você é: *</Label>
                    <Select value={formData.situacao} onValueChange={(value) => setFormData({
                      ...formData,
                      situacao: value,
                      anjoGuarda: (value === 'Equipe' || value === 'Cozinha' || value === 'Acompanhante' || value === 'Pastor, obreiro ou discipulador') ? value : ''
                    })}>
                      <SelectTrigger>
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
                  </div>

                  {formData.situacao === 'Acompanhante' && (
                    <p className="text-sm text-muted-foreground bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                      <strong>Aviso:</strong> A opção de Acompanhante é para quem vai servir como equipe pela primeira vez.
                    </p>
                  )}

                  {/* Nome completo */}
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

                  {/* Anjo da guarda */}
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

                  {/* Discipuladores e líderes */}
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

                  {/* Sexo e idade */}
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

                  {/* WhatsApp */}
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

                  {/* Responsável principal (Obrigatório) */}
                  {formData.situacao === "Encontrista" && (
                    <div className="bg-accent/30 p-6 rounded-lg space-y-6">
                      <h3 className="text-lg font-semibold text-primary">Contato de Responsável Principal *</h3>
                      <p className="text-sm text-muted-foreground">
                        Este contato é obrigatório e deve ser de familiares, para caso seja necessário acionar.
                      </p>
                      <ResponsavelInput
                        index={1}
                        valueNome={formData.nomeResponsavel1}
                        onChangeNome={(val) => setFormData({ ...formData, nomeResponsavel1: val })}
                        valueWhats={formData.whatsappResponsavel1}
                        onChangeWhats={(val) => setFormData({ ...formData, whatsappResponsavel1: val })}
                      />
                    </div>
                  )}

                  {/* Responsáveis adicionais (Opcional) */}
                  {formData.situacao === "Encontrista" && (
                    <div className="bg-accent/30 p-6 rounded-lg space-y-4 mt-4">
                      <h3 className="text-lg font-semibold text-primary">Responsáveis Adicionais (opcionais)</h3>
                      <ResponsavelInput
                        index={2}
                        valueNome={formData.nomeResponsavel2}
                        onChangeNome={(val) => setFormData({ ...formData, nomeResponsavel2: val })}
                        valueWhats={formData.whatsappResponsavel2}
                        onChangeWhats={(val) => setFormData({ ...formData, whatsappResponsavel2: val })}
                      />
                      <ResponsavelInput
                        index={3}
                        valueNome={formData.nomeResponsavel3}
                        onChangeNome={(val) => setFormData({ ...formData, nomeResponsavel3: val })}
                        valueWhats={formData.whatsappResponsavel3}
                        onChangeWhats={(val) => setFormData({ ...formData, whatsappResponsavel3: val })}
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Estes contatos são opcionais e servem como adicionais caso o responsável principal não esteja disponível.
                      </p>
                    </div>
                  )}

                  {/* Lembrete PIX */}
                  <div className="flex items-start bg-red-100 border-l-4 border-red-600 p-4 rounded-lg shadow-md">
                    <svg
                      className="w-6 h-6 text-red-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-800">
                      <strong>Atenção:</strong> Após a inscrição, realize o pagamento via <strong>PIX</strong> no valor de <strong>R$200,00</strong>.  
                      Use a chave: <strong>videiraosascoencontro@gmail.com</strong> e envie o comprovante para o WhatsApp do discipulador/líder que você cadastrou ou para a pessoa que te convidou.
                    </p>
                  </div>


                  <Button type="submit" className="w-full" variant="divine" size="lg" disabled={loading}>
                    {loading ? "Enviando..." : <><Send className="mr-2 h-4 w-4" /> Enviar Inscrição</>}
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

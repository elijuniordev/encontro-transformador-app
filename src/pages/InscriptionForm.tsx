// src/pages/InscriptionForm.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  const ResponsavelInput = ({ index }: { index: 1 | 2 | 3 }) => (
    <div className="space-y-2">
      <Label htmlFor={`nomeResponsavel${index}`}>Responsável {index}:{index === 1 ? " *" : ""}</Label>
      <Input
        id={`nomeResponsavel${index}`}
        type="text"
        value={formData[`nomeResponsavel${index}` as keyof InscriptionFormData] as string}
        onChange={(e) => setFormData({ ...formData, [`nomeResponsavel${index}`]: e.target.value })}
      />
      <Label htmlFor={`whatsappResponsavel${index}`}>WhatsApp {index}:{index === 1 ? " *" : ""}</Label>
      <Input
        id={`whatsappResponsavel${index}`}
        type="tel"
        value={formData[`whatsappResponsavel${index}` as keyof InscriptionFormData] as string}
        onChange={(e) => setFormData({ ...formData, [`whatsappResponsavel${index}`]: e.target.value })}
      />
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
        description: "Por favor, preencha ao menos o primeiro contato responsável.",
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-300 rounded-lg text-red-800">
                  <AlertTriangle className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Inscrições Encerradas!</h3>
                  <p className="text-center">As inscrições para o Encontro com Deus estão encerradas no momento.</p>
                  <p className="text-center mt-2">Fique atento para futuras oportunidades!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sexo">Sexo: *</Label>
                      <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Feminino">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idade">Idade: *</Label>
                      <Input
                        id="idade"
                        type="number"
                        min={0}
                        value={formData.idade}
                        onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp: *</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="(00) 0 0000-0000"
                    />
                  </div>

                  {formData.situacao === 'Encontrista' && (
                    <>
                      <ResponsavelInput index={1} />
                      <ResponsavelInput index={2} />
                      <ResponsavelInput index={3} />
                    </>
                  )}

                  <p className="text-sm text-muted-foreground">
                    Após o preenchimento, você será direcionado(a) para a tela de pagamento via PIX.
                  </p>

                  <Button type="submit" className="w-full flex justify-center items-center" disabled={loading}>
                    {loading ? "Enviando..." : <><Send className="mr-2" /> Enviar Inscrição</>}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default InscriptionForm;

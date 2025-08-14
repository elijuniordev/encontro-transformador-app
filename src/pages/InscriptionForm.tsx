// src/pages/InscriptionForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Send, AlertTriangle } from "lucide-react";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const InscriptionForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
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

  const discipuladoresOptions = [
    "Arthur e Beatriz",
    "José Gomes e Edna",
    "Rosana",
    "Isaac e Andrea",
    "Rafael Ângelo e Ingrid"
  ];

  const lideresMap: { [key: string]: string[] } = {
    "Arthur e Beatriz": ["Maria e Mauro", "Welligton e Nathalia", "Rafael Vicente e Fabiana", "Lucas e Gabriela Tangerino"],
    "José Gomes e Edna": ["Celina", "Junior e Patricia", "José Gomes e Edna", "Eliana", "Vinicius e Eliane"],
    "Rosana": ["Deusa", "Maria Sandrimara"],
    "Isaac e Andrea": ["Marcio e Rita", "Alexandre e Carol"],
    "Rafael Ângelo e Ingrid": ["Renan e Edziane", "Vladimir e Elaine", "Rafael Ângelo e Ingrid", "Hugo e Luciane"]
  };

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const { data, error } = await supabase
        .from("event_settings")
        .select("registrations_open")
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

    const situationsWithoutLeaders = ["Equipe", "Cozinha", "Pastor, obreiro ou discipulador"];

    if (!formData.situacao) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione a opção 'Irmão, você é'.",
        variant: "destructive"
      });
      return;
    }
    if (!formData.discipuladores && !situationsWithoutLeaders.includes(formData.situacao)) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    if (!formData.lider && !situationsWithoutLeaders.includes(formData.situacao)) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    if (!formData.nomeCompleto || !formData.sexo || !formData.idade || !formData.whatsapp) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
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

    try {
      const inscriptionData = {
        nome_completo: formData.nomeCompleto,
        anjo_guarda: situationsWithoutLeaders.includes(formData.situacao) ? null : formData.anjoGuarda || "",
        sexo: formData.sexo,
        idade: formData.idade,
        whatsapp: formData.whatsapp,
        discipuladores: situationsWithoutLeaders.includes(formData.situacao) ? null : formData.discipuladores,
        lider: situationsWithoutLeaders.includes(formData.situacao) ? null : formData.lider,
        irmao_voce_e: formData.situacao,
        responsavel_1_nome: formData.nomeResponsavel1 || null,
        responsavel_1_whatsapp: formData.whatsappResponsavel1 || null,
        responsavel_2_nome: formData.nomeResponsavel2 || null,
        responsavel_2_whatsapp: formData.whatsappResponsavel2 || null,
        responsavel_3_nome: formData.nomeResponsavel3 || null,
        responsavel_3_whatsapp: formData.whatsappResponsavel3 || null,
        status_pagamento: "Pendente",
        valor: 200.0
      };

      const { data, error } = await supabase
        .from("inscriptions")
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
      console.error("Erro completo:", error);
      toast({
        title: "Erro na inscrição",
        description: "Ocorreu um erro ao processar sua inscrição. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-divine bg-white">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-glow rounded-full flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">
              Formulário de Inscrição
            </CardTitle>
            <p className="text-muted-foreground">
              Encontro com Deus - 29 a 31 de Agosto
            </p>
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

                {/* 1 - Irmão, você é */}
                <div className="space-y-2 border-b pb-4">
                  <Label htmlFor="situacao" className="text-lg font-semibold text-primary">
                    Irmão, você é: *
                  </Label>
                  <Select
                    value={formData.situacao}
                    onValueChange={(value) => {
                      setFormData({ ...formData, situacao: value });
                      if (["Equipe", "Cozinha", "Pastor, obreiro ou discipulador"].includes(value)) {
                        setFormData(prev => ({ ...prev, discipuladores: "", lider: "" }));
                      }
                    }}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Selecione sua situação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Encontrista">Encontrista</SelectItem>
                      <SelectItem value="Equipe">Equipe</SelectItem>
                      <SelectItem value="Cozinha">Cozinha</SelectItem>
                      <SelectItem value="Pastor, obreiro ou discipulador">
                        Pastor, obreiro ou discipulador
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2 - Discipuladores */}
                <div className="space-y-2">
                  <Label htmlFor="discipuladores">Seus discipuladores, são: *</Label>
                  <Select
                    value={formData.discipuladores}
                    onValueChange={(value) => setFormData({ ...formData, discipuladores: value, lider: "" })}
                    disabled={["Equipe", "Cozinha", "Pastor, obreiro ou discipulador"].includes(formData.situacao)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seus discipuladores" />
                    </SelectTrigger>
                    <SelectContent>
                      {discipuladoresOptions.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 3 - Líder */}
                <div className="space-y-2">
                  <Label htmlFor="lider">Seu líder é: *</Label>
                  <Select
                    value={formData.lider}
                    onValueChange={(value) => setFormData({ ...formData, lider: value })}
                    disabled={!formData.discipuladores || ["Equipe", "Cozinha", "Pastor, obreiro ou discipulador"].includes(formData.situacao)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu líder" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.discipuladores &&
                        lideresMap[formData.discipuladores]?.map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 4 - Nome Completo */}
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

                {/* 5 - Anjo da Guarda */}
                <div className="space-y-2">
                  <Label htmlFor="anjoGuarda">Quem é seu Anjo da Guarda (Pessoa que te convidou)?</Label>
                  <Input
                    id="anjoGuarda"
                    type="text"
                    value={formData.anjoGuarda}
                    onChange={(e) => setFormData({ ...formData, anjoGuarda: e.target.value })}
                    placeholder="Nome da pessoa que te convidou"
                    disabled={["Equipe", "Cozinha", "Pastor, obreiro ou discipulador"].includes(formData.situacao)}
                  />
                </div>

                {/* 6 - Sexo e Idade */}
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

                {/* 7 - WhatsApp */}
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

                {/* 8 - Contatos de Encontrista */}
                {formData.situacao === "Encontrista" && (
                  <div className="bg-accent/30 p-6 rounded-lg space-y-6">
                    <h3 className="text-lg font-semibold text-primary">Contatos de Pessoas Responsáveis</h3>

                    {/* Contato 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome do Responsável 1: *</Label>
                        <Input
                          value={formData.nomeResponsavel1}
                          onChange={(e) => setFormData({ ...formData, nomeResponsavel1: e.target.value })}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div>
                        <Label>WhatsApp do Responsável 1: *</Label>
                        <Input
                          value={formData.whatsappResponsavel1}
                          onChange={(e) => setFormData({ ...formData, whatsappResponsavel1: e.target.value })}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    {/* Contato 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome do Responsável 2:</Label>
                        <Input
                          value={formData.nomeResponsavel2}
                          onChange={(e) => setFormData({ ...formData, nomeResponsavel2: e.target.value })}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div>
                        <Label>WhatsApp do Responsável 2:</Label>
                        <Input
                          value={formData.whatsappResponsavel2}
                          onChange={(e) => setFormData({ ...formData, whatsappResponsavel2: e.target.value })}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    {/* Contato 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome do Responsável 3:</Label>
                        <Input
                          value={formData.nomeResponsavel3}
                          onChange={(e) => setFormData({ ...formData, nomeResponsavel3: e.target.value })}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div>
                        <Label>WhatsApp do Responsável 3:</Label>
                        <Input
                          value={formData.whatsappResponsavel3}
                          onChange={(e) => setFormData({ ...formData, whatsappResponsavel3: e.target.value })}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PIX Info */}
                <div className="bg-accent/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Lembre-se:</strong> Após enviar sua inscrição, realize o pagamento via PIX para:
                  </p>
                  <p className="font-mono text-sm font-bold text-primary">
                    videiraosascoencontro@gmail.com
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    E envie o comprovante para seu discipulador ou líder.
                  </p>
                </div>

                <Button type="submit" variant="divine" size="lg" className="w-full">
                  <Send className="mr-2 h-5 w-5" />
                  Finalizar Inscrição
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default InscriptionForm;

// src/pages/InscriptionForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
    "Rafael Ângelo e Ingrid"
  ];

  const lideresMap: { [key: string]: string[] } = {
    "Arthur e Beatriz": ["Maria e Mauro", "Welligton e Nathalia", "Rafael Vicente e Fabiana", "Lucas e Gabriela Tangerino", "Marcio e Rita", "Alfredo e Luana"],
    "José Gomes e Edna": ["Celina", "Junior e Patricia", "José Gomes e Edna", "Eliana", "Vinicius e Eliane"],
    "Rosana": ["Deusa", "Maria Sandrimara"],
    "Rafael Ângelo e Ingrid": ["Renan e Edziane", "Vladimir e Elaine", "Rafael Ângelo e Ingrid", "Hugo e Luciane", "Alexandre e Carol"]
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação principal
    if (
      !formData.nomeCompleto ||
      !formData.sexo ||
      !formData.idade ||
      !formData.whatsapp ||
      !formData.situacao ||
      (formData.situacao !== "Pastor, obreiro ou discipulador" && (!formData.discipuladores || !formData.lider))
    ) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Validação para encontristas
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
        anjo_guarda: formData.anjoGuarda || '',
        sexo: formData.sexo,
        idade: formData.idade,
        whatsapp: formData.whatsapp,
        discipuladores: formData.discipuladores || null,
        lider: formData.lider || null,
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
        description: "Sua inscrição foi registrada. Aguarde a confirmação do pagamento.",
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
                        <SelectItem value="Pastor, obreiro ou discipulador">
                          Pastor, obreiro ou discipulador
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.situacao === 'Acompanhante' && (
                    <p className="text-sm text-muted-foreground bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                      <strong>Aviso:</strong> A opção de Acompanhante, é para quem vai servir como equipe pela primeira vez.
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
                      <Label htmlFor="anjoGuarda">Quem é seu Anjo da Guarda?</Label>
                      <Input
                        id="anjoGuarda"
                        type="text"
                        value={formData.anjoGuarda}
                        onChange={(e) => setFormData({ ...formData, anjoGuarda: e.target.value })}
                        placeholder="Nome da pessoa que te convidou"
                      />
                    </div>
                  )}

                  {/* Apenas mostrar Discipulador e Líder se não for “Pastor, obreiro ou discipulador” */}
                  {formData.situacao !== "Pastor, obreiro ou discipulador" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="discipuladores">Seus discipuladores, são: *</Label>
                        <Select value={formData.discipuladores} onValueChange={(value) => {
                          setFormData({ ...formData, discipuladores: value, lider: "" });
                        }}>
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
                        <Select 
                          value={formData.lider} 
                          onValueChange={(value) => setFormData({ ...formData, lider: value })}
                          disabled={!formData.discipuladores}
                        >
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

                  {formData.situacao === "Encontrista" && (
                    <div className="bg-accent/30 p-6 rounded-lg space-y-6">
                      <h3 className="text-lg font-semibold text-primary">Contatos de Pessoas Responsáveis</h3>

                      {/* Contato 1 */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-primary">Contato 1 (Obrigatório) *</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomeResponsavel1">Nome do Responsavel 1: *</Label>
                            <Input
                              id="nomeResponsavel1"
                              type="text"
                              value={formData.nomeResponsavel1}
                              onChange={(e) => setFormData({ ...formData, nomeResponsavel1: e.target.value })}
                              placeholder="Nome completo do responsável"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="whatsappResponsavel1">WhatsApp do Responsavel 1: *</Label>
                            <Input
                              id="whatsappResponsavel1"
                              type="tel"
                              value={formData.whatsappResponsavel1}
                              onChange={(e) => setFormData({ ...formData, whatsappResponsavel1: e.target.value })}
                              placeholder="(11) 99999-9999"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contato 2 */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-muted-foreground">Contato 2 (Opcional)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomeResponsavel2">Nome do Responsavel 2:</Label>
                            <Input
                              id="nomeResponsavel2"
                              type="text"
                              value={formData.nomeResponsavel2}
                              onChange={(e) => setFormData({ ...formData, nomeResponsavel2: e.target.value })}
                              placeholder="Nome completo do responsável"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="whatsappResponsavel2">WhatsApp do Responsavel 2:</Label>
                            <Input
                              id="whatsappResponsavel2"
                              type="tel"
                              value={formData.whatsappResponsavel2}
                              onChange={(e) => setFormData({ ...formData, whatsappResponsavel2: e.target.value })}
                              placeholder="(11) 99999-9999"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contato 3 */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-muted-foreground">Contato 3 (Opcional)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomeResponsavel3">Nome do Responsavel 3:</Label>
                            <Input
                              id="nomeResponsavel3"
                              type="text"
                              value={formData.nomeResponsavel3}
                              onChange={(e) => setFormData({ ...formData, nomeResponsavel3: e.target.value })}
                              placeholder="Nome completo do responsável"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="whatsappResponsavel3">WhatsApp do Responsavel 3:</Label>
                            <Input
                              id="whatsappResponsavel3"
                              type="tel"
                              value={formData.whatsappResponsavel3}
                              onChange={(e) => setFormData({ ...formData, whatsappResponsavel3: e.target.value })}
                              placeholder="(11) 99999-9999"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
      </div>
      <Footer />
    </div>
  );
};

export default InscriptionForm;

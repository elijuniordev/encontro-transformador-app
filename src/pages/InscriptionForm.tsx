// src/pages/InscriptionForm.tsx
import { useState, useEffect } from "react"; // Adicionado useEffect aqui
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
    // Campos para encontristas
    nomeResponsavel1: "",
    whatsappResponsavel1: "",
    nomeResponsavel2: "",
    whatsappResponsavel2: "",
    nomeResponsavel3: "",
    whatsappResponsavel3: ""
  });
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true); // Estado para controlar o status das inscrições

  // Dados atualizados conforme solicitação
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

  // Efeito para buscar o status das inscrições ao carregar a página
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const { data, error } = await supabase
        .from('event_settings')
        .select('registrations_open')
        .single();

      if (error) {
        console.error("Erro ao buscar status das inscrições:", error);
        setIsRegistrationsOpen(false); // Se houver erro, assume que estão fechadas para segurança
      } else {
        setIsRegistrationsOpen(data.registrations_open);
      }
    };
    fetchRegistrationStatus();
  }, []); // Executar apenas uma vez ao montar


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Impede o envio se as inscrições estiverem encerradas
    if (!isRegistrationsOpen) {
      toast({
        title: "Inscrições Encerradas",
        description: "As inscrições para o Encontro com Deus estão encerradas no momento.",
        variant: "destructive"
      });
      return;
    }

    // Validação básica
    if (!formData.discipuladores || !formData.lider || !formData.nomeCompleto || !formData.sexo || !formData.idade || !formData.whatsapp || !formData.situacao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Validação específica para encontristas
    if (formData.situacao === "Encontrista" && (!formData.nomeResponsavel1 || !formData.whatsappResponsavel1)) {
      toast({
        title: "Campos obrigatórios para Encontrista",
        description: "Por favor, preencha ao menos o primeiro contato responsável.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Preparar dados para inserção no Supabase
      const inscriptionData = {
        nome_completo: formData.nomeCompleto,
        anjo_guarda: formData.anjoGuarda || '',
        sexo: formData.sexo,
        idade: formData.idade,
        whatsapp: formData.whatsapp,
        situacao: formData.situacao,
        discipuladores: formData.discipuladores,
        lider: formData.lider,
        irmao_voce_e: formData.situacao, // Mapear para o campo correto
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
      
      // Inserir dados no Supabase
      const { data, error } = await supabase
        .from('inscriptions')
        .insert([inscriptionData])
        .select();

      if (error) {
        console.error('Erro ao inserir no Supabase:', error);
        throw error;
      }

      console.log('Inscrição salva com sucesso:', data);
      
      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Sua inscrição foi registrada. Aguarde a confirmação do pagamento.",
      });
      
      // Reset do formulário
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
            {/* Renderização condicional do formulário */}
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

              <div className="space-y-2">
                <Label htmlFor="situacao">Irmão, você é: *</Label>
                <Select value={formData.situacao} onValueChange={(value) => setFormData({ ...formData, situacao: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua situação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Encontrista">Encontrista</SelectItem>
                    <SelectItem value="Equipe">Equipe</SelectItem>
                    <SelectItem value="Cozinha">Cozinha</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Seção condicional para Encontristas */}
              {formData.situacao === "Encontrista" && (
                <div className="bg-accent/30 p-6 rounded-lg space-y-6">
                  <h3 className="text-lg font-semibold text-primary">Contatos de Pessoas Responsáveis</h3>
                  
                  {/* Contato 1 - Obrigatório */}
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

                  {/* Contato 2 - Opcional */}
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

                  {/* Contato 3 - Opcional */}
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
      <Footer />
    </div>
  );
};

export default InscriptionForm;
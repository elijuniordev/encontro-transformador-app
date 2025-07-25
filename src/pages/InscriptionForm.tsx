import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Send } from "lucide-react";

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
    situacao: ""
  });

  // Dados fictícios para demonstração - em produção viriam do Supabase
  const discipuladoresOptions = [
    "Pastor João e Ana Silva",
    "Marcos e Carla Santos",
    "Pedro e Maria Oliveira",
    "José e Helena Costa"
  ];

  const lideresMap: { [key: string]: string[] } = {
    "Pastor João e Ana Silva": ["Líder Carlos", "Líder Ana", "Líder Paulo"],
    "Marcos e Carla Santos": ["Líder Roberto", "Líder Sônia", "Líder Lucas"],
    "Pedro e Maria Oliveira": ["Líder Fernanda", "Líder Antônio", "Líder Rosa"],
    "José e Helena Costa": ["Líder Marcos", "Líder Juliana", "Líder Bruno"]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.discipuladores || !formData.lider || !formData.nomeCompleto || !formData.sexo || !formData.idade || !formData.whatsapp || !formData.situacao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Em produção, salvaria no Supabase
      console.log("Dados da inscrição:", formData);
      
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
        situacao: ""
      });
      
    } catch (error) {
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
                    <SelectItem value="membro">Membro da igreja</SelectItem>
                    <SelectItem value="visitante">Visitante</SelectItem>
                    <SelectItem value="novo_convertido">Novo convertido</SelectItem>
                    <SelectItem value="lideranca">Liderança</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InscriptionForm;
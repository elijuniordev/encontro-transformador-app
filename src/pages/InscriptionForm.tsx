// src/pages/InscriptionForm.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Send, AlertTriangle } from "lucide-react";
import Footer from "@/components/Footer";
import { useInscriptionFormLogic } from "@/hooks/useInscriptionFormLogic";

const InscriptionForm = () => {
  const {
    formData,
    setFormData,
    handleSubmit,
    isRegistrationsOpen,
    isLoading,
    lideresMap,
    filteredDiscipuladoresOptions,
  } = useInscriptionFormLogic();

  const isObreiroDiscipuladorPastor = formData.discipuladores === "Sou Obreiro, Discipulador ou Pastor";

  return (
    // CONTAINER DA PÁGINA: flex-col para empilhar conteúdo e footer, min-h-screen para ocupar a tela toda
    <div className="min-h-screen bg-gradient-peaceful flex flex-col"> {/* Removido py-8 px-4 daqui */}
      {/* CONTEÚDO PRINCIPAL (Card): Ocupa o espaço restante e centraliza o Card */}
      {/* Adicionado p-4 ao flex-grow div para manter o espaçamento do conteúdo */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto w-full"> {/* Adicionado w-full para o card ocupar a largura disponível no max-w-2xl */}
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

                  {/* PRIMEIRO: Seção de Sua Função no Encontro */}
                  <div className="space-y-4 p-4 rounded-lg border bg-gray-50">
                    <h3 className="text-lg font-semibold text-primary">Sua Função no Encontro *</h3>
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
                  </div>

                  {/* Seção de Informações da Igreja */}
                  <div className="space-y-4 p-4 rounded-lg border bg-gray-50">
                    <h3 className="text-lg font-semibold text-primary">Informações da Igreja</h3>
                    <div className="space-y-2">
                      <Label htmlFor="discipuladores">Seus discipuladores, são: *</Label>
                      <Select
                        value={formData.discipuladores}
                        onValueChange={(value) => {
                          setFormData({ ...formData, discipuladores: value, lider: "" });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seus discipuladores" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Usar a lista filtrada aqui */}
                          {filteredDiscipuladoresOptions.map((discipulador) => (
                            <SelectItem key={discipulador} value={discipulador}>
                              {discipulador}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Campo "Seu líder é" condicionalmente oculto/visível */}
                    {isObreiroDiscipuladorPastor ? (
                      null
                    ) : (
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
                    )}
                  </div>

                  {/* Seção de Dados Pessoais */}
                  <div className="space-y-4 p-4 rounded-lg border bg-gray-50">
                    <h3 className="text-lg font-semibold text-primary">Seus Dados Pessoais</h3>
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

                    {/* Campo Anjo da Guarda - Visível APENAS se situação for "Encontrista" */}
                    {formData.situacao === "Encontrista" && (
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
                  </div>


                  {/* Seção condicional para Encontristas - Contatos Responsáveis */}
                  {formData.situacao === "Encontrista" && (
                    <div className="bg-accent/30 p-6 rounded-lg space-y-6 border">
                      <h3 className="text-lg font-semibold text-primary">Contatos de Pessoas Responsáveis (Em caso de Emergência)</h3>

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

                  {/* Seção de Informações de Pagamento */}
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

                  <Button type="submit" variant="divine" size="lg" className="w-full" disabled={isLoading}>
                    <Send className="mr-2 h-5 w-5" />
                    {isLoading ? "Finalizando..." : "Finalizar Inscrição"}
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
// src/pages/InscriptionForm.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import { UserPlus, Send, AlertTriangle } from "lucide-react";
import { useInscriptionFormLogic } from "@/hooks/useInscriptionFormLogic";

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
  const {
    formData,
    setFormData,
    handleSubmit,
    isRegistrationsOpen,
    isLoading,
    discipuladoresOptions,
    filteredLideresOptions,
    situacaoOptions
  } = useInscriptionFormLogic();

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
                        {situacaoOptions.map((situacao) => (
                          <SelectItem key={situacao} value={situacao}>{situacao}</SelectItem>
                        ))}
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
                            {filteredLideresOptions?.map((lider) => (
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


                  <Button type="submit" className="w-full" variant="divine" size="lg" disabled={isLoading}>
                    {isLoading ? "Enviando..." : <><Send className="mr-2 h-4 w-4" /> Enviar Inscrição</>}
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
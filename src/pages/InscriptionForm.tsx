// src/pages/InscriptionForm.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import { UserPlus, Send, AlertTriangle, Users, Heart, Phone } from "lucide-react";
import { useInscriptionFormLogic } from "@/hooks/useInscriptionFormLogic";
import InscriptionSuccess from "@/components/InscriptionSuccess";

const InscriptionForm = () => {
  const {
    formData,
    setFormData,
    handleSubmit,
    isRegistrationsOpen,
    isLoading,
    isSuccess,
    discipuladoresOptions,
    filteredLideresOptions,
    situacaoOptions,
    handleInputChange,
  } = useInscriptionFormLogic();

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-peaceful flex flex-col">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md mx-auto w-full">
            <InscriptionSuccess />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              <CardDescription>Encontro com Deus - 29 a 31 de Agosto</CardDescription>
            </CardHeader>
            <CardContent>
              {!isRegistrationsOpen ? (
                <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-300 rounded-lg text-red-800">
                  <AlertTriangle className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Inscrições Encerradas!</h3>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Heart className="h-5 w-5" />Informações Pessoais</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="situacao">Eu sou: *</Label>
                            <Select value={formData.situacao} onValueChange={(value) => setFormData({ ...formData, situacao: value, anjoGuarda: '' })}>
                              <SelectTrigger id="situacao"><SelectValue placeholder="Selecione sua função no evento" /></SelectTrigger>
                              <SelectContent>{situacaoOptions.map((situacao) => (<SelectItem key={situacao} value={situacao}>{situacao}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        {formData.situacao === 'Criança' && ( <div className="flex items-start bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg shadow-md"><AlertTriangle className="h-8 w-8 mr-3 mt-1 flex-shrink-0" /><div><h4 className="font-bold text-lg">Atenção Responsáveis!</h4><p className="text-sm mt-1">Ao inscrever uma criança, você concorda que a organização do evento **não se responsabiliza** por incidentes que possam ocorrer no local (sítio), incluindo, mas não se limitando a, picadas de insetos ou contato com animais.</p></div></div> )}
                        <div className="space-y-2">
                            <Label htmlFor="nomeCompleto">Nome Completo: *</Label>
                            <Input id="nomeCompleto" type="text" value={formData.nomeCompleto} onChange={(e) => handleInputChange('nomeCompleto', e.target.value)} placeholder="Digite o nome completo"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sexo">Sexo: *</Label>
                                <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}><SelectTrigger id="sexo"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="masculino">Masculino</SelectItem><SelectItem value="feminino">Feminino</SelectItem></SelectContent></Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="idade">Idade: *</Label>
                                <Input id="idade" type="number" value={formData.idade} onChange={(e) => handleInputChange('idade', e.target.value)} placeholder="Sua idade" min="0" max="120"/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">Seu WhatsApp: *</Label>
                            <Input id="whatsapp" type="tel" value={formData.whatsapp} onChange={(e) => handleInputChange('whatsapp', e.target.value)} placeholder="(11) 99999-9999" maxLength={15}/>
                        </div>
                    </CardContent>
                  </Card>

                  {['Encontrista', 'Equipe', 'Acompanhante'].includes(formData.situacao) && (
                     <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Users className="h-5 w-5" />Sua Liderança na Igreja</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            {formData.situacao === 'Encontrista' && (
                                <div className="space-y-2">
                                <Label htmlFor="anjoGuarda">Quem te convidou (Anjo da Guarda)?</Label>
                                <Input id="anjoGuarda" type="text" value={formData.anjoGuarda} onChange={(e) => handleInputChange('anjoGuarda', e.target.value)} placeholder="Nome da pessoa que te convidou" />
                                </div>
                            )}
                             <div className="space-y-2">
                                <Label htmlFor="discipuladores">Seus discipuladores: *</Label>
                                <Select value={formData.discipuladores} onValueChange={(value) => setFormData({ ...formData, discipuladores: value, lider: "" })}><SelectTrigger id="discipuladores"><SelectValue placeholder="Selecione seus discipuladores" /></SelectTrigger><SelectContent>{discipuladoresOptions.map((discipulador) => (<SelectItem key={discipulador} value={discipulador}>{discipulador}</SelectItem>))}</SelectContent></Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lider">Seu líder de célula: *</Label>
                                <Select value={formData.lider} onValueChange={(value) => setFormData({ ...formData, lider: value })} disabled={!formData.discipuladores}><SelectTrigger id="lider"><SelectValue placeholder="Selecione seu líder" /></SelectTrigger><SelectContent>{filteredLideresOptions?.map((lider) => (<SelectItem key={lider} value={lider}>{lider}</SelectItem>))}</SelectContent></Select>
                            </div>
                        </CardContent>
                     </Card>
                  )}

                  {(formData.situacao === "Encontrista" || formData.situacao === "Criança") && (
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Phone className="h-5 w-5" />Contatos de Emergência</CardTitle><CardDescription>Informe pelo menos um contato de familiar.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nomeResponsavel1">Responsável 1: *</Label>
                                <Input id="nomeResponsavel1" type="text" value={formData.nomeResponsavel1 || ""} onChange={(e) => handleInputChange('nomeResponsavel1', e.target.value)} />
                                <Label htmlFor="whatsappResponsavel1">WhatsApp do Responsável 1: *</Label>
                                <Input id="whatsappResponsavel1" type="tel" value={formData.whatsappResponsavel1 || ""} onChange={(e) => handleInputChange('whatsappResponsavel1', e.target.value)} maxLength={15} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="nomeResponsavel2">Responsável 2:</Label>
                                <Input id="nomeResponsavel2" type="text" value={formData.nomeResponsavel2 || ""} onChange={(e) => handleInputChange('nomeResponsavel2', e.target.value)} />
                                <Label htmlFor="whatsappResponsavel2">WhatsApp do Responsável 2:</Label>
                                <Input id="whatsappResponsavel2" type="tel" value={formData.whatsappResponsavel2 || ""} onChange={(e) => handleInputChange('whatsappResponsavel2', e.target.value)} maxLength={15} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="nomeResponsavel3">Responsável 3:</Label>
                                <Input id="nomeResponsavel3" type="text" value={formData.nomeResponsavel3 || ""} onChange={(e) => handleInputChange('nomeResponsavel3', e.target.value)} />
                                <Label htmlFor="whatsappResponsavel3">WhatsApp do Responsável 3:</Label>
                                <Input id="whatsappResponsavel3" type="tel" value={formData.whatsappResponsavel3 || ""} onChange={(e) => handleInputChange('whatsappResponsavel3', e.target.value)} maxLength={15} />
                            </div>
                        </CardContent>
                    </Card>
                  )}
                  
                  <div className="!mt-8 flex items-start bg-red-100 border-l-4 border-red-600 p-4 rounded-lg shadow-md">
                    <AlertTriangle className="w-8 h-8 text-red-600 mr-3 flex-shrink-0" />
                    <p className="text-sm text-red-800">
                      <strong>Atenção:</strong> Após a inscrição, realize o pagamento (se aplicável) e envie o comprovante para seu líder ou para quem te convidou.
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
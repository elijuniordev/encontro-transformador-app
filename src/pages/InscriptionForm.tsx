// src/pages/InscriptionForm.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { UserPlus, Send, AlertTriangle, Loader2 } from "lucide-react"; // Importe Loader2
import { useInscriptionFormLogic } from "@/hooks/useInscriptionFormLogic";
import InscriptionSuccess from "@/components/InscriptionSuccess";
import { eventDetails } from "@/config/eventDetails";
import { PersonalInfoSection } from "@/components/forms/PersonalInfoSection";
import { AdditionalInfoSection } from "@/components/forms/AdditionalInfoSection";
import { EmergencyContactsSection } from "@/components/forms/EmergencyContactsSection";

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
    parentescoOptions,
    handleInputChange,
  } = useInscriptionFormLogic();

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-peaceful flex flex-col">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md mx-auto w-full"><InscriptionSuccess /></div>
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
              <CardDescription>Encontro com Deus - {eventDetails.dateRange}</CardDescription>
            </CardHeader>
            <CardContent>
              {!isRegistrationsOpen ? (
                <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-300 rounded-lg text-red-800">
                  <AlertTriangle className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Inscrições Encerradas!</h3>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <PersonalInfoSection
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}
                    situacaoOptions={situacaoOptions}
                  />

                  <AdditionalInfoSection
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}
                    discipuladoresOptions={discipuladoresOptions}
                    parentescoOptions={parentescoOptions}
                    filteredLideresOptions={filteredLideresOptions}
                  />
                  
                  <EmergencyContactsSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                  
                  <div className="!mt-8 flex items-start bg-red-100 border-l-4 border-red-600 p-4 rounded-lg shadow-md">
                    <AlertTriangle className="w-8 h-8 text-red-600 mr-3 flex-shrink-0" />
                    <p className="text-sm text-red-800">
                      <strong>Atenção:</strong> Após a inscrição, realize o pagamento (se aplicável) e envie o comprovante para seu líder ou para quem te convidou.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" variant="divine" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" /> Enviar Inscrição</>
                    )}
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
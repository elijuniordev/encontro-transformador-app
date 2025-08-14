// src/components/landing/CallToActionSection.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

interface CallToActionSectionProps {
  isRegistrationsOpen: boolean;
  handleWhatsappButtonClick: () => void;
}

const CallToActionSection = ({ isRegistrationsOpen, handleWhatsappButtonClick }: CallToActionSectionProps) => {
  return (
    <section className="py-16 px-4 sm:px-6 bg-primary/10">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-10">
          Sua Transformação Começa Aqui. Inscreva-se!
        </h2>
        
        <div className="space-y-5">
          {isRegistrationsOpen ? (
            <>
              {/* NOVO: Aviso com a nova cor, mais informativo */}
              <Card className="bg-alert-info-background border border-alert-info-border shadow-md text-alert-info-foreground p-4 mb-6 mx-auto max-w-md">
                <CardContent className="flex items-center gap-3 p-0">
                  <AlertTriangle className="h-6 w-6 flex-shrink-0" />
                  <p className="font-semibold text-base text-left">
                    Ao clicar, o grupo do WhatsApp será aberto em uma nova aba. Por favor, <strong>retorne a esta página</strong> para continuar sua inscrição após entrar no grupo.
                  </p>
                </CardContent>
              </Card>

              <p className="text-lg text-gray-700 mb-4">
                Para receber todas as atualizações importantes, informações de logística e participar da nossa comunidade, é essencial que você entre no nosso grupo oficial do WhatsApp.
              </p>
              
              <Link to="/inscription">
                <Button 
                  variant="divine" 
                  size="lg" 
                  className="w-full max-w-md text-xl py-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
                  onClick={handleWhatsappButtonClick}
                >
                  Entrar no Grupo WhatsApp
                </Button>
              </Link>

              <div className="mt-8">
                <p className="text-sm text-muted-foreground mb-2">
                  Já está no grupo ou prefere fazer a inscrição diretamente?
                </p>
                <Link to="/inscription">
                  <Button variant="ghost" size="lg" className="w-full max-w-md text-base py-4 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    Fazer minha inscrição agora
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <Link to="/inscricoes-encerradas">
              <Button variant="destructive" size="lg" className="w-full max-w-md text-xl py-6 rounded-lg shadow-xl">
                Inscrições Encerradas
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
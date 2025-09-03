// src/pages/RegistrationsClosedPage.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { eventDetails } from "@/config/eventDetails"; // Importe eventDetails

const RegistrationsClosedPage = () => {
  return (
    // CONTAINER DA PÁGINA: flex-col para empilhar conteúdo e footer, min-h-screen para ocupar a tela toda
    // Removido 'p-4' daqui
    <div className="min-h-screen bg-gradient-peaceful flex flex-col">
      {/* CONTEÚDO PRINCIPAL (Card): Ocupa o espaço restante e centraliza o Card */}
      {/* Adicionado 'p-4' ao flex-grow div para manter o espaçamento do conteúdo */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-divine bg-white text-center">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-red-700">
                Inscrições Encerradas!
              </CardTitle>
              {/* REMOVA a linha abaixo */}
              {/* <p className="text-muted-foreground">
                Encontro com Deus - 29 a 31 de Agosto
              </p> */}

              {/* ADICIONE a linha abaixo */}
              <p className="text-muted-foreground">
                Encontro com Deus - {eventDetails.dateRange}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-lg text-gray-700">
                As inscrições para o Encontro com Deus estão encerradas no momento.
              </p>
              <p className="text-gray-600">
                Agradecemos o seu interesse! Fique atento(a) às nossas redes sociais e avisos para futuras oportunidades.
              </p>
              <Link to="/">
                <Button variant="outline" size="lg" className="w-full mt-4">
                  Voltar para a Página Inicial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegistrationsClosedPage;
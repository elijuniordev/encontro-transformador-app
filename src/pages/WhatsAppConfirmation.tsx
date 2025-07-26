import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const WhatsAppConfirmation = () => {
  return (
    <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-divine bg-white">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-glow rounded-full flex items-center justify-center">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">
              Confirmação do WhatsApp
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Você já entrou no grupo do WhatsApp?
              </h2>
              
              <div className="space-y-4">
                <Link to="/inscription" className="block">
                  <Button variant="divine" size="lg" className="w-full text-xl py-6">
                    <CheckCircle className="mr-3 h-6 w-6" />
                    Sim, já entrei!
                  </Button>
                </Link>
                
                <Link to="/" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    <ArrowLeft className="mr-3 h-5 w-5" />
                    Não, ainda não entrei / Preciso entrar no grupo
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-accent/30 p-6 rounded-lg text-center">
              <p className="text-muted-foreground">
                Se ainda não entrou no grupo, retorne à página anterior e utilize o link oficial do WhatsApp para se juntar à comunidade do Encontro com Deus.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default WhatsAppConfirmation;
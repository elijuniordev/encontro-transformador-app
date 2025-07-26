// src/pages/WhatsAppConfirmation.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const WhatsAppConfirmation = () => {
  const navigate = useNavigate();
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const { data, error } = await supabase
        .from('event_settings')
        .select('registrations_open')
        .single();

      if (error) {
        console.error("Erro ao buscar status das inscrições:", error);
        setIsRegistrationsOpen(false); // Assumir fechado em caso de erro
      } else {
        setIsRegistrationsOpen(data.registrations_open);
        // Se as inscrições estiverem fechadas, redireciona para a página de encerradas
        if (!data.registrations_open) {
          navigate("/inscricoes-encerradas");
        }
      }
    };
    fetchRegistrationStatus();
  }, [navigate]);

  if (!isRegistrationsOpen) {
    return null; 
  }

  return (
    // CONTAINER DA PÁGINA: flex-col para empilhar conteúdo e footer, min-h-screen para ocupar a tela toda
    // Removido 'p-4' daqui
    <div className="min-h-screen bg-gradient-peaceful flex flex-col">
      {/* CONTEÚDO PRINCIPAL (Card): Ocupa o espaço restante e centraliza o Card */}
      {/* Adicionado 'p-4' ao flex-grow div para manter o espaçamento do conteúdo */}
      <div className="flex-grow flex items-center justify-center p-4">
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
      </div>
      <Footer />
    </div>
  );
};

export default WhatsAppConfirmation;
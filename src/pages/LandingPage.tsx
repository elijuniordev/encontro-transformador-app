// src/pages/LandingPage.tsx
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importar Link e useNavigate
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

// Importar os novos componentes de seção
import HeroSection from "@/components/landing/HeroSection";
import ProblemStatementSection from "@/components/landing/ProblemStatementSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import WhyParticipateSection from "@/components/landing/WhyParticipateSection";
import FaqSection from "@/components/landing/FaqSection";
import PaymentInfoSection from "@/components/landing/PaymentInfoSection";
import CallToActionSection from "@/components/landing/CallToActionSection"; // Importado aqui

const LandingPage = () => {
  const navigate = useNavigate();
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);

  // Link do grupo WhatsApp
  const whatsappGroupLink = "https://chat.whatsapp.com/KAh5AivWP9O9jUpeKd7q1O"; // <-- SEU LINK DO GRUPO WHATSAPP AQUI

  const handleWhatsappButtonClick = useCallback(() => {
    // Abre o link do WhatsApp em uma nova aba/janela
    window.open(whatsappGroupLink, '_blank');
    // Redireciona a aba atual para a página de confirmação
    navigate('/whatsapp-confirmation');
  }, [navigate, whatsappGroupLink]);

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
      }
    };
    fetchRegistrationStatus();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      {/* Componente da Seção Hero */}
      <HeroSection />

      {/* Componente da Seção "Você Está Passando Por Isso?" */}
      <ProblemStatementSection />

      {/* Componente da Seção "O Que Você Vai Encontrar?" */}
      <BenefitsSection />

      {/* Componente da Seção "Por Que Participar?" */}
      <WhyParticipateSection />

      {/* Componente da Seção de Perguntas Frequentes (FAQ) */}
      <FaqSection />

      {/* Componente da Seção de Informações de Pagamento */}
      <PaymentInfoSection />

      {/* Componente da Seção Final de Chamada à Ação - Passando a prop e a função */}
      <CallToActionSection 
        isRegistrationsOpen={isRegistrationsOpen} 
        handleWhatsappButtonClick={handleWhatsappButtonClick} // Passando a função
      />
      
      <Footer />
    </div>
  );
};

export default LandingPage;
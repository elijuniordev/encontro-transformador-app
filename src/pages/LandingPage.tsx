// src/pages/LandingPage.tsx
import { useState, useEffect, useCallback } from "react"; 
import { Link, useNavigate } from "react-router-dom";
// CORRIGIDO AQUI: Importação padrão para Footer
import Footer from "@/components/Footer"; 
import { supabase } from "@/integrations/supabase/client";
// Importar o novo hook
import { useLandingPageLogic } from "@/hooks/useLandingPageLogic"; 

// Importar os componentes de seção modularizados
import HeroSection from "@/components/landing/HeroSection";
import ProblemStatementSection from "@/components/landing/ProblemStatementSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import WhyParticipateSection from "@/components/landing/WhyParticipateSection";
import FaqSection from "@/components/landing/FaqSection";
import PaymentInfoSection from "@/components/landing/PaymentInfoSection";
import CallToActionSection from "@/components/landing/CallToActionSection";

const LandingPage = () => {
  // CORRIGIDO AQUI: Chamada do hook para obter os estados e funções
  const { isRegistrationsOpen, handleWhatsappButtonClick } = useLandingPageLogic();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      {/* Componentes de Seção Modularizados */}
      <HeroSection />
      <ProblemStatementSection />
      <BenefitsSection />
      <WhyParticipateSection />
      <FaqSection />
      <PaymentInfoSection />
      
      {/* Componente da Seção Final de Chamada à Ação - Passando a prop e a função */}
      <CallToActionSection 
        isRegistrationsOpen={isRegistrationsOpen} 
        handleWhatsappButtonClick={handleWhatsappButtonClick} 
      />
      
      <Footer />
    </div>
  );
};

export default LandingPage;
// src/pages/LandingPage.tsx
import Footer from "@/components/Footer"; 
import { useLandingPageLogic } from "@/hooks/useLandingPageLogic"; 
import HeroSection from "@/components/landing/HeroSection";
import ProblemStatementSection from "@/components/landing/ProblemStatementSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import WhyParticipateSection from "@/components/landing/WhyParticipateSection";
import FaqSection from "@/components/landing/FaqSection";
import PaymentInfoSection from "@/components/landing/PaymentInfoSection";
import CallToActionSection from "@/components/landing/CallToActionSection";

const LandingPage = () => {
  const { isRegistrationsOpen } = useLandingPageLogic();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HeroSection />
      <ProblemStatementSection />
      <BenefitsSection />
      <WhyParticipateSection />
      <FaqSection />
      <PaymentInfoSection />
      
      {/* A prop 'handleWhatsappButtonClick' foi removida */}
      <CallToActionSection 
        isRegistrationsOpen={isRegistrationsOpen} 
      />
      
      <Footer />
    </div>
  );
};

export default LandingPage;
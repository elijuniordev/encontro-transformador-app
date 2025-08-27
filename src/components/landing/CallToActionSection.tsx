// src/components/landing/CallToActionSection.tsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CallToActionSectionProps {
  isRegistrationsOpen: boolean;
}

const CallToActionSection = ({ isRegistrationsOpen }: CallToActionSectionProps) => {
  return (
    <section className="py-16 px-4 sm:px-6 bg-primary/10">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
          Sua Transformação Começa Aqui
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Não perca a oportunidade de viver uma experiência que pode mudar sua vida. As vagas são limitadas!
        </p>
        
        <div className="space-y-5">
          {isRegistrationsOpen ? (
            <Link to="/inscription">
              <Button 
                variant="divine" 
                size="lg" 
                className="w-full max-w-md text-xl py-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
              >
                Fazer Minha Inscrição Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
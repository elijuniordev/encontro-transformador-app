// src/components/landing/HeroSection.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-encontro.jpg";
import logo from "@/assets/logo-videira.webp";
import { eventDetails } from "@/config/eventDetails";

const HeroSection = () => {
  return (
    <section className="relative flex-1 flex items-start justify-center overflow-hidden min-h-screen py-16 md:py-32">
      {/* HEADER: Transparente, centralizado e com logo maior */}
      <header className="absolute top-0 inset-x-0 py-4 px-4 sm:px-6 flex justify-center items-center z-20">
        <div className="flex items-center">
          <img src={logo} alt="Logo Igreja Videira Osasco" className="h-16 md:h-24 lg:h-32" />
        </div>
      </header>

      {/* Imagem de fundo com overlay escuro para contraste */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* CONTEÚDO PRINCIPAL DO HERO */}
      <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl mx-auto pt-32 md:pt-40"> 
        <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold text-white mb-2 md:mb-4 leading-tight animate-float drop-shadow-lg">
          Sua Vida Pode Mudar em 3 Dias.
          <span className="block text-2xl md:text-5xl lg:text-6xl mt-2 md:mt-4 text-yellow-300">
            Experimente o Encontro com Deus!
          </span>
        </h1>
        <p className="text-sm md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
          O Encontro com Deus é um evento intensivo destinado a fortalecer sua relação com Deus e transformar sua vida de forma profunda e significativa.
        </p>
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200 rounded-xl max-w-sm sm:max-w-md mx-auto mt-8 md:mt-16 p-4 md:p-6">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
            <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <span className="font-semibold text-primary text-base md:text-xl">Quando Acontece:</span>
          </div>
          <p className="text-lg md:text-xl font-bold text-primary">{eventDetails.dateRange}</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
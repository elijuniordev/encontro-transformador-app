// src/components/landing/HeroSection.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-encontro.jpg";
import logo from "@/assets/logo-videira.webp";

const HeroSection = () => {
  return (
    <section className="relative flex-1 flex items-start justify-center overflow-hidden min-h-screen py-20 md:py-32">
      {/* HEADER: Transparente, centralizado e com logo maior */}
      <header className="absolute top-0 inset-x-0 py-4 px-4 sm:px-6 flex justify-center items-center z-20">
        <div className="flex items-center">
          <img src={logo} alt="Logo Igreja Videira Osasco" className="h-20 md:h-28 lg:h-32" />
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
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-20 pt-32 md:pt-40"> 
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight animate-float drop-shadow-lg">
          Sua Vida Pode Mudar em 3 Dias.
          <span className="block text-3xl md:text-5xl lg:text-6xl mt-4 text-yellow-300">
            Experimente o Encontro com Deus!
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
          O Encontro com Deus é um evento intensivo destinado a fortalecer sua relação com Deus e transformar sua vida de forma profunda e significativa.
        </p>
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200 rounded-xl max-w-md mx-auto mt-16 p-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-semibold text-primary text-xl">Quando Acontece:</span>
          </div>
          <p className="text-xl font-bold text-primary">29 a 31 de Agosto</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
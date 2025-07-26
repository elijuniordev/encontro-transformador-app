// src/components/landing/HeroSection.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Quote } from "lucide-react"; // Importar apenas os ícones usados aqui
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-encontro.jpg"; // Certifique-se de que este caminho está correto
import logo from "@/assets/logo-videira.webp"; // Certifique-se de que o nome do arquivo é 'logo-videira.webp'

const HeroSection = () => {
  // Este componente não precisa de isRegistrationsOpen nem navigate diretamente
  // Ele é apenas a parte visual do Hero.

  return (
    // SEÇÃO HERO: Foco na busca e na promessa de transformação
    <section className="relative flex-1 flex items-start justify-center overflow-hidden min-h-screen py-20 md:py-32">
      {/* HEADER: Transparente, centralizado e com logo maior - Posicionamento absoluto */}
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
        <div className="absolute inset-0 bg-black/60"></div> {/* Overlay mais escuro */}
      </div>
      
      {/* CONTEÚDO PRINCIPAL DO HERO */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-20 pt-32 md:pt-40"> 
        {/* Título principal do evento - Mais direto e impactante */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-tight animate-float drop-shadow-lg">
          Sua Vida Pode Mudar em 3 Dias.
          <span className="block text-3xl md:text-5xl lg:text-6xl mt-4 text-yellow-300">
            Experimente o Encontro com Deus!
          </span>
        </h1>
        
        <Card className="mt-16 bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200 rounded-xl">
          <CardContent className="p-8 md:p-10 text-left">
            <h2 className="text-3xl font-bold text-primary text-center mb-6">O Que É o Encontro com Deus?</h2>
            <p className="text-lg leading-relaxed text-gray-800 mb-6">
              O Encontro com Deus é um evento intensivo de <strong>3 dias</strong> destinado a fornecer um ambiente acolhedor e seguro para todos aqueles que desejam fortalecer sua relação com Deus. Durante esse período, você terá a chance de se desconectar das distrações cotidianas e se concentrar na mudança de vida que precisa de uma maneira profunda e significativa.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-800 mb-8">
              A Bíblia nos ensina: <strong className="text-primary font-bold">"Eis agora o tempo sobremodo oportuno, eis agora o dia da salvação." (2 Coríntios 6:2)</strong>. Este é o seu momento de virar a página e iniciar uma nova jornada!
            </p>
            
            {/* Card de Data do Evento */}
            <div className="bg-accent/10 p-6 rounded-lg border border-accent/20 text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="font-semibold text-primary text-xl">Quando Acontece:</span>
              </div>
              <p className="text-xl font-bold text-primary">29 a 31 de Agosto</p>
            </div>

            {/* Chamada à Ação Secundária */}
            <div className="bg-primary/10 border-l-4 border-primary p-5 rounded">
              <p className="font-semibold text-primary text-lg mb-2">Sua jornada para um novo começo e uma vida plena começa aqui.</p>
              <p className="text-xl font-bold text-primary">Não perca esta <strong>oportunidade única</strong> de mudar sua história!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HeroSection;
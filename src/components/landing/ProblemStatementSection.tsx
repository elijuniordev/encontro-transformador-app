// src/components/landing/ProblemStatementSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Frown, MessageSquareDot, ShieldCheck, HandCoins, Sparkles, Users } from "lucide-react"; // Importar ícones necessários

const ProblemStatementSection = () => {
  return (
    // SEÇÃO "VOCÊ ESTÁ PASSANDO POR ISSO?" - Aborda as dores e a necessidade do Encontro
    <section className="py-16 px-4 sm:px-6 bg-primary/5 border-t border-b border-gray-200">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-12">
          Você Está Passando Por Isso?
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed">
          Muitas vezes, a vida nos traz desafios que parecem intransponíveis. No Encontro com Deus, você encontrará um ambiente acolhedor e respostas para:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-white shadow-md border border-gray-200">
            <Frown className="h-12 w-12 text-red-600" />
            <h3 className="font-semibold text-xl text-gray-800">Crises de Ansiedade ou Depressão</h3>
            <p className="text-gray-600 text-base">Encontre paz e liberdade para sua mente e emoções.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-white shadow-md border border-gray-200">
            <MessageSquareDot className="h-12 w-12 text-blue-600" />
            <h3 className="font-semibold text-xl text-gray-800">Conflitos Familiares</h3>
            <p className="text-gray-600 text-base">Experimente a restauração e o amor que transformam lares.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-white shadow-md border border-gray-200">
            <ShieldCheck className="h-12 w-12 text-green-600" />
            <h3 className="font-semibold text-xl text-gray-800">Vícios e Hábitos Destrutivos</h3>
            <p className="text-gray-600 text-base">Descubra a força para se libertar e viver uma nova vida.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-white shadow-md border border-gray-200">
            <HandCoins className="h-12 w-12 text-yellow-600" />
            <h3 className="font-semibold text-xl text-gray-800">Problemas Financeiros</h3>
            <p className="text-gray-600 text-base">Receba princípios que abrem portas para a provisão e prosperidade.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-white shadow-md border border-gray-200">
            <Sparkles className="h-12 w-12 text-purple-600" />
            <h3 className="font-semibold text-xl text-gray-800">Crises Existenciais e Falta de Propósito</h3>
            <p className="text-gray-600 text-base">Encontre o sentido da vida e o plano de Deus para você.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-white shadow-md border border-gray-200">
            <Users className="h-12 w-12 text-pink-600" />
            <h3 className="font-semibold text-xl text-gray-800">Solidão e Falta de Comunhão</h3>
            <p className="text-gray-600 text-base">Conecte-se a uma verdadeira família e encontre seu lugar.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
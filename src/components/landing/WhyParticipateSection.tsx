// src/components/landing/WhyParticipateSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Sparkles, Search, Users, Heart, Clock } from "lucide-react"; // Importar ícones necessários

const WhyParticipateSection = () => {
  return (
    // NOVA SEÇÃO: POR QUE PARTICIPAR DO ENCONTRO COM DEUS? - Razões e transformações
    <section className="py-16 px-4 sm:px-6 bg-primary/5 border-t border-b border-gray-200">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-12">
          Por que participar do Encontro com Deus?
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed">
          <Quote className="inline-block h-6 w-6 text-primary mr-2" />
          <strong className="text-primary font-bold">"Buscai ao Senhor enquanto se pode achar, invocai-o enquanto está perto."</strong> (Isaías 55:6)
        </p>
        <p className="text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed">
          Sua participação no Encontro é um investimento na sua vida espiritual e pessoal. Veja o que você vai colher:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4 p-6 rounded-lg bg-white shadow-md border border-gray-200 text-left">
            <Sparkles className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl text-gray-800">Transformação Pessoal Profunda</h3>
              <p className="text-gray-700 text-base">Muitos participantes relatam uma experiência transformadora que os ajuda a se tornarem pessoas mais compassivas, amorosas e alinhadas com seus valores espirituais.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg bg-white shadow-md border border-gray-200 text-left">
            <Search className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl text-gray-800">Encontre Respostas para suas Buscas</h3>
              <p className="text-gray-700 text-base">É um ambiente seguro para explorar questões espirituais e existenciais, recebendo insights valiosos e direção para sua vida.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg bg-white shadow-md border border-gray-200 text-left">
            <Users className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl text-gray-800">Conecte-se a uma Nova Comunidade</h3>
              <p className="text-gray-700 text-base">Reúne pessoas que compartilham valores espirituais, criando um apoio onde você se sentirá aceito e compreendido.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg bg-white shadow-md border border-gray-200 text-left">
            <Heart className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl text-gray-800">Renove e Fortaleça Sua Fé</h3>
              <p className="text-gray-700 text-base">Um ambiente propício para se reconectar com sua espiritualidade e revitalizar sua relação com Deus.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg bg-white shadow-md border border-gray-200 text-left">
            <Clock className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl text-gray-800">Quebra de Rotina e Foco</h3>
              <p className="text-gray-700 text-base">Uma pausa do ritmo acelerado, permitindo que você se concentre em aspectos mais profundos da existência.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyParticipateSection;
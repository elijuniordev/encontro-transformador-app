// src/components/landing/BenefitsSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Smile, ShieldCheck, Users, BookOpen, Heart, Handshake } from "lucide-react"; // Importar ícones necessários

const BenefitsSection = () => {
  return (
    // SEÇÃO O QUE VOCÊ VAI ENCONTRAR NO ENCONTRO COM DEUS? - Detalhes dos benefícios
    <section className="py-16 px-4 sm:px-6 bg-white border-t border-b border-gray-200">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-12">
          O Que Você Vai Encontrar no Encontro com Deus?
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed">
          Em apenas 3 dias, você mergulhará em um ambiente de fé e amor, onde a transformação é real e visível. Prepare-se para:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4 p-6 rounded-lg bg-blue-50 border border-blue-200 shadow-sm">
            <Smile className="h-10 w-10 text-blue-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl text-blue-800">CURA FÍSICA E EMOCIONAL</h3>
              <p className="text-gray-700 text-base">O Encontro aborda em vários momentos temas sobre cura das emoções, mente e vontade, além disso, você receberá orações para cura física e milagres.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg bg-green-50 border border-green-200 shadow-sm">
            <ShieldCheck className="h-10 w-10 text-green-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl text-green-800">LIBERTAÇÃO DE VÍCIOS E PECADOS</h3>
              <p className="text-gray-700 text-base">Um dos momentos mais marcantes do encontro são os momentos de libertação, se você precisa se livrar de vícios ou de trabalhos espirituais feitos contra você.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg bg-purple-50 border border-purple-200 shadow-sm">
            <Users className="h-10 w-10 text-purple-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl text-purple-800">RESTAURAÇÃO DE SONHOS</h3>
              <p className="text-gray-700 text-base">O Encontro é lugar de restauração, se você precisa de motivos para voltar a ser feliz, para voltar a sonhar, e viver bem com a vida e com Deus.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg bg-orange-50 border border-orange-200 shadow-sm">
            <BookOpen className="h-10 w-10 text-orange-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl text-orange-800">O VERDADEIRO EVANGELHO</h3>
              <p className="text-gray-700 text-base">No Encontro com Deus, todas as ministrações seguem uma linha com o intuito de apresentar o pleno evangelho em 3 dias.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg bg-red-50 border border-red-200 shadow-sm">
            <Heart className="h-10 w-10 text-red-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl text-red-800">O VERDADEIRO AMOR</h3>
              <p className="text-gray-700 text-base">O Amor de Deus é o ponto chave do encontro, sua verdadeira identidade de filho de Deus é reafirmada o tempo todo, você encontrará com um amor incondicional.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg bg-yellow-50 border border-yellow-200 shadow-sm">
            <Handshake className="h-10 w-10 text-yellow-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl text-yellow-800">UMA VERDADEIRA FAMÍLIA</h3>
              <p className="text-gray-700 text-base">No encontro você tem a oportunidade de conhecer novos amigos e de ser inserido na vida da igreja.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
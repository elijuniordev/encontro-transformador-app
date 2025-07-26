// src/components/landing/FaqSection.tsx
import { Card, CardContent } from "@/components/ui/card"; // Manter import de Card e CardContent se forem usados dentro deste componente
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Importar componentes do Accordion

const FaqSection = () => {
  return (
    // NOVA SEÇÃO: PERGUNTAS FREQUENTES (FAQ)
    <section className="py-16 px-4 sm:px-6 bg-white border-t border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-primary mb-12">
          Perguntas Frequentes
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold text-primary text-left">Onde acontecem os Encontros?</AccordionTrigger>
            <AccordionContent className="text-gray-700 text-base">
              Os encontros acontecem nas chácaras da igreja, ou em acampamentos preparados com toda estrutura necessária para receber você.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold text-primary text-left">O que devo levar para o Encontro com Deus?</AccordionTrigger>
            <AccordionContent className="text-gray-700 text-base">
              Você deve estar munido de roupas (suficiente para os 3 dias), roupas de cama (coberta, travesseiro), acessórios de higiene pessoal (papel higiênico, escova de dentes, sabonetes, shampoo).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold text-primary text-left">Quais os dias da semana acontecem o Encontro?</AccordionTrigger>
            <AccordionContent className="text-gray-700 text-base">
              Sempre às Sextas, Sábados e Domingos, com saída às 20h00 no prédio da igreja na sexta, e com fim no domingo às 17h00 com a volta ao prédio.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
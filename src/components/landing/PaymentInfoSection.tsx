// src/components/landing/PaymentInfoSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { HandCoins, Clock, Users } from "lucide-react"; // Importar ícones necessários
import { eventDetails } from "@/config/eventDetails"; // Importe eventDetails

const PaymentInfoSection = () => {
  return (
    // SEÇÃO COMO GARANTIR SUA VAGA E PARTICIPAÇÃO: Informações de Pagamento
    <section className="py-16 px-4 sm:px-6 bg-gray-50 border-t border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-primary mb-12">
          Garanta Sua Vaga: Detalhes para Participação
        </h2>
        
        <div className="grid md:grid-cols-2 gap-10">
          {/* Bloco de Valor e PIX */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-200 p-8 rounded-xl text-center shadow-lg border border-yellow-300">
              <HandCoins className="h-16 w-16 text-yellow-700 mx-auto mb-4" />
              {/* REMOVA a linha abaixo */}
              {/* <p className="text-2xl sm:text-3xl font-bold text-yellow-800 mb-2">Investimento: R$ 200,00</p> */}
              
              {/* ADICIONE a linha abaixo */}
              <p className="text-2xl sm:text-3xl font-bold text-yellow-800 mb-2">Investimento: R$ {eventDetails.fullValue.toFixed(2).replace('.', ',')}</p>
              <p className="text-xl text-yellow-700">Um passo de fé em sua transformação.</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-8 rounded-xl shadow-md">
              <h3 className="font-bold text-xl sm:text-2xl text-blue-700 mb-4">Passo 1: Efetue o Pagamento via PIX</h3>
              <div className="bg-white p-5 rounded border border-blue-100">
                <p className="text-base text-gray-600 mb-2">Chave PIX exclusiva para o Encontro:</p>
                {/* REMOVA a linha abaixo */}
                {/* <p className="font-mono text-xl font-bold text-blue-700 break-all">
                  📧 videiraosascoencontro@gmail.com
                </p> */}

                {/* ADICIONE a linha abaixo */}
                <p className="font-mono text-xl font-bold text-blue-700 break-all">
                  📧 {eventDetails.pixKey}
                </p>
              </div>
            </div>
          </div>
          
          {/* Bloco de Atenção e Prazos - O BLOCO DO ALERTA PIX FOI REMOVIDO DAQUI */}
          <div className="space-y-8">
            {/* Removido o bloco de atenção de PIX */}
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-primary text-xl">Prazo Final para Inscrição:</h4>
                  {/* REMOVA a linha abaixo */}
                  {/* <p className="text-gray-700 text-base sm:text-lg">Pagamentos e confirmações aceitos até <strong className="text-primary">quarta-feira, 27 de agosto de 2025</strong>.</p> */}

                  {/* ADICIONE a linha abaixo */}
                  <p className="text-gray-700 text-base sm:text-lg">Pagamentos e confirmações aceitos até <strong className="text-primary">{eventDetails.deadline}</strong>.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-primary text-xl">Passo 2: Confirme Sua Inscrição</h4>
                  <p className="text-gray-700 text-base sm:text-lg">Após realizar o pagamento, envie o comprovante para seu discipulador, líder de célula ou a pessoa que te convidou para validar sua vaga.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentInfoSection;
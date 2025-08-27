// src/components/management/PaymentMethodStatistics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Ban, CircleDollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react'; // Adicionado AlertCircle

interface PaymentMethodStatisticsProps {
  paymentMethodCounts: { [key: string]: number };
}

// Mapeamento de ícones para cada status e forma de pagamento
const iconMap: { [key: string]: React.ElementType } = {
  'Pix': CircleDollarSign,
  'Cartão de Crédito': CreditCard,
  'CartaoCredito2x': CreditCard,
  'CartaoDebito': CreditCard,
  'Dinheiro': CircleDollarSign,
  'Transferência': CircleDollarSign,
  'Confirmado': CheckCircle,
  'Pendente': Clock,
  'Cancelado': Ban,
  'Pagamento Incompleto': AlertCircle, // Ícone para o novo status
};

// Mapeamento de cores para os ícones
const colorMap: { [key: string]: string } = {
  'Confirmado': 'text-green-600',
  'Pendente': 'text-gray-500',
  'Cancelado': 'text-red-600',
  'Pagamento Incompleto': 'text-yellow-600', // Cor para o novo status
};

const PaymentMethodStatistics = ({ paymentMethodCounts }: PaymentMethodStatisticsProps) => {
  const paymentStatuses = ['Confirmado', 'Pendente', 'Pagamento Incompleto', 'Cancelado'];
  const paymentMethods = ['Pix', 'Cartão de Crédito', 'Dinheiro']; // Principais a serem exibidos

  return (
    <Card className="shadow-peaceful">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Resumo Financeiro
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Cards de Status de Pagamento */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {paymentStatuses.map(status => {
            const count = paymentMethodCounts[status] || 0;
            const Icon = iconMap[status] || CircleDollarSign;
            const color = colorMap[status] || 'text-gray-500';

            return (
              <Card key={status} className="shadow-sm border">
                <CardContent className="pt-6 flex items-center gap-3">
                  <Icon className={`h-7 w-7 ${color}`} />
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">{status}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detalhamento das Formas de Pagamento (para pagamentos confirmados) */}
        <div className="border-t pt-4">
          <h4 className="text-md font-semibold mb-2 text-primary">Formas de Pagamento (Confirmados)</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map(method => {
              const count = paymentMethodCounts[method] || 0;
              const Icon = iconMap[method] || CircleDollarSign;

              return (
                <Card key={method} className="shadow-sm border bg-gray-50">
                  <CardContent className="pt-6 flex items-center gap-3">
                    <Icon className="h-6 w-6 text-gray-600" />
                    <div>
                      <p className="text-xl font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground">{method}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodStatistics;
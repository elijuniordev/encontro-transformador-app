// src/components/management/PaymentMethodStatistics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, PiggyBank, Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { FinancialSummary } from "@/lib/statistics";

interface PaymentMethodStatisticsProps {
  financialSummary: FinancialSummary;
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

const PaymentMethodStatistics = ({ financialSummary }: PaymentMethodStatisticsProps) => {
  // Filtra apenas os métodos de pagamento que tiveram arrecadação
  const paymentMethods = Object.entries(financialSummary.paymentMethodTotals)
    .filter(([, total]) => total > 0)
    .map(([method]) => method);

  return (
    <>
      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
        <Card className="shadow-sm border bg-green-50 border-green-200">
          <CardContent className="pt-4 md:pt-6 flex items-center gap-2 md:gap-3">
            <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-green-600" />
            <div>
              <p className="text-xl md:text-2xl font-bold">{formatCurrency(financialSummary.totalPaid)}</p>
              <p className="text-xs text-muted-foreground">Arrecadado</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border bg-yellow-50 border-yellow-200">
          <CardContent className="pt-4 md:pt-6 flex items-center gap-2 md:gap-3">
            <Clock className="h-6 w-6 md:h-7 md:w-7 text-yellow-600" />
            <div>
              <p className="text-xl md:text-2xl font-bold">{formatCurrency(financialSummary.totalPending)}</p>
              <p className="text-xs text-muted-foreground">Pendente</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border bg-blue-50 border-blue-200">
          <CardContent className="pt-4 md:pt-6 flex items-center gap-2 md:gap-3">
            <TrendingUp className="h-6 w-6 md:h-7 md:w-7 text-blue-600" />
            <div>
              <p className="text-xl md:text-2xl font-bold">{formatCurrency(financialSummary.totalPotential)}</p>
              <p className="text-xs text-muted-foreground">Potencial</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border">
          <CardContent className="pt-4 md:pt-6 flex items-center gap-2 md:gap-3">
            <Users className="h-6 w-6 md:h-7 md:w-7 text-gray-500" />
            <div>
              <p className="text-xl md:text-2xl font-bold">{financialSummary.waivedCount}</p>
              <p className="text-xs text-muted-foreground">Isentos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {paymentMethods.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm md:text-md font-semibold mb-2 text-primary">Arrecadado por Forma de Pagamento</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {paymentMethods.map(method => {
              const total = financialSummary.paymentMethodTotals[method];
              const Icon = method.toLowerCase().includes('cart') ? CreditCard : PiggyBank;

              return (
                <Card key={method} className="shadow-sm border bg-gray-50">
                  <CardContent className="pt-4 md:pt-6 flex flex-col items-center text-center">
                    <Icon className="h-5 w-5 md:h-6 md:w-6 text-gray-600 mb-1 md:mb-2" />
                    <p className="text-base md:text-lg font-bold">{formatCurrency(total)}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{method}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentMethodStatistics;
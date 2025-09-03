// src/components/management/PaymentMethodStatistics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Ban, CircleDollarSign, CheckCircle, Clock, PiggyBank, Users, TrendingUp } from 'lucide-react';
import { FinancialSummary } from "@/lib/statistics"; // Importa a nova interface

interface PaymentMethodStatisticsProps {
  financialSummary: FinancialSummary;
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

const PaymentMethodStatistics = ({ financialSummary }: PaymentMethodStatisticsProps) => {
  const paymentMethods = ['Pix', 'Cartão de Crédito', 'Dinheiro', 'Transferência']; // Principais a serem exibidos

  return (
    <Card className="shadow-peaceful">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Resumo Financeiro
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Cards de Resumo Financeiro */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-sm border bg-green-50 border-green-200">
            <CardContent className="pt-6 flex items-center gap-3">
              <CheckCircle className="h-7 w-7 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(financialSummary.totalPaid)}</p>
                <p className="text-sm text-muted-foreground">Arrecadado</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6 flex items-center gap-3">
              <Clock className="h-7 w-7 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(financialSummary.totalPending)}</p>
                <p className="text-sm text-muted-foreground">Pendente</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border bg-blue-50 border-blue-200">
            <CardContent className="pt-6 flex items-center gap-3">
              <TrendingUp className="h-7 w-7 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(financialSummary.totalPotential)}</p>
                <p className="text-sm text-muted-foreground">Potencial</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <Users className="h-7 w-7 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{financialSummary.waivedCount}</p>
                <p className="text-sm text-muted-foreground">Isentos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhamento das Formas de Pagamento */}
        <div className="border-t pt-4">
          <h4 className="text-md font-semibold mb-2 text-primary">Formas de Pagamento Registradas</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map(method => {
              const count = financialSummary.paymentMethodCounts[method] || 0;
              if (count === 0) return null; // Não mostra se a contagem for zero
              const Icon = method === 'Pix' ? PiggyBank : CreditCard;

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
// src/components/management/PaymentMethodStatistics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, Banknote, QrCode } from "lucide-react";

interface PaymentMethodStatisticsProps {
  paymentMethodCounts: { [key: string]: number };
}

const PaymentMethodStatistics = ({ paymentMethodCounts }: PaymentMethodStatisticsProps) => {
  return (
    <Card className="shadow-peaceful mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Inscrições por Forma de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <QrCode className="h-7 w-7 text-green-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-green-700">{paymentMethodCounts.Pix || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Via Pix</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <CreditCard className="h-7 w-7 text-blue-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">{paymentMethodCounts['Cartão de Crédito'] || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Via Cartão de Crédito</p>
              </div>
            </CardContent>
          </Card>

          {/* Card: Cartão de Crédito 2x */}
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <CreditCard className="h-7 w-7 text-purple-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-purple-700">{paymentMethodCounts['CartaoCredito2x'] || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Via Cartão de Crédito 2x</p>
              </div>
            </CardContent>
          </Card>

          {/* Card: Cartão de Débito */}
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <CreditCard className="h-7 w-7 text-orange-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-orange-700">{paymentMethodCounts['CartaoDebito'] || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Via Cartão de Débito</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <Banknote className="h-7 w-7 text-yellow-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-yellow-700">{paymentMethodCounts.Dinheiro || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Via Dinheiro</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodStatistics;
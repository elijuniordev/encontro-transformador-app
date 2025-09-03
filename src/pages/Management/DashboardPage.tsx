// src/pages/Management/DashboardPage.tsx
import { useManagement } from "./useManagement";
import { StatisticsCardsSkeleton } from "@/components/management/StatisticsCardsSkeleton";
import SituationStatistics from "@/components/management/SituationStatistics";
import PaymentMethodStatistics from "@/components/management/PaymentMethodStatistics";
import { useMemo } from "react";
import { calculateFinancialSummary, calculateSituationCounts } from '@/lib/statistics';
import { FinancialChart } from "@/components/management/FinancialChart";
import { Payment } from "@/types/supabase";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Users2, CreditCard } from "lucide-react";

const DashboardPage = () => {
  const { isLoading, inscriptions, payments, isRegistrationsOpen } = useManagement();

  const statistics = useMemo(() => ({
    situationCounts: calculateSituationCounts(inscriptions),
    financialSummary: calculateFinancialSummary(inscriptions, payments)
  }), [inscriptions, payments]);
  
  const summaryDataForChart = useMemo(() => {
    const summary: { [key: string]: number } = {};
    payments.forEach((payment: Payment) => { // Tipagem explícita adicionada
        const method = payment.payment_method || 'Não especificado';
        if (!summary[method]) summary[method] = 0;
        summary[method] += payment.amount;
    });
    return Object.entries(summary).map(([method, total]) => ({
        "Forma de Pagamento": method,
        "Valor Total Arrecadado": total
    }));
  }, [payments]);

  return (
    <div className="space-y-4 md:space-y-6">
      {isLoading ? <StatisticsCardsSkeleton /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="shadow-peaceful">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <Users2 className="h-5 w-5 md:h-6 md:w-6" />
                Inscrições por Função
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SituationStatistics
                situationCounts={statistics.situationCounts}
                totalInscriptions={inscriptions.length}
                isRegistrationsOpen={isRegistrationsOpen}
              />
            </CardContent>
          </Card>

          <Card className="shadow-peaceful">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <CreditCard className="h-5 w-5 md:h-6 md:w-6" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethodStatistics financialSummary={statistics.financialSummary} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
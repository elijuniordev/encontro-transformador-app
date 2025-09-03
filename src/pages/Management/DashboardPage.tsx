// src/pages/Management/DashboardPage.tsx
import { useManagement } from "./useManagement";
import { StatisticsCardsSkeleton } from "@/components/management/StatisticsCardsSkeleton";
import SituationStatistics from "@/components/management/SituationStatistics";
import PaymentMethodStatistics from "@/components/management/PaymentMethodStatistics";
import { useMemo } from "react";
import { calculateFinancialSummary, calculateSituationCounts } from '@/lib/statistics';
import { FinancialChart } from "@/components/management/FinancialChart";
import { Payment } from "@/types/supabase";

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

  // A FinancialChart não será exibida na tela, mas seus dados podem ser usados para exportação se desejado
  return (
    <div className="space-y-6">
      {isLoading ? <StatisticsCardsSkeleton /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SituationStatistics
            situationCounts={statistics.situationCounts}
            totalInscriptions={inscriptions.length}
            isRegistrationsOpen={isRegistrationsOpen}
          />
          <PaymentMethodStatistics financialSummary={statistics.financialSummary} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
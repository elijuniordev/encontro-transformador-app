// src/pages/Management/DashboardPage.tsx
import { useManagement } from "./useManagement";
import { StatisticsCardsSkeleton } from "@/components/management/StatisticsCardsSkeleton";
import SituationStatistics from "@/components/management/SituationStatistics";
import PaymentMethodStatistics from "@/components/management/PaymentMethodStatistics";
// CORRIGIDO: Renomeia o import para refletir o conteúdo (embora o nome do arquivo seja InscriptionBarChart)
import InscriptionDoughnutChart from "@/components/management/InscriptionBarChart"; 
import { useMemo } from "react";
import { 
  calculateFinancialSummary, 
  calculateSituationCounts, 
  calculateTotalInscriptionsByDiscipler,
  STAFF_CONSOLIDATED_KEY
} from '@/lib/statistics';
import { FinancialChart } from "@/components/management/FinancialChart";
import { Payment } from "@/types/supabase";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Users2, CreditCard, Users } from "lucide-react"; 
import { Skeleton } from "@/components/ui/skeleton"; // Importando Skeleton para o Card Vazio

// Função auxiliar para mapear a chave interna para o texto desejado
const mapDiscipuladorLabel = (label: string) => {
    if (label === STAFF_CONSOLIDATED_KEY) {
        return 'Pastor, obreiro ou discipulador'; 
    }
    return label;
};

const DashboardPage = () => {
  const { isLoading, inscriptions, payments, isRegistrationsOpen, userRole } = useManagement();

  const statistics = useMemo(() => ({
    situationCounts: calculateSituationCounts(inscriptions),
    financialSummary: calculateFinancialSummary(inscriptions, payments),
    disciplerChartData: calculateTotalInscriptionsByDiscipler(inscriptions),
  }), [inscriptions, payments]);
  
  // NOVO: Preparar dados para o Gráfico de Rosca (Agrupamento por Discipulado)
  const pieChartData = useMemo(() => {
    // Transforma a estrutura de Bar Chart em { name: string, value: number } para o Pie Chart
    return statistics.disciplerChartData
      .map(d => ({
        name: mapDiscipuladorLabel(d.discipulador as string),
        value: d.total as number,
      }))
      .filter(d => d.value > 0);
  }, [statistics.disciplerChartData]);
  
  const summaryDataForChart = useMemo(() => {
    const summary: { [key: string]: number } = {};
    payments.forEach((payment: Payment) => { 
        const method = payment.payment_method || 'Não especificado';
        if (!summary[method]) summary[method] = 0;
        summary[method] += payment.amount;
    });
    return Object.entries(summary).map(([method, total]) => ({
        "Forma de Pagamento": method,
        "Valor Total Arrecadado": total
    }));
  }, [payments]);

  const isDetailedViewAllowed = userRole === "admin" || userRole === "discipulador";

  return (
    <div className="space-y-4 md:space-y-6">
      {isLoading ? <StatisticsCardsSkeleton /> : (
        <div className="space-y-4 md:space-y-6">
            
            {/* LINHA 1: Estatísticas (Inscrições e Financeiro) */}
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
            
            {/* LINHA 2: Gráfico de Rosca (Ocupando 6/12) e Card Vazio (Ocupando 6/12) */}
            {isDetailedViewAllowed && pieChartData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* NOVO BLOCO: Gráfico de Rosca ocupa 6/12 */}
                    {/* CORRIGIDO: Passando pieChartData para o componente */}
                    <InscriptionDoughnutChart chartData={pieChartData} /> 
                    
                    {/* NOVO BLOCO: Card Vazio (Placeholder) ocupa 6/12 */}
                    <Card className="shadow-peaceful hidden lg:block">
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl text-muted-foreground">
                                Espaço para futuros widgets
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {/* Este card pode ser usado para outro gráfico ou informações */}
                            <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
// src/pages/Management.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import ManagementHeader from "@/components/management/ManagementHeader";
import ManagementFilters from "@/components/management/ManagementFilters";
import ManagementActions from "@/components/management/ManagementActions";
import SituationStatistics from "@/components/management/SituationStatistics";
import PaymentMethodStatistics from "@/components/management/PaymentMethodStatistics";
import InscriptionsTable from "@/components/management/InscriptionsTable";
import Footer from "@/components/Footer";
import DormitoryReport from "@/components/management/DormitoryReport";
import { BatchPaymentDialog } from "@/components/management/BatchPaymentDialog";
import { FinancialChart } from "@/components/management/FinancialChart";
import { useManagementLogic } from "@/hooks/useManagementLogic";
import { useBatchPayment } from "@/hooks/useBatchPayment";
import { StatisticsCardsSkeleton } from "@/components/management/StatisticsCardsSkeleton";
import { InscriptionsTableSkeleton } from "@/components/management/InscriptionsTableSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inscription } from "@/types/supabase";

const Management = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    inscriptions, filteredInscriptions, fetchInscriptions, situationCounts,
    financialSummary, isRegistrationsOpen, userRole, userEmail, userDiscipulado,
    isAuthenticated, isLoading, handleLogout, handleToggleRegistrations,
    getStatusBadge, handleDelete, handleExportXLSX, summaryDataForChart,
    filters, setFilters, filterOptions
  } = useManagementLogic(chartRef);

  const batchPayment = useBatchPayment(fetchInscriptions);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow p-8"><InscriptionsTableSkeleton /></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-peaceful">
        <ManagementHeader
          userEmail={userEmail ?? null}
          userRole={userRole}
          handleLogout={handleLogout}
          isRegistrationsOpen={isRegistrationsOpen}
          handleToggleRegistrations={handleToggleRegistrations}
        />
        <main className="flex-grow p-4 md:p-6 lg:p-8 space-y-6">
          <Card className="shadow-peaceful">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtros e Ações
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* CORREÇÃO: Espalhando as props para o componente, que espera cada uma individualmente */}
              <ManagementFilters
                {...filters}
                {...setFilters}
                {...filterOptions}
              />
              <ManagementActions
                filterDiscipulado={filters.filterDiscipulado}
                setFilterDiscipulado={setFilters.setFilterDiscipulado}
                userRole={userRole}
                userDiscipulado={userDiscipulado}
                handleExportXLSX={handleExportXLSX}
                onOpenBatchModal={() => batchPayment.setIsModalOpen(true)}
              />
            </CardContent>
          </Card>

          {isLoading ? <StatisticsCardsSkeleton /> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SituationStatistics
                situationCounts={situationCounts}
                totalInscriptions={filteredInscriptions.length}
                isRegistrationsOpen={isRegistrationsOpen}
              />
              <PaymentMethodStatistics financialSummary={financialSummary} />
            </div>
          )}

          {userRole === "admin" && !isLoading && (
            <DormitoryReport inscriptions={inscriptions} />
          )}

          {isLoading ? <InscriptionsTableSkeleton /> : (
            <InscriptionsTable
              filteredInscriptions={filteredInscriptions}
              userRole={userRole}
              userDiscipulado={userDiscipulado}
              getStatusBadge={getStatusBadge}
              handleDelete={handleDelete}
              fetchInscriptions={fetchInscriptions}
            />
          )}
        </main>
        <Footer />
      </div>
      
      <FinancialChart ref={chartRef} summaryData={summaryDataForChart} />
      
      <BatchPaymentDialog
        isOpen={batchPayment.isModalOpen}
        onClose={() => batchPayment.setIsModalOpen(false)}
        inscriptions={filteredInscriptions.filter((i: Inscription) => i.status_pagamento !== 'Isento')}
        selectedIds={batchPayment.selectedIds}
        onSelectionChange={batchPayment.handleSelectionChange}
        onSelectAll={() => batchPayment.handleSelectAll(filteredInscriptions.filter((i: Inscription) => i.status_pagamento !== 'Isento'))}
        onClearAll={batchPayment.handleClearAll}
        amount={batchPayment.amount} setAmount={batchPayment.setAmount}
        method={batchPayment.method} setMethod={batchPayment.setMethod}
        onSubmit={batchPayment.handleSubmit}
        isLoading={batchPayment.isLoading}
      />
    </>
  );
};

export default Management;
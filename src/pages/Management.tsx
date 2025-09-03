// src/pages/Management.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManagementHeader from "@/components/management/ManagementHeader";
import ManagementFilters from "@/components/management/ManagementFilters";
import ManagementActions from "@/components/management/ManagementActions";
import SituationStatistics from "@/components/management/SituationStatistics";
import PaymentMethodStatistics from "@/components/management/PaymentMethodStatistics";
import InscriptionsTable from "@/components/management/InscriptionsTable";
import Footer from "@/components/Footer";
import { useManagementLogic } from "@/hooks/useManagementLogic";
import DormitoryReport from "@/components/management/DormitoryReport";
import { StatisticsCardsSkeleton } from "@/components/management/StatisticsCardsSkeleton";
import { InscriptionsTableSkeleton } from "@/components/management/InscriptionsTableSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useBatchPayment } from "@/hooks/useBatchPayment"; // Importe o novo hook
import { BatchPaymentDialog } from "@/components/management/BatchPaymentDialog"; // Importe o novo componente

const Management = () => {
  const {
    // ... (props existentes)
    filteredInscriptions,
    fetchInscriptions,
    // ... (resto das props)
    searchTerm,
    setSearchTerm,
    filterDiscipulado,
    setFilterDiscipulado,
    filterByFuncao,
    setFilterByFuncao,
    filterByStatusPagamento,
    setFilterByStatusPagamento,
    filterByDiscipuladoGroup,
    setFilterByDiscipuladoGroup,
    inscriptions,
    situationCounts,
    financialSummary,
    isRegistrationsOpen,
    userRole,
    userEmail,
    userDiscipulado,
    isAuthenticated,
    isLoading,
    handleLogout,
    handleToggleRegistrations,
    getStatusBadge,
    handleDelete,
    handleExportXLSX,
    funcaoOptions,
    statusPagamentoOptions,
    discipuladoGroupOptions,
    sexoOptions,
    filterBySexo,
    setFilterBySexo,
  } = useManagementLogic();

  const navigate = useNavigate();
  
  // **INÍCIO DA MUDANÇA**
  // Lógica do modal de lote
  const batchPayment = useBatchPayment(fetchInscriptions);
  // **FIM DA MUDANÇA**

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-peaceful">
        <ManagementHeader
          userEmail={userEmail}
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
              <ManagementFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterByFuncao={filterByFuncao}
                setFilterByFuncao={setFilterByFuncao}
                filterByStatusPagamento={filterByStatusPagamento}
                setFilterByStatusPagamento={setFilterByStatusPagamento}
                filterByDiscipuladoGroup={filterByDiscipuladoGroup}
                setFilterByDiscipuladoGroup={setFilterByDiscipuladoGroup}
                funcaoOptions={funcaoOptions}
                statusPagamentoOptions={statusPagamentoOptions}
                discipuladoGroupOptions={discipuladoGroupOptions}
                sexoOptions={sexoOptions}
                filterBySexo={filterBySexo}
                setFilterBySexo={setFilterBySexo}
              />
              <ManagementActions
                filterDiscipulado={filterDiscipulado}
                setFilterDiscipulado={setFilterDiscipulado}
                userRole={userRole}
                userDiscipulado={userDiscipulado}
                handleExportXLSX={handleExportXLSX}
                onOpenBatchModal={() => batchPayment.setIsModalOpen(true)} // Ação do botão
              />
            </CardContent>
          </Card>

          {isLoading ? (
            <StatisticsCardsSkeleton />
          ) : (
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

          {isLoading ? (
            <InscriptionsTableSkeleton />
          ) : (
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
      
      {/* Renderiza o novo modal */}
      <BatchPaymentDialog
        isOpen={batchPayment.isModalOpen}
        onClose={() => batchPayment.setIsModalOpen(false)}
        inscriptions={filteredInscriptions.filter(i => i.status_pagamento !== 'Isento')} // Filtra isentos
        selectedIds={batchPayment.selectedIds}
        onSelectionChange={batchPayment.handleSelectionChange}
        onSelectAll={() => batchPayment.handleSelectAll(filteredInscriptions.filter(i => i.status_pagamento !== 'Isento'))}
        onClearAll={batchPayment.handleClearAll}
        amount={batchPayment.amount}
        setAmount={batchPayment.setAmount}
        method={batchPayment.method}
        setMethod={batchPayment.setMethod}
        onSubmit={batchPayment.handleSubmit}
        isLoading={batchPayment.isLoading}
      />
    </>
  );
};

export default Management;
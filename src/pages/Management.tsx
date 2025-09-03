// src/pages/Management.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManagementHeader from "@/components/management/ManagementHeader";
import ManagementFilters from "@/components/management/ManagementFilters";
import ManagementActions from "@/components/management/ManagementActions"; // Importe o novo componente
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

const Management = () => {
  const {
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
    filteredInscriptions,
    situationCounts,
    paymentMethodCounts,
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
    fetchInscriptions,
    funcaoOptions,
    statusPagamentoOptions,
    discipuladoGroupOptions,
    sexoOptions,
    filterBySexo,
    setFilterBySexo,
  } = useManagementLogic();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
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
            <PaymentMethodStatistics paymentMethodCounts={paymentMethodCounts} />
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
  );
};

export default Management;
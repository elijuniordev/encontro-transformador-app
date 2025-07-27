// src/pages/Management.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ManagementHeader from "@/components/management/ManagementHeader";
import ManagementFilters from "@/components/management/ManagementFilters";
// REMOVIDO: import StatisticsCards from "@/components/management/StatisticsCards"; // Não será mais usado
import SituationStatistics from "@/components/management/SituationStatistics";
import PaymentMethodStatistics from "@/components/management/PaymentMethodStatistics";
import InscriptionsTable from "@/components/management/InscriptionsTable";
import Footer from "@/components/Footer";
import { useManagementLogic } from "@/hooks/useManagementLogic";
// REMOVIDO: import { Label } from "@/components/ui/label"; // Não precisa mais
// REMOVIDO: import { Switch } from "@/components/ui/switch"; // Não precisa mais

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
    editingId,
    setEditingId,
    editData,
    setEditData,
    isRegistrationsOpen, // Ainda extraído para passar ao ManagementHeader
    userRole,
    userEmail,
    userDiscipulado,
    isAuthenticated,
    handleLogout,
    handleToggleRegistrations, // Ainda extraído para passar ao ManagementHeader
    getStatusBadge,
    handleEdit,
    handleSaveEdit,
    handleExportXLSX,
    fetchInscriptions,
    funcaoOptions,
    statusPagamentoOptions,
    discipuladoGroupOptions,
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
        isRegistrationsOpen={isRegistrationsOpen} // Mantido aqui pois o ManagementHeader precisa
        handleToggleRegistrations={handleToggleRegistrations} // Mantido aqui pois o ManagementHeader precisa
      />
      <main className="flex-grow p-4 md:p-6 lg:p-8 space-y-6">
        <ManagementFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterDiscipulado={filterDiscipulado}
          setFilterDiscipulado={setFilterDiscipulado}
          userRole={userRole}
          userDiscipulado={userDiscipulado}
          handleExportXLSX={handleExportXLSX}
          filterByFuncao={filterByFuncao}
          setFilterByFuncao={setFilterByFuncao}
          filterByStatusPagamento={filterByStatusPagamento}
          setFilterByStatusPagamento={setFilterByStatusPagamento}
          filterByDiscipuladoGroup={filterByDiscipuladoGroup}
          setFilterByDiscipuladoGroup={setFilterByDiscipuladoGroup}
          funcaoOptions={funcaoOptions}
          statusPagamentoOptions={statusPagamentoOptions}
          discipuladoGroupOptions={discipuladoGroupOptions}
        />
        
        {/* REMOVIDO: O bloco do botão de toggle de inscrições foi movido de volta para ManagementHeader.tsx */}
        {/* REMOVIDO: O StatisticsCards completo também foi removido, pois suas funções serão redistribuídas */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* totalInscriptions será passado para SituationStatistics */}
          <SituationStatistics 
            situationCounts={situationCounts} 
            totalInscriptions={filteredInscriptions.length} 
            isRegistrationsOpen={isRegistrationsOpen} // Para exibir o status do evento aqui se desejar
          />
          <PaymentMethodStatistics paymentMethodCounts={paymentMethodCounts} />
        </div>

        <InscriptionsTable
          filteredInscriptions={filteredInscriptions}
          isMobile={false}
          userRole={userRole}
          userDiscipulado={userDiscipulado}
          getStatusBadge={getStatusBadge}
          editingId={editingId}
          setEditingId={setEditingId}
          editData={editData}
          setEditData={setEditData}
          handleEdit={handleEdit}
          handleSaveEdit={handleSaveEdit}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Management;
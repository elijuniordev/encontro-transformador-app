// src/pages/Management.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ManagementHeader from "@/components/management/ManagementHeader";
import ManagementFilters from "@/components/management/ManagementFilters";
import StatisticsCards from "@/components/management/StatisticsCards";
import SituationStatistics from "@/components/management/SituationStatistics";
import PaymentMethodStatistics from "@/components/management/PaymentMethodStatistics";
import InscriptionsTable from "@/components/management/InscriptionsTable";
import Footer from "@/components/Footer";
import { useManagementLogic } from "@/hooks/useManagementLogic";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
    isRegistrationsOpen,
    userRole,
    userEmail,
    userDiscipulado,
    isAuthenticated,
    handleLogout,
    handleToggleRegistrations,
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

  // Redireciona para o login se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]); // Adicionado 'navigate' às dependências

  if (!isAuthenticated) {
    return null; // Ou um spinner de carregamento, etc.
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
        
        {userRole === "admin" && (
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
            <Label htmlFor="registrations-toggle" className="text-sm font-medium">
              Inscrições: {isRegistrationsOpen ? "Abertas" : "Encerradas"}
            </Label>
            <Switch
              id="registrations-toggle"
              checked={isRegistrationsOpen}
              onCheckedChange={handleToggleRegistrations}
            />
          </div>
        )}

        <StatisticsCards
          totalInscriptions={filteredInscriptions.length}
          isRegistrationsOpen={isRegistrationsOpen}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SituationStatistics situationCounts={situationCounts} />
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
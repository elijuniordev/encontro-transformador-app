// src/hooks/useManagementLogic.tsx
import { useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuthManagement } from './useAuthManagement';
import { useEventSettings } from './useEventSettings';
import { useManagementFilters } from './useManagementFilters';
import { useInscriptionsManagement } from './useInscriptionsManagement';
import { useInscriptionsExporter } from './useInscriptionsExporter';
import { calculateSituationCounts, calculateFinancialSummary } from "@/lib/statistics"; // Alteração aqui

export const useManagementLogic = () => {
  const { userRole, userEmail, userDiscipulado, isAuthenticated, handleLogout } = useAuthManagement();
  const { isRegistrationsOpen, isLoadingSettings, handleToggleRegistrations } = useEventSettings();
  const { filters, setFilters, filterOptions } = useManagementFilters();
  const { inscriptions, filteredInscriptions, isLoadingInscriptions, fetchInscriptions, handleDelete } = useInscriptionsManagement(userDiscipulado);
  const { handleExportXLSX } = useInscriptionsExporter(filteredInscriptions);

  const situationCounts = useMemo(() => calculateSituationCounts(filteredInscriptions), [filteredInscriptions]);
  // CORREÇÃO: Usa a nova função para obter o resumo financeiro completo
  const financialSummary = useMemo(() => calculateFinancialSummary(filteredInscriptions), [filteredInscriptions]);

  const getStatusBadge = useCallback((status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Confirmado": "default",
      "Pendente": "secondary",
      "Cancelado": "destructive",
      "Isento": "outline",
      "Pagamento Incompleto": "outline", 
    };
    const colorClass = status === "Pagamento Incompleto" ? "border-yellow-500 text-yellow-700 font-semibold" : "";
    return <Badge variant={variants[status] || "outline"} className={colorClass}>{status}</Badge>;
  }, []);

  return {
    ...filters,
    ...setFilters,
    ...filterOptions,
    inscriptions,
    filteredInscriptions,
    situationCounts,
    financialSummary, // Alteração aqui
    isRegistrationsOpen,
    userRole,
    userEmail,
    userDiscipulado,
    isAuthenticated,
    isLoading: isLoadingSettings || isLoadingInscriptions,
    handleLogout,
    handleToggleRegistrations,
    getStatusBadge,
    handleDelete,
    handleExportXLSX,
    fetchInscriptions,
  };
};
// src/hooks/useManagementLogic.tsx
import { useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuthManagement } from './useAuthManagement';
import { useEventSettings } from './useEventSettings';
import { useManagementFilters } from './useManagementFilters';
import { useInscriptionsManagement } from './useInscriptionsManagement';
import { useInscriptionsExporter } from './useInscriptionsExporter';
import { calculateSituationCounts, calculatePaymentMethodCounts } from "@/lib/statistics"; // Importe as novas funções

export const useManagementLogic = () => {
  const { userRole, userEmail, userDiscipulado, isAuthenticated, handleLogout } = useAuthManagement();
  const { isRegistrationsOpen, isLoadingSettings, handleToggleRegistrations } = useEventSettings();
  const { filters, setFilters, filterOptions } = useManagementFilters();
  const { inscriptions, filteredInscriptions, isLoadingInscriptions, fetchInscriptions, handleDelete } = useInscriptionsManagement(userDiscipulado);
  const { handleExportXLSX } = useInscriptionsExporter(filteredInscriptions);

  // A lógica de cálculo agora está em um arquivo separado, mantendo o hook limpo.
  const situationCounts = useMemo(() => calculateSituationCounts(filteredInscriptions), [filteredInscriptions]);
  const paymentMethodCounts = useMemo(() => calculatePaymentMethodCounts(filteredInscriptions), [filteredInscriptions]);

  const getStatusBadge = useCallback((status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Confirmado": "default", "Pendente": "secondary", "Cancelado": "destructive", "Isento": "outline", "Pagamento Incompleto": "outline",
    };
    const colorClass = status === "Pagamento Incompleto" ? "border-yellow-500 text-yellow-700" : "";
    return <Badge variant={variants[status] || "outline"} className={colorClass}>{status}</Badge>;
  }, []);

  return {
    ...filters,
    ...setFilters,
    ...filterOptions,
    inscriptions,
    filteredInscriptions,
    situationCounts,
    paymentMethodCounts,
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
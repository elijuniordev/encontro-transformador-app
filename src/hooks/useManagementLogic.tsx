// src/hooks/useManagementLogic.tsx
import { useMemo, useEffect, useCallback, RefObject } from 'react';
import { useAuthManagement } from "./useAuthManagement";
import { useInscriptionsManagement } from "./useInscriptionsManagement";
import { useEventSettings } from "./useEventSettings";
import { useManagementFilters } from "./useManagementFilters";
import { useInscriptionsExporter } from "./useInscriptionsExporter";
import { Badge } from "@/components/ui/badge";

export const useManagementLogic = (chartRef: RefObject<HTMLDivElement>) => {
  // Hooks de dados primários
  const { user, userRole, userDiscipulado, isAuthenticated, handleLogout } = useAuthManagement();
  
  const { 
    inscriptions, 
    payments, 
    isLoading: isLoadingInscriptions, 
    fetchInscriptions, 
    handleDelete 
  } = useInscriptionsManagement(userRole, userDiscipulado);
  
  const { 
    isRegistrationsOpen, 
    isLoading: isLoadingSettings, 
    handleToggleRegistrations 
  } = useEventSettings();

  // Hook de filtros - Corrigindo a forma de usar seus retornos
  const {
    filters,
    setFilters,
    filterOptions,
    filteredInscriptions,
    statistics,
  } = useManagementFilters(inscriptions, userRole, userDiscipulado);
  
  // Combina os estados de carregamento de diferentes fontes
  const isLoading = isLoadingInscriptions || isLoadingSettings;

  // Memoização para os dados do gráfico
  const summaryDataForChart = useMemo(() => {
    const summary: { [key: string]: number } = {};
    payments.forEach(payment => {
        const method = payment.payment_method || 'Não especificado';
        if (!summary[method]) summary[method] = 0;
        summary[method] += payment.amount;
    });
    return Object.entries(summary).map(([method, total]) => ({
        "Forma de Pagamento": method,
        "Valor Total Arrecadado": total
    }));
  }, [payments]);

  const { handleExportXLSX } = useInscriptionsExporter(filteredInscriptions, payments, chartRef);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInscriptions();
    }
  }, [isAuthenticated, fetchInscriptions]);

  const getStatusBadge = useCallback((status: string) => {
    const variant = {
      "Pago": "success", "Pendente": "warning", "Parcial": "info",
      "Cancelado": "destructive", "Isento": "secondary"
    }[status] || "default";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Badge variant={variant as any}>{status}</Badge>;
  }, []);

  // Objeto de retorno limpo e organizado
  return {
    inscriptions,
    filteredInscriptions,
    isAuthenticated,
    isLoading,
    isRegistrationsOpen,
    userEmail: user?.email, 
    userRole, 
    userDiscipulado,
    filters,
    setFilters,
    filterOptions,
    situationCounts: statistics.situationCounts,
    financialSummary: statistics.financialSummary,
    summaryDataForChart,
    fetchInscriptions,
    handleDelete,
    handleLogout,
    handleToggleRegistrations,
    handleExportXLSX,
    getStatusBadge, 
  };
};
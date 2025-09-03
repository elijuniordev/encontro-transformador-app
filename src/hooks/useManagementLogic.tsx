// src/hooks/useManagementLogic.tsx
import { useMemo, useEffect, useCallback, RefObject } from 'react';
import { useAuthManagement } from "./useAuthManagement";
import { useInscriptionsManagement } from "./useInscriptionsManagement";
import { useEventSettings } from "./useEventSettings";
import { useManagementFilters } from "./useManagementFilters";
import { useInscriptionsExporter } from "./useInscriptionsExporter";
import { Badge } from "@/components/ui/badge";

export const useManagementLogic = (chartRef: RefObject<HTMLDivElement>) => {
  const { userEmail, userRole, userDiscipulado, isAuthenticated, handleLogout } = useAuthManagement();
  
  const { 
    inscriptions, 
    payments, 
    isLoading: isLoadingInscriptions, 
    fetchInscriptions, 
    handleDelete 
  } = useInscriptionsManagement(userRole, userDiscipulado);
  
  // CORREÇÃO: Renomeando 'isLoading' para 'isLoadingSettings' para evitar conflito
  const { 
    isRegistrationsOpen, 
    isLoading: isLoadingSettings, 
    handleToggleRegistrations 
  } = useEventSettings();

  // CORREÇÃO: Chamando o hook com os argumentos que ele realmente precisa
  const {
    filters,
    setFilters,
    filterOptions,
    filteredInscriptions,
    statistics,
  } = useManagementFilters(inscriptions, userRole, userDiscipulado);
  
  const isLoading = isLoadingInscriptions || isLoadingSettings;

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

  return {
    inscriptions,
    filteredInscriptions,
    isAuthenticated,
    isLoading,
    isRegistrationsOpen,
    userEmail, 
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
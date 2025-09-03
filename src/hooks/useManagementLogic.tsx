import { useMemo, useEffect, useCallback, RefObject } from 'react';
import { useAuthManagement } from "./useAuthManagement";
import { useInscriptionsManagement } from "./useInscriptionsManagement";
import { useEventSettings } from "./useEventSettings";
import { useManagementFilters } from "./useManagementFilters";
import { useInscriptionsExporter } from "./useInscriptionsExporter";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { calculateFinancialSummary, calculateSituationCounts } from '@/lib/statistics';
import { normalizeText } from '@/lib/utils';

export const useManagementLogic = (chartRef: RefObject<HTMLDivElement>) => {
  const { userEmail, userRole, userDiscipulado, isAuthenticated, handleLogout } = useAuthManagement();
  
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

  const {
    filters,
    setFilters,
    filterOptions,
  } = useManagementFilters();
  
  const filteredInscriptions = useMemo(() => {
    return inscriptions.filter(i => {
      // Filtro por termo de busca (nome, whatsapp, etc.)
      const searchTermMatch = normalizeText(i.nome_completo).includes(normalizeText(filters.searchTerm)) ||
                              normalizeText(i.whatsapp).includes(normalizeText(filters.searchTerm));
      
      // Lógica para filtrar por discipulado
      let discipuladoMatch = true;
      if (userRole === "discipulador" && userDiscipulado && filters.filterDiscipulado) {
        // Se o usuário é um discipulador e o switch está ligado, filtra apenas o seu grupo.
        discipuladoMatch = normalizeText(i.discipuladores) === normalizeText(userDiscipulado);
      } else if (filters.filterByDiscipuladoGroup !== 'all') {
        // Se o filtro de grupo de discipulado está selecionado, usa ele.
        discipuladoMatch = normalizeText(i.discipuladores) === normalizeText(filters.filterByDiscipuladoGroup);
      }

      // Filtros de dropdown
      const funcaoMatch = filters.filterByFuncao === 'all' || i.irmao_voce_e === filters.filterByFuncao;
      const statusMatch = filters.filterByStatusPagamento === 'all' || i.status_pagamento === filters.filterByStatusPagamento;
      
      const sexoMatch = filters.filterBySexo === 'all' || i.sexo.toLowerCase() === filters.filterBySexo.toLowerCase();

      // Retorna true apenas se todos os filtros corresponderem
      return searchTermMatch && funcaoMatch && statusMatch && discipuladoMatch && sexoMatch;
    });
  }, [inscriptions, filters, userRole, userDiscipulado]);

  const statistics = useMemo(() => ({
    situationCounts: calculateSituationCounts(filteredInscriptions),
    financialSummary: calculateFinancialSummary(filteredInscriptions, payments)
  }), [filteredInscriptions, payments]);
  
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
    // Apenas variantes válidas
    const variantMap: { [key: string]: BadgeProps["variant"] } = {
      "Pago": "default",       // verde → pode customizar no CSS se quiser
      "Pendente": "secondary", // cinza
      "Parcial": "outline",    // borda
      "Cancelado": "destructive", 
      "Isento": "secondary"
    };
    const variant = variantMap[status] || "default";
    return <Badge variant={variant}>{status}</Badge>;
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
// src/pages/Management/InscriptionsPage.tsx
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import ManagementFilters from "@/components/management/ManagementFilters";
import ManagementActions from "@/components/management/ManagementActions";
import InscriptionsTable from "@/components/management/InscriptionsTable";
import { BatchPaymentDialog } from "@/components/management/BatchPaymentDialog";
import { InscriptionsTableSkeleton } from "@/components/management/InscriptionsTableSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Inscription } from "@/types/supabase";
import { useManagement } from "./useManagement";
import { useBatchPayment } from "@/hooks/useBatchPayment";
import { useManagementFilters } from "@/hooks/useManagementFilters";
import { useInscriptionsExporter } from "@/hooks/useInscriptionsExporter";
import { normalizeText } from '@/lib/utils';
import { BadgeProps } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";

const InscriptionsPage = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { inscriptions, payments, isLoading, userRole, userDiscipulado, fetchInscriptions, handleDelete } = useManagement();
  
  const {
    filters,
    setFilters,
    filterOptions,
  } = useManagementFilters();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Resetar para a primeira página sempre que os filtros mudarem
    setCurrentPage(1);
  }, [filters]);

  const filteredInscriptions = useMemo(() => {
    return inscriptions.filter((i: Inscription) => {
      const searchTermMatch = normalizeText(i.nome_completo).includes(normalizeText(filters.searchTerm)) ||
                              normalizeText(i.whatsapp).includes(normalizeText(filters.searchTerm));
      
      let discipuladoMatch = true;
      if (userRole === "discipulador" && userDiscipulado && filters.filterDiscipulado) {
        discipuladoMatch = normalizeText(i.discipuladores) === normalizeText(userDiscipulado);
      } else if (filters.filterByDiscipuladoGroup !== 'all') {
        discipuladoMatch = normalizeText(i.discipuladores) === normalizeText(filters.filterByDiscipuladoGroup);
      }

      const funcaoMatch = filters.filterByFuncao === 'all' || i.irmao_voce_e === filters.filterByFuncao;
      const statusMatch = filters.filterByStatusPagamento === 'all' || i.status_pagamento === filters.filterByStatusPagamento;
      const sexoMatch = filters.filterBySexo === 'all' || i.sexo.toLowerCase() === filters.filterBySexo.toLowerCase();

      return searchTermMatch && funcaoMatch && statusMatch && discipuladoMatch && sexoMatch;
    });
  }, [inscriptions, filters, userRole, userDiscipulado]);

  const totalPages = Math.ceil(filteredInscriptions.length / itemsPerPage);
  const paginatedInscriptions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInscriptions.slice(startIndex, endIndex);
  }, [filteredInscriptions, currentPage, itemsPerPage]);

  const batchPayment = useBatchPayment(fetchInscriptions);

  const getStatusBadge = useCallback((status: string) => {
    const variantMap: { [key: string]: BadgeProps["variant"] } = {
      "Pago": "default",       
      "Pendente": "secondary",
      "Parcial": "outline",    
      "Cancelado": "destructive", 
      "Isento": "secondary"
    };
    const variant = variantMap[status] || "default";
    return <Badge variant={variant}>{status}</Badge>;
  }, []);

  const { handleExportXLSX } = useInscriptionsExporter(filteredInscriptions, payments, chartRef);
  
  return (
    <div className="space-y-6">
      <Card className="shadow-peaceful">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros e Ações
          </CardTitle>
        </CardHeader>
        <CardContent>
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
      
      {isLoading ? (
        <InscriptionsTableSkeleton />
      ) : (
        <InscriptionsTable
          filteredInscriptions={paginatedInscriptions}
          userRole={userRole}
          userDiscipulado={userDiscipulado}
          getStatusBadge={getStatusBadge}
          handleDelete={handleDelete}
          fetchInscriptions={fetchInscriptions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      
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
    </div>
  );
};

export default InscriptionsPage;
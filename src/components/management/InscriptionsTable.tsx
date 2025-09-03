// src/components/management/InscriptionsTable.tsx
import { useState, useMemo, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Inscription } from "@/types/supabase";
import { MobileInscriptionCard } from "./MobileInscriptionCard";
import { DesktopInscriptionRow } from "./DesktopInscriptionRow";
import { PaymentDetailsDialog } from "../payment/PaymentDetailsDialog";
import { useInscriptionEditor } from "@/hooks/useInscriptionEditor";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { useManagement } from "@/pages/Management/useManagement";
import { useBatchPayment } from "@/hooks/useBatchPayment";
import { useManagementFilters } from "@/hooks/useManagementFilters";
import { useInscriptionsExporter } from "@/hooks/useInscriptionsExporter";
import { normalizeText } from '@/lib/utils';
import { BadgeProps } from "@/components/ui/badge";
import { Payment } from "@/types/supabase";

interface InscriptionsTableProps {
  filteredInscriptions: Inscription[];
  userRole: string | null;
  userDiscipulado: string | null;
  getStatusBadge: (status: string) => JSX.Element;
  handleDelete: (id: string) => void;
  fetchInscriptions: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const InscriptionsTable = ({
  filteredInscriptions,
  userRole,
  userDiscipulado,
  getStatusBadge,
  handleDelete,
  fetchInscriptions,
  currentPage,
  totalPages,
  onPageChange,
}: InscriptionsTableProps) => {
  const isMobile = useIsMobile();
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const { editingId, setEditingId, editData, setEditData, handleEdit, handleSaveEdit, handleCancelEdit } = useInscriptionEditor(fetchInscriptions);

  const handleOpenPaymentModal = (inscription: Inscription) => {
    setSelectedInscription(inscription);
    setPaymentModalOpen(true);
  };

  const getPaginationItems = () => {
    const items = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(totalPages, 5);
    }
    if (currentPage > totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    // Certifica-se de que a paginação não exibe links para páginas inexistentes
    if (totalPages < 5) {
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  const noInscriptionsFound = filteredInscriptions.length === 0;

  return (
    <>
      <Card className="shadow-divine">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" /> Inscrições
            {userRole === "discipulador" && (<Badge variant="secondary" className="ml-2">Filtrado: {userDiscipulado}</Badge>)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {noInscriptionsFound ? (
            <Card className="shadow-sm border"><CardContent className="p-4 text-center text-muted-foreground">Nenhuma inscrição encontrada.</CardContent></Card>
          ) : isMobile ? (
            <div className="space-y-4">
              {filteredInscriptions.map((inscription) => (
                <MobileInscriptionCard
                  key={inscription.id}
                  inscription={inscription}
                  getStatusBadge={getStatusBadge}
                  handleDelete={handleDelete}
                  onOpenPaymentModal={() => handleOpenPaymentModal(inscription)}
                  isEditing={editingId === inscription.id}
                  editData={editData}
                  setEditData={setEditData}
                  onEdit={() => handleEdit(inscription)}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                  setEditingId={setEditingId}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Discipuladores</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInscriptions.map((inscription) => (
                    <DesktopInscriptionRow
                      key={inscription.id}
                      inscription={inscription}
                      getStatusBadge={getStatusBadge}
                      handleDelete={handleDelete}
                      onOpenPaymentModal={() => handleOpenPaymentModal(inscription)}
                      isEditing={editingId === inscription.id}
                      editData={editData}
                      setEditData={setEditData}
                      onEdit={() => handleEdit(inscription)}
                      onSave={handleSaveEdit}
                      onCancel={handleCancelEdit}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
                  </PaginationItem>
                  {getPaginationItems()}
                  <PaginationItem>
                    <PaginationNext onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentDetailsDialog
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        inscription={selectedInscription}
        onPaymentUpdate={() => {
          fetchInscriptions();
        }}
      />
    </>
  );
};

export default InscriptionsTable;
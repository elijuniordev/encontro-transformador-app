// src/components/management/InscriptionsTable.tsx
import { useState } from "react";
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

interface InscriptionsTableProps {
  filteredInscriptions: Inscription[];
  userRole: string | null;
  userDiscipulado: string | null;
  getStatusBadge: (status: string) => JSX.Element;
  handleDelete: (id: string) => void;
  fetchInscriptions: () => void;
}

const InscriptionsTable = ({
  filteredInscriptions,
  userRole,
  userDiscipulado,
  getStatusBadge,
  handleDelete,
  fetchInscriptions
}: InscriptionsTableProps) => {
  const isMobile = useIsMobile();
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const { editingId, editData, setEditData, handleEdit, handleSaveEdit, handleCancelEdit } = useInscriptionEditor(fetchInscriptions);

  const handleOpenPaymentModal = (inscription: Inscription) => {
    setSelectedInscription(inscription);
    setPaymentModalOpen(true);
  };

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
          {isMobile ? (
            <div className="space-y-4">
              {filteredInscriptions.length === 0 ? (
                <Card className="shadow-sm border"><CardContent className="p-4 text-center text-muted-foreground">Nenhuma inscrição encontrada.</CardContent></Card>
              ) : (
                filteredInscriptions.map((inscription) => (
                  <MobileInscriptionCard
                    key={inscription.id}
                    inscription={inscription}
                    getStatusBadge={getStatusBadge}
                    handleDelete={handleDelete}
                    onOpenPaymentModal={() => handleOpenPaymentModal(inscription)}
                  />
                ))
              )}
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
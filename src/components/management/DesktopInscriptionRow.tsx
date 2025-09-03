// src/components/management/DesktopInscriptionRow.tsx
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Inscription } from "@/types/supabase";
import { TableRowActions } from "./table/TableRowActions";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { STATUS_PAGAMENTO_OPTIONS } from "@/config/options";
import { EyeIcon } from 'lucide-react';
import { InscriptionDetailsDialog } from './table/InscriptionDetailsDialog';

interface DesktopInscriptionRowProps {
  inscription: Inscription;
  getStatusBadge: (status: string) => JSX.Element;
  handleDelete: (id: string) => void;
  onOpenPaymentModal: () => void;
  isEditing: boolean;
  editData: Partial<Inscription>;
  setEditData: (data: Partial<Inscription>) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const DesktopInscriptionRow = ({
  inscription,
  getStatusBadge,
  handleDelete,
  onOpenPaymentModal,
  isEditing,
  editData,
  setEditData,
  onEdit,
  onSave,
  onCancel,
}: DesktopInscriptionRowProps) => {
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  const displayTotalValue = inscription.status_pagamento === 'Isento' ? 0 : inscription.total_value;

  return (
    <>
      <TableRow>
        <TableCell className="font-medium text-sm">{inscription.nome_completo}</TableCell>
        <TableCell className="text-sm">{inscription.discipuladores}</TableCell>
        <TableCell className="text-sm">{inscription.lider || '-'}</TableCell> {/* Adicionado */}
        <TableCell className="text-sm">{inscription.irmao_voce_e}</TableCell>
        
        <TableCell>
          {isEditing ? (
              <Input
                type="number"
                value={editData.total_value ?? ''}
                onChange={e => setEditData({ ...editData, total_value: Number(e.target.value) })}
                className="h-9 w-28 text-sm"
                disabled={editData.status_pagamento === 'Isento'}
              />
          ) : (
            <Button variant="ghost" onClick={onOpenPaymentModal} className="h-auto p-0 text-left flex flex-col items-start">
              <span className="font-semibold">
                R$ {inscription.paid_amount.toFixed(2).replace('.', ',')} / R$ {displayTotalValue.toFixed(2).replace('.', ',')}
              </span>
            </Button>
          )}
        </TableCell>
        
        <TableCell>
          {isEditing ? (
              <Select
                value={editData.status_pagamento}
                onValueChange={(value) => {
                  const newData = { ...editData, status_pagamento: value };
                  if (value === 'Isento') {
                      newData.total_value = 0;
                  }
                  setEditData(newData);
                }}
              >
                  <SelectTrigger className="h-9 w-[130px] text-xs">
                      <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                      {STATUS_PAGAMENTO_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
              </Select>
          ) : getStatusBadge(inscription.status_pagamento)}
        </TableCell>
        
        <TableCell>
          {isEditing ? (
              <Input 
                  value={editData.observacao || ''} 
                  onChange={e => setEditData({ ...editData, observacao: e.target.value })} 
                  className="h-9 text-sm"
              />
          ) : (
              <div className="min-h-8 text-sm">
                  {inscription.observacao || "-"}
              </div>
          )}
        </TableCell>

        {/* Célula para o botão de detalhes (olho) */}
        <TableCell className="text-right">
            <Button variant="ghost" className="p-2 h-8 w-8" onClick={() => setDetailsModalOpen(true)}>
                <EyeIcon className="h-4 w-4" />
            </Button>
        </TableCell>
        
        <TableCell>
          <TableRowActions
            inscription={inscription}
            isEditing={isEditing}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            onDelete={handleDelete}
          />
        </TableCell>
      </TableRow>

      <InscriptionDetailsDialog
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        inscription={inscription}
      />
    </>
  );
};
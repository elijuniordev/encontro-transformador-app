// src/components/management/DesktopInscriptionRow.tsx
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Inscription } from "@/types/supabase";
import { TableRowActions } from "./table/TableRowActions";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { STATUS_PAGAMENTO_OPTIONS } from "@/config/options";

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

  // **INÍCIO DA CORREÇÃO**
  // Garante que o valor total exibido seja 0 se o status for "Isento"
  const displayTotalValue = inscription.status_pagamento === 'Isento' ? 0 : inscription.total_value;
  // **FIM DA CORREÇÃO**

  return (
    <TableRow>
      <TableCell className="font-medium text-sm">{inscription.nome_completo}</TableCell>
      <TableCell className="text-sm">{inscription.discipuladores}</TableCell>
      <TableCell className="text-sm">{inscription.whatsapp}</TableCell>
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
              {/* CORREÇÃO AQUI */}
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
  );
};
// src/components/management/DesktopInscriptionRow.tsx
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inscription } from "@/types/supabase";
import { FORMA_PAGAMENTO_OPTIONS, STATUS_PAGAMENTO_OPTIONS } from "@/config/options";
import { TableRowActions } from "./table/TableRowActions";
import { EmergencyContactsDialog } from "./table/EmergencyContactsDialog";

interface DesktopInscriptionRowProps {
  inscription: Inscription;
  getStatusBadge: (status: string) => JSX.Element;
  editingId: string | null;
  editData: Partial<Inscription>;
  handleEdit: (inscription: Inscription) => void;
  handleSaveEdit: () => void;
  setEditingId: (id: string | null) => void;
  setEditData: (data: Partial<Inscription>) => void;
  handleDelete: (id: string) => void;
}

export const DesktopInscriptionRow = ({
  inscription,
  getStatusBadge,
  editingId,
  editData,
  handleEdit,
  handleSaveEdit,
  setEditingId,
  setEditData,
  handleDelete,
}: DesktopInscriptionRowProps) => {
  const isEditing = editingId === inscription.id;

  return (
    <TableRow className={isEditing ? "bg-accent" : ""}>
      <TableCell className="font-medium text-sm">{inscription.nome_completo}</TableCell>
      <TableCell className="text-sm">{inscription.discipuladores}</TableCell>
      <TableCell className="text-sm">{inscription.lider}</TableCell>
      <TableCell className="text-sm">{inscription.anjo_guarda || "-"}</TableCell>
      <TableCell className="text-sm">{inscription.whatsapp}</TableCell>
      <TableCell className="text-sm">{inscription.irmao_voce_e}</TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editData.status_pagamento || ''}
            onValueChange={(value) => {
              const newData: Partial<Inscription> = { ...editData, status_pagamento: value };
              if (['Pendente', 'Cancelado', 'Isento'].includes(value)) {
                newData.forma_pagamento = null;
              }
              setEditData(newData);
            }}
          >
            <SelectTrigger className="w-[110px] text-xs sm:text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUS_PAGAMENTO_OPTIONS.map(option => (<SelectItem key={option} value={option}>{option}</SelectItem>))}</SelectContent>
          </Select>
        ) : getStatusBadge(inscription.status_pagamento)}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editData.forma_pagamento || ''}
            onValueChange={(value) => setEditData({ ...editData, forma_pagamento: value })}
            disabled={['Pendente', 'Cancelado', 'Isento'].includes(editData.status_pagamento || '')}
          >
            <SelectTrigger className="w-[100px] text-xs sm:text-sm"><SelectValue placeholder="N/A" /></SelectTrigger>
            <SelectContent>{FORMA_PAGAMENTO_OPTIONS.map(option => (<SelectItem key={option} value={option}>{option}</SelectItem>))}</SelectContent>
          </Select>
        ) : (inscription.forma_pagamento || "-")}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input type="number" value={editData.valor !== undefined ? String(editData.valor) : ''} onChange={(e) => setEditData({ ...editData, valor: Number(e.target.value) })} className="w-20 text-xs sm:text-sm" />
        ) : (`R$ ${inscription.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)}
      </TableCell>
      <TableCell>
        <EmergencyContactsDialog inscription={inscription} />
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input value={editData.observacao || ''} onChange={(e) => setEditData({ ...editData, observacao: e.target.value })} className="w-32 text-xs sm:text-sm" placeholder="Observação..." />
        ) : (inscription.observacao || "-")}
      </TableCell>
      <TableCell>
        <TableRowActions
          inscription={inscription}
          isEditing={isEditing}
          onEdit={() => handleEdit(inscription)}
          onSave={handleSaveEdit}
          onCancel={() => setEditingId(null)}
          onDelete={handleDelete}
        />
      </TableCell>
    </TableRow>
  );
};
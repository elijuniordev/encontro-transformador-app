// src/components/management/mobile/MobileCardEditMode.tsx
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inscription } from "@/types/supabase";
import { FORMA_PAGAMENTO_OPTIONS, STATUS_PAGAMENTO_OPTIONS } from "@/config/options";
import { MobileCardActions } from "./MobileCardActions";

interface MobileCardEditModeProps {
  inscription: Inscription;
  editData: Partial<Inscription>;
  setEditData: (data: Partial<Inscription>) => void;
  handleSaveEdit: () => void;
  setEditingId: (id: string | null) => void;
  handleDelete: (id: string) => void; // Pass down for actions
}

export const MobileCardEditMode = ({
  inscription,
  editData,
  setEditData,
  handleSaveEdit,
  setEditingId,
  handleDelete
}: MobileCardEditModeProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
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
        <SelectTrigger className="w-full text-sm">
          <SelectValue placeholder="Status Pagamento" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_PAGAMENTO_OPTIONS.map(option => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={editData.forma_pagamento || ''}
        onValueChange={(value) => setEditData({ ...editData, forma_pagamento: value })}
        disabled={['Pendente', 'Cancelado', 'Isento'].includes(editData.status_pagamento || '')}
      >
        <SelectTrigger className="w-full text-sm">
          <SelectValue placeholder="Forma Pagamento" />
        </SelectTrigger>
        <SelectContent>
          {FORMA_PAGAMENTO_OPTIONS.map(option => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        value={editData.valor !== undefined ? String(editData.valor) : ''}
        onChange={(e) => setEditData({ ...editData, valor: Number(e.target.value) })}
        className="w-full text-sm"
        placeholder="Valor"
      />
      <Input
        value={editData.observacao || ''}
        onChange={(e) => setEditData({ ...editData, observacao: e.target.value })}
        className="w-full text-sm"
        placeholder="Observação..."
      />
      <MobileCardActions
        inscription={inscription}
        isEditing={true}
        onEdit={() => {}} // Not used in edit mode
        onSave={handleSaveEdit}
        onCancel={() => setEditingId(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};
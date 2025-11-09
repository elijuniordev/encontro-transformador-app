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
  handleDelete: (id: string) => void;
  userRole: string | null; // ADICIONADO
}

export const MobileCardEditMode = ({
  inscription,
  editData,
  setEditData,
  handleSaveEdit,
  setEditingId,
  handleDelete,
  userRole, // ADICIONADO
}: MobileCardEditModeProps) => {
  // NOVO: A permissão de edição/deleção é para 'admin' e 'discipulador'.
  const isReadOnly = userRole === 'viewer';
  
  return (
    <div className="flex flex-col gap-2 w-full">
      <Select
        value={editData.status_pagamento || ''}
        onValueChange={(value) => {
          const newData: Partial<Inscription> = { ...editData, status_pagamento: value };
          if (value === 'Isento') {
            newData.total_value = 0;
            newData.forma_pagamento = null;
          }
          if (['Pendente', 'Cancelado'].includes(value)) {
            newData.forma_pagamento = null;
          }
          setEditData(newData);
        }}
        disabled={isReadOnly} // DESABILITA A EDIÇÃO DE STATUS
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
        disabled={['Pendente', 'Cancelado', 'Isento'].includes(editData.status_pagamento || '') || isReadOnly} // DESABILITA A EDIÇÃO DE FORMA
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
        value={editData.total_value !== undefined ? String(editData.total_value) : ''}
        onChange={(e) => setEditData({ ...editData, total_value: Number(e.target.value) })}
        className="w-full text-sm"
        placeholder="Valor"
        disabled={editData.status_pagamento === 'Isento' || isReadOnly} // DESABILITA A EDIÇÃO DE VALOR
      />
      <Input
        value={editData.observacao || ''}
        onChange={(e) => setEditData({ ...editData, observacao: e.target.value })}
        className="w-full text-sm"
        placeholder="Observação..."
        disabled={isReadOnly} // DESABILITA A EDIÇÃO DE OBS
      />
      <MobileCardActions
        inscription={inscription}
        isEditing={true}
        onEdit={() => {}}
        onSave={handleSaveEdit}
        onCancel={() => setEditingId(null)}
        onDelete={handleDelete}
        userRole={userRole}
      />
    </div>
  );
};
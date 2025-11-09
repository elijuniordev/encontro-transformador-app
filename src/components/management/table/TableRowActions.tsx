// src/components/management/table/TableRowActions.tsx
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Inscription } from "@/types/supabase";
import { Edit, Trash2 } from "lucide-react";

interface TableRowActionsProps {
  inscription: Inscription;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  userRole: string | null; // ADICIONADO
}

export const TableRowActions = ({
  inscription,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  userRole, // ADICIONADO
}: TableRowActionsProps) => {
  // NOVO: A permissão de edição/deleção é para 'admin' e 'discipulador'.
  const isReadOnly = userRole === 'viewer';
  
  if (isEditing) {
    return (
      <div className="flex gap-1">
        <Button size="sm" onClick={onSave} className="text-xs px-2 py-1" disabled={isReadOnly}>
          Salvar
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="text-xs px-2 py-1">
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline" onClick={onEdit} className="px-2 py-1" disabled={isReadOnly}>
            <Edit className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Editar</p></TooltipContent>
      </Tooltip>
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" className="px-2 py-1" disabled={isReadOnly}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent><p>Deletar</p></TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a inscrição de {inscription.nome_completo}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(inscription.id)}>
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
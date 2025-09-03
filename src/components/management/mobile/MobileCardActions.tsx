// src/components/management/mobile/MobileCardActions.tsx
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { Inscription } from "@/types/supabase";

interface MobileCardActionsProps {
  inscription: Inscription;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

export const MobileCardActions = ({
  inscription,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: MobileCardActionsProps) => {
  if (isEditing) {
    return (
      <div className="flex gap-2 justify-end w-full">
        <Button size="sm" onClick={onSave} className="text-sm">Salvar</Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="text-sm">Cancelar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2 w-full mt-3">
      <Button size="sm" variant="outline" onClick={onEdit} className="w-1/2">
        <Edit className="h-4 w-4 mr-2" /> Editar
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" className="w-1/2">
            <Trash2 className="h-4 w-4 mr-2" /> Deletar
          </Button>
        </AlertDialogTrigger>
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
// src/components/management/table/EmergencyContactsDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Inscription } from "@/types/supabase";
import { Eye } from "lucide-react";

interface EmergencyContactsDialogProps {
  inscription: Inscription;
}

export const EmergencyContactsDialog = ({ inscription }: EmergencyContactsDialogProps) => {
  // Renderiza o botão apenas para Encontristas ou Crianças que têm responsáveis
  if (!["Encontrista", "Criança"].includes(inscription.irmao_voce_e)) {
    return <span>-</span>;
  }

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="px-2 py-1">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ver Contatos</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contatos de Emergência</DialogTitle>
          <DialogDescription>
            Responsáveis por {inscription.nome_completo}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {inscription.responsavel_1_nome && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Responsável 1</h4>
              <p>Nome: {inscription.responsavel_1_nome}</p>
              <p>WhatsApp: {inscription.responsavel_1_whatsapp}</p>
            </div>
          )}
          {inscription.responsavel_2_nome && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Responsável 2</h4>
              <p>Nome: {inscription.responsavel_2_nome}</p>
              <p>WhatsApp: {inscription.responsavel_2_whatsapp}</p>
            </div>
          )}
          {inscription.responsavel_3_nome && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Responsável 3</h4>
              <p>Nome: {inscription.responsavel_3_nome}</p>
              <p>WhatsApp: {inscription.responsavel_3_whatsapp}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
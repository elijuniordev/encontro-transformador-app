// src/components/management/DesktopInscriptionRow.tsx
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Inscription } from "@/types/supabase";
import { TableRowActions } from "./table/TableRowActions"; // Ações foram extraídas
import { useState } from "react";
import { Input } from "../ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DesktopInscriptionRowProps {
  inscription: Inscription;
  getStatusBadge: (status: string) => JSX.Element;
  handleDelete: (id: string) => void;
  onOpenPaymentModal: () => void;
}

export const DesktopInscriptionRow = ({
  inscription,
  getStatusBadge,
  handleDelete,
  onOpenPaymentModal,
}: DesktopInscriptionRowProps) => {
    const { toast } = useToast();
    const [isEditingObs, setIsEditingObs] = useState(false);
    const [obsText, setObsText] = useState(inscription.observacao || '');

    const handleSaveObs = async () => {
        const { error } = await supabase.from('inscriptions').update({ observacao: obsText }).eq('id', inscription.id);
        if(error) {
            toast({ title: "Erro ao salvar observação.", variant: "destructive" });
        } else {
            toast({ title: "Observação salva!" });
            inscription.observacao = obsText; // Atualiza localmente para evitar refetch
        }
        setIsEditingObs(false);
    }

  return (
    <TableRow>
      <TableCell className="font-medium text-sm">{inscription.nome_completo}</TableCell>
      <TableCell className="text-sm">{inscription.discipuladores}</TableCell>
      <TableCell className="text-sm">{inscription.whatsapp}</TableCell>
      <TableCell className="text-sm">{inscription.irmao_voce_e}</TableCell>
      
      {/* Nova célula de Pagamento */}
      <TableCell>
        <Button variant="ghost" onClick={onOpenPaymentModal} className="h-auto p-1 text-left flex flex-col items-start">
          <span className="font-semibold">
            R$ {inscription.paid_amount.toFixed(2)} / R$ {inscription.total_value.toFixed(2)}
          </span>
          {getStatusBadge(inscription.status_pagamento)}
        </Button>
      </TableCell>
      
      {/* Célula de Observação Editável */}
      <TableCell>
        {isEditingObs ? (
            <div className="flex gap-1">
                <Input value={obsText} onChange={e => setObsText(e.target.value)} className="text-xs h-8"/>
                <Button size="sm" onClick={handleSaveObs} className="text-xs">Salvar</Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditingObs(false)} className="text-xs">X</Button>
            </div>
        ) : (
            <div onClick={() => setIsEditingObs(true)} className="min-h-8 cursor-pointer">
                {inscription.observacao || "-"}
            </div>
        )}
      </TableCell>
      
      <TableCell>
        <TableRowActions
          inscription={inscription}
          isEditing={false} // A edição inline foi removida
          onEdit={() => {}} // A edição agora é via modal
          onSave={() => {}}
          onCancel={() => {}}
          onDelete={handleDelete}
        />
      </TableCell>
    </TableRow>
  );
};
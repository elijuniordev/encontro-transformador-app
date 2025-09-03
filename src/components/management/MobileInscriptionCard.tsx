// src/components/management/MobileInscriptionCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inscription } from "@/types/supabase";
import { MobileCardActions } from "./mobile/MobileCardActions";

interface MobileInscriptionCardProps {
  inscription: Inscription;
  getStatusBadge: (status: string) => JSX.Element;
  handleDelete: (id: string) => void;
  onOpenPaymentModal: () => void;
}

export const MobileInscriptionCard = ({
  inscription,
  getStatusBadge,
  handleDelete,
  onOpenPaymentModal
}: MobileInscriptionCardProps) => {

  return (
    <Card className="shadow-sm border mb-4">
      <CardContent className="p-4 space-y-2 text-sm">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
            <p className="font-bold text-primary flex-grow min-w-0">
                {inscription.nome_completo}
            </p>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {/* CORREÇÃO: Ajustado o nome da propriedade */}
            <p><strong className="text-primary">Função:</strong> {inscription.irmao_voce_e}</p>
            <p><strong className="text-primary">Discipulador:</strong> {inscription.discipuladores}</p>
            <p><strong className="text-primary">WhatsApp:</strong> {inscription.whatsapp}</p>
        </div>

        {/* Nova Seção de Pagamento */}
        <div className="border-t pt-3 mt-3">
            <p className="font-semibold text-primary mb-2">Status do Pagamento</p>
            <Button variant="ghost" onClick={onOpenPaymentModal} className="h-auto p-1 text-left flex flex-col items-start w-full">
                <span className="font-semibold text-base">
                    R$ {inscription.paid_amount.toFixed(2)} / R$ {inscription.total_value.toFixed(2)}
                </span>
                {getStatusBadge(inscription.status_pagamento)}
            </Button>
        </div>

        <MobileCardActions
            inscription={inscription}
            isEditing={false}
            onEdit={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
            onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};
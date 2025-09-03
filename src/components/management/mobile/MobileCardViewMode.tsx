// src/components/management/mobile/MobileCardViewMode.tsx
import { Inscription } from "@/types/supabase";

interface MobileCardViewModeProps {
  inscription: Inscription;
  getStatusBadge: (status: string) => JSX.Element;
}

export const MobileCardViewMode = ({ inscription, getStatusBadge }: MobileCardViewModeProps) => {
  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <p className="font-bold text-primary flex-grow min-w-0">Nome: <span className="font-normal text-foreground truncate">{inscription.nome_completo}</span></p>
        {getStatusBadge(inscription.status_pagamento)}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <p><strong className="text-primary">Função:</strong> {inscription.irmao_voce_e}</p>
        <p><strong className="text-primary">Anjo da Guarda:</strong> {inscription.anjo_guarda || "-"}</p>
        <p><strong className="text-primary">Discipulador:</strong> {inscription.discipuladores}</p>
        <p><strong className="text-primary">Líder:</strong> {inscription.lider}</p>
        <p><strong className="text-primary">WhatsApp:</strong> {inscription.whatsapp}</p>
        {/* CORREÇÃO APLICADA AQUI */}
        <p><strong className="text-primary">Valor:</strong> R$ {(inscription.total_value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong className="text-primary">Forma Pagamento:</strong> {inscription.forma_pagamento || "-"}</p>
        <p><strong className="text-primary">Observação:</strong> {inscription.observacao || "-"}</p>
      </div>

      {["Encontrista", "Criança"].includes(inscription.irmao_voce_e) && (
        <div className="mt-4 border-t pt-2">
          <p className="text-primary font-semibold mb-2">Contatos de Responsáveis:</p>
          <div className="grid grid-cols-1 gap-1 text-sm">
            {inscription.responsavel_1_nome && (
              <p><strong className="text-primary">Resp. 1:</strong> {inscription.responsavel_1_nome} ({inscription.responsavel_1_whatsapp})</p>
            )}
            {inscription.responsavel_2_nome && (
              <p><strong className="text-primary">Resp. 2:</strong> {inscription.responsavel_2_nome} ({inscription.responsavel_2_whatsapp})</p>
            )}
            {inscription.responsavel_3_nome && (
              <p><strong className="text-primary">Resp. 3:</strong> {inscription.responsavel_3_nome} ({inscription.responsavel_3_whatsapp})</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
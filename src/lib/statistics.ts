// src/lib/statistics.ts
import { Inscription, Payment } from "@/types/supabase";
import { 
  FORMA_PAGAMENTO_OPTIONS, 
  IRMAO_VOCE_E_OPTIONS as FUNCAO_OPTIONS 
} from "@/config/options";

export interface FinancialSummary {
  totalPaid: number;
  totalPending: number;
  totalPotential: number;
  waivedCount: number;
  paymentMethodCounts: { [key: string]: number };
}

export const calculateSituationCounts = (inscriptions: Inscription[]): { [key: string]: number } => {
  const counts: { [key: string]: number } = {};
  counts['Total'] = inscriptions.length;

  FUNCAO_OPTIONS.forEach(option => counts[option] = 0);

  inscriptions.forEach(inscription => {
    if (inscription.irmao_voce_e) {
      counts[inscription.irmao_voce_e] = (counts[inscription.irmao_voce_e] || 0) + 1;
    }
  });
  return counts;
};

/**
 * Calcula o resumo financeiro completo.
 * @param inscriptions Array de inscrições filtradas.
 * @param allPayments Array com TODOS os pagamentos do banco.
 * @returns Um objeto com o resumo financeiro.
 */
export const calculateFinancialSummary = (inscriptions: Inscription[], allPayments: Payment[]): FinancialSummary => {
  const summary: FinancialSummary = {
    totalPaid: 0,
    totalPending: 0,
    totalPotential: 0,
    waivedCount: 0,
    paymentMethodCounts: {},
  };

  FORMA_PAGAMENTO_OPTIONS.forEach(option => summary.paymentMethodCounts[option] = 0);

  const filteredInscriptionIds = new Set(inscriptions.map(i => i.id));

  inscriptions.forEach(inscription => {
    summary.totalPaid += inscription.paid_amount;

    if (inscription.status_pagamento === 'Isento') {
      summary.waivedCount += 1;
    } else if (inscription.status_pagamento !== 'Cancelado') {
      const pending = inscription.total_value - inscription.paid_amount;
      if (pending > 0) {
        summary.totalPending += pending;
      }
    }
  });

  const relevantPayments = allPayments.filter(p => filteredInscriptionIds.has(p.inscription_id));

  relevantPayments.forEach(payment => {
    // **INÍCIO DA CORREÇÃO**
    // Usa Object.hasOwn para uma verificação mais segura
    if (Object.hasOwn(summary.paymentMethodCounts, payment.payment_method)) {
        summary.paymentMethodCounts[payment.payment_method]++;
    }
    // **FIM DA CORREÇÃO**
  });

  summary.totalPotential = summary.totalPaid + summary.totalPending;

  return summary;
};
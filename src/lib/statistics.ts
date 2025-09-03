// src/lib/statistics.ts
import { Inscription } from "@/types/supabase";
import { 
  FORMA_PAGAMENTO_OPTIONS, 
  IRMAO_VOCE_E_OPTIONS as FUNCAO_OPTIONS 
} from "@/config/options";

// Estrutura para os totais financeiros
export interface FinancialSummary {
  totalPaid: number;
  totalPending: number;
  totalPotential: number;
  waivedCount: number;
  paymentMethodCounts: { [key: string]: number };
}

/**
 * Calcula a contagem de inscrições por função (Encontrista, Equipe, etc.).
 * @param inscriptions Array de inscrições filtradas.
 * @returns Um objeto com a contagem para cada função e o total.
 */
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
 * Calcula o resumo financeiro completo, incluindo totais e contagem por forma de pagamento.
 * @param inscriptions Array de inscrições filtradas.
 * @returns Um objeto com o resumo financeiro.
 */
export const calculateFinancialSummary = (inscriptions: Inscription[]): FinancialSummary => {
  const summary: FinancialSummary = {
    totalPaid: 0,
    totalPending: 0,
    totalPotential: 0,
    waivedCount: 0,
    paymentMethodCounts: {},
  };

  // Inicializa a contagem para todas as formas de pagamento
  FORMA_PAGAMENTO_OPTIONS.forEach(option => summary.paymentMethodCounts[option] = 0);

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

    // **INÍCIO DA CORREÇÃO**
    // Usa Object.hasOwn para uma verificação mais segura
    if (inscription.forma_pagamento && Object.hasOwn(summary.paymentMethodCounts, inscription.forma_pagamento)) {
        summary.paymentMethodCounts[inscription.forma_pagamento]++;
    }
    // **FIM DA CORREÇÃO**
  });

  summary.totalPotential = summary.totalPaid + summary.totalPending;

  return summary;
};
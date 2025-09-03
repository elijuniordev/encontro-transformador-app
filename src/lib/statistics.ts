// src/lib/statistics.ts
import { Inscription } from "@/types/supabase";
import { 
  FORMA_PAGAMENTO_OPTIONS, 
  STATUS_PAGAMENTO_OPTIONS, 
  IRMAO_VOCE_E_OPTIONS as FUNCAO_OPTIONS 
} from "@/config/options";

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
 * Calcula a contagem de status de pagamento e formas de pagamento confirmadas.
 * @param inscriptions Array de inscrições filtradas.
 * @returns Um objeto com a contagem para cada status e forma de pagamento.
 */
export const calculatePaymentMethodCounts = (inscriptions: Inscription[]): { [key: string]: number } => {
  const counts: { [key: string]: number } = {};
  [...FORMA_PAGAMENTO_OPTIONS, ...STATUS_PAGAMENTO_OPTIONS].forEach(option => counts[option] = 0);

  inscriptions.forEach(inscription => {
    // Conta as formas de pagamento apenas para os confirmados
    if (inscription.status_pagamento === 'Confirmado' && inscription.forma_pagamento) {
      if (Object.hasOwn(counts, inscription.forma_pagamento)) {
        counts[inscription.forma_pagamento]++;
      }
    }
    // Conta todos os status de pagamento
    if (inscription.status_pagamento) {
      if (Object.hasOwn(counts, inscription.status_pagamento)) {
        counts[inscription.status_pagamento]++;
      }
    }
  });
  return counts;
};
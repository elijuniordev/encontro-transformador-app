// src/lib/statistics.ts
import { Inscription, Payment } from "@/types/supabase";
import { 
  FORMA_PAGAMENTO_OPTIONS, 
  IRMAO_VOCE_E_OPTIONS as FUNCAO_OPTIONS,
  DISCIPULADORES_OPTIONS 
} from "@/config/options";

export interface FinancialSummary {
  totalPaid: number;
  totalPending: number;
  totalPotential: number;
  waivedCount: number;
  paymentMethodTotals: { [key: string]: number };
}

export interface DisciplineChartData {
  discipulador: string;
  total: number;
  [key: string]: number | string; // Index signature é mantida para os dados do gráfico
}

// Chave interna para o grupo consolidado (Pastores, Cozinha, Não-atribuídos)
const STAFF_CONSOLIDATED_KEY = '__STAFF_CONSOLIDATED__'; 

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
    paymentMethodTotals: {},
  };

  FORMA_PAGAMENTO_OPTIONS.forEach(option => summary.paymentMethodTotals[option] = 0);

  const filteredInscriptionIds = new Set(inscriptions.map(i => i.id));

  // **INÍCIO DA CORREÇÃO DEFINITIVA**
  inscriptions.forEach(inscription => {
    // 1. Soma todo o valor pago, exceto de inscrições canceladas.
    if (inscription.status_pagamento !== 'Cancelado') {
      summary.totalPaid += inscription.paid_amount;
    }

    // 2. Conta os isentos.
    if (inscription.status_pagamento === 'Isento') {
      summary.waivedCount += 1;
    }
    
    // 3. Soma o valor pendente APENAS de quem tem status "Pendente" ou "Pagamento Incompleto".
    if (inscription.status_pagamento === 'Pendente' || inscription.status_pagamento === 'Pagamento Incompleto') {
      const pendingAmount = inscription.total_value - inscription.paid_amount;
      if (pendingAmount > 0) {
        summary.totalPending += pendingAmount;
      }
    }
  });
  // **FIM DA CORREÇÃO DEFINITIVA**

  const relevantPayments = allPayments.filter(p => filteredInscriptionIds.has(p.inscription_id));

  relevantPayments.forEach(payment => {
    if (Object.hasOwn(summary.paymentMethodTotals, payment.payment_method)) {
      summary.paymentMethodTotals[payment.payment_method] += payment.amount;
    }
  });

  summary.totalPotential = summary.totalPaid + summary.totalPending;

  return summary;
};

// Função para calcular o TOTAL de inscrições por discipulador e função
export const calculateTotalInscriptionsByDiscipler = (inscriptions: Inscription[]): DisciplineChartData[] => {
  const relevantInscriptions = inscriptions; 
  
  const categories = FUNCAO_OPTIONS; 

  const groupedData: Record<string, Record<string, number>> = {};
  
  const OFFICIAL_DISCIPLINERS = new Set(DISCIPULADORES_OPTIONS);

  relevantInscriptions.forEach(i => {
    let discipuladorKey = i.discipuladores || 'N/A';
    const categoria = i.irmao_voce_e || 'Outro';

    // Se o discipulador não é oficial (ou é N/A), agrupamos no grupo consolidado.
    if (!OFFICIAL_DISCIPLINERS.has(discipuladorKey) || discipuladorKey === 'N/A') {
        discipuladorKey = STAFF_CONSOLIDATED_KEY;
    } 

    const categoryKey = categories.includes(categoria) ? categoria : 'Outro';

    if (!groupedData[discipuladorKey]) {
      groupedData[discipuladorKey] = {};
      categories.forEach(cat => groupedData[discipuladorKey][cat] = 0);
    }
    
    groupedData[discipuladorKey][categoryKey] = (groupedData[discipuladorKey][categoryKey] || 0) + 1;
  });

  // Mapear para o formato do gráfico
  return Object.entries(groupedData).map(([discipulador, counts]) => {
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    const finalCounts: Record<string, number | string> = { discipulador, total };
    categories.forEach(cat => {
      finalCounts[cat] = counts[cat] || 0;
    });

    return finalCounts as DisciplineChartData;
  }).filter(d => d.total > 0).sort((a, b) => (b.total as number) - (a.total as number)); 
};

// Exportar a chave interna para uso no componente de gráfico
export { STAFF_CONSOLIDATED_KEY };
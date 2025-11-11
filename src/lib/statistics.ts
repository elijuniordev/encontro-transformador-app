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
  paymentMethodTotals: { [key: string]: number };
}

// NOVO: Interface para os dados do gráfico por discipulador
export interface DisciplineChartData {
  discipulador: string;
  total: number;
  [key: string]: number | string; // Permite chaves dinâmicas para cada 'irmao_voce_e'
}
// FIM NOVO

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

// NOVO: Função para calcular inscrições por discipulador e função
export const calculateInscriptionsByDiscipler = (inscriptions: Inscription[]): DisciplineChartData[] => {
  // Filtra apenas as inscrições confirmadas ou isentas
  const relevantInscriptions = inscriptions.filter(
    (i) => ["Confirmado", "Isento"].includes(i.status_pagamento)
  );
  
  const categories = FUNCAO_OPTIONS; // Usando as opções do config

  const groupedData: Record<string, Record<string, number>> = {};

  relevantInscriptions.forEach(i => {
    const discipulador = i.discipuladores || 'N/A';
    const categoria = i.irmao_voce_e || 'Outro';

    if (!groupedData[discipulador]) {
      groupedData[discipulador] = {};
      categories.forEach(cat => groupedData[discipulador][cat] = 0);
    }
    
    // Incrementa a contagem para a categoria e discipulador
    const categoryKey = categories.includes(categoria) ? categoria : 'Outro';
    
    groupedData[discipulador][categoryKey] = (groupedData[discipulador][categoryKey] || 0) + 1;
  });

  return Object.entries(groupedData).map(([discipulador, counts]) => {
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    // Garantir que todas as categorias listadas em FUNCAO_OPTIONS existam no objeto
    const finalCounts: Record<string, number | string> = { discipulador, total };
    categories.forEach(cat => {
      finalCounts[cat] = counts[cat] || 0;
    });

    return finalCounts as DisciplineChartData;
  }).filter(d => d.total > 0).sort((a, b) => (b.total as number) - (a.total as number)); 
};
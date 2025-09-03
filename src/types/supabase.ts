// src/types/supabase.ts

export type Inscription = {
  id: string;
  created_at: string;
  updated_at: string;
  nome_completo: string;
  sexo: 'masculino' | 'feminino';
  idade: string;
  whatsapp: string;
  irmao_voce_e: string;
  discipuladores: string;
  lider: string;
  anjo_guarda: string;
  responsavel_1_nome: string | null;
  responsavel_1_whatsapp: string | null;
  responsavel_2_nome: string | null;
  responsavel_2_whatsapp: string | null;
  responsavel_3_nome: string | null;
  responsavel_3_whatsapp: string | null;
  observacao: string | null;
  
  // Campos de pagamento atualizados
  status_pagamento: string;
  total_value: number;
  paid_amount: number;

  // ADICIONE ESTA LINHA
  forma_pagamento: string | null;
  
  acompanhante_nome?: string | null;
  acompanhante_parentesco?: string | null;
};

// ... o restante do arquivo permanece igual
export type Payment = {
  id: string;
  inscription_id: string;
  amount: number;
  payment_method: string;
  created_at: string;
};

export type User = {
    created_at: string;
    discipulado: string | null;
    email: string;
    id: string;
    password_hash: string;
    role: string;
};

export type EventSettings = {
    created_at: string;
    id: string;
    registrations_open: boolean;
    updated_at: string;
};
// src/types/supabase.ts

export type Inscription = {
    anjo_guarda: string;
    created_at: string;
    discipuladores: string;
    forma_pagamento: string | null;
    id: string;
    idade: string;
    irmao_voce_e: string;
    lider: string;
    nome_completo: string;
    observacao: string | null;
    responsavel_1_nome: string | null;
    responsavel_1_whatsapp: string | null;
    responsavel_2_nome: string | null;
    responsavel_2_whatsapp: string | null;
    responsavel_3_nome: string | null;
    responsavel_3_whatsapp: string | null;
    // REMOVA a linha abaixo
    // sexo: string;
    // ADICIONE a linha abaixo
    sexo: 'masculino' | 'feminino';
    status_pagamento: string;
    updated_at: string;
    valor: number;
    whatsapp: string;
    acompanhante_nome?: string | null; // Adicionado para consistência
    acompanhante_parentesco?: string | null; // Adicionado para consistência
};

// ... o resto do arquivo permanece o mesmo
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
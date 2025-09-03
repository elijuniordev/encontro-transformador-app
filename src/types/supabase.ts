// src/types/supabase.ts
// REMOVA a linha de importação abaixo
// import { Database as DB } from "@/integrations/supabase/types";

// Substitua a linha abaixo
// type Tables<T extends keyof DB['public']['Tables']> = DB['public']['Tables'][T]['Row'];

// Por esta definição direta
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
    sexo: string;
    status_pagamento: string;
    updated_at: string;
    valor: number;
    whatsapp: string;
};

// Mantenha as outras exportações como estão
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
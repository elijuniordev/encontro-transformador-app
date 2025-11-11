// src/types/supabase.ts

// Define um tipo genérico para JSON
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Tipos de Linha (ROW Types)
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
  status_pagamento: string;
  total_value: number;
  paid_amount: number;
  forma_pagamento: string | null;
  
  acompanhante_nome?: string | null;
  acompanhante_parentesco?: string | null;
};

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
    role: 'admin' | 'discipulador' | 'viewer';
};

export type EventSettings = {
    created_at: string;
    id: string;
    registrations_open: boolean;
    updated_at: string;
};

// ====================================================================
// Tipo DATABASE principal para o Supabase Client (CORRIGIDO PARA LINT)
// ====================================================================

// Substitui 'any' por 'unknown'
type InsertType<T extends Record<string, unknown>> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
type UpdateType<T extends Record<string, unknown>> = Partial<InsertType<T>>;

// Tipo para objetos vazios (resolve o erro 'no-empty-object-type')
type EmptyObject = Record<string, never>;

export type Database = {
  public: {
    Tables: {
      inscriptions: {
        Row: Inscription;
        Insert: InsertType<Inscription>;
        Update: UpdateType<Inscription>;
      };
      payments: {
        Row: Payment;
        Insert: InsertType<Payment>;
        Update: UpdateType<Payment>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      event_settings: {
        Row: EventSettings;
        Insert: InsertType<EventSettings>;
        Update: UpdateType<EventSettings>;
      };
    };
    Views: EmptyObject; // Corrigido
    Functions: EmptyObject; // Corrigido
    Enums: EmptyObject; // Corrigido
    CompositeTypes: EmptyObject; // Corrigido
  };
};
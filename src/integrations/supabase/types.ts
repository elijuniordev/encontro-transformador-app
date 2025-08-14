export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      event_settings: {
        Row: {
          created_at: string
          id: string
          registrations_open: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          registrations_open?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          registrations_open?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      inscriptions: {
        Row: {
          anjo_guarda: string
          created_at: string
          discipuladores: string
          forma_pagamento: string | null
          id: string
          idade: string
          irmao_voce_e: string
          lider: string
          nome_completo: string
          observacao: string | null
          responsavel_1_nome: string | null
          responsavel_1_whatsapp: string | null
          responsavel_2_nome: string | null
          responsavel_2_whatsapp: string | null
          responsavel_3_nome: string | null
          responsavel_3_whatsapp: string | null
          sexo: string
          status_pagamento: string
          updated_at: string
          valor: number
          whatsapp: string
        }
        Insert: {
          anjo_guarda: string
          created_at?: string
          discipuladores: string
          forma_pagamento?: string | null
          id?: string
          idade: string
          irmao_voce_e: string
          lider: string
          nome_completo: string
          observacao?: string | null
          responsavel_1_nome?: string | null
          responsavel_1_whatsapp?: string | null
          responsavel_2_nome?: string | null
          responsavel_2_whatsapp?: string | null
          responsavel_3_nome?: string | null
          responsavel_3_whatsapp?: string | null
          sexo: string
          status_pagamento?: string
          updated_at?: string
          valor?: number
          whatsapp: string
        }
        Update: {
          anjo_guarda?: string
          created_at?: string
          discipuladores?: string
          forma_pagamento?: string | null
          id?: string
          idade?: string
          irmao_voce_e?: string
          lider?: string
          nome_completo?: string
          observacao?: string | null
          responsavel_1_nome?: string | null
          responsavel_1_whatsapp?: string | null
          responsavel_2_nome?: string | null
          responsavel_2_whatsapp?: string | null
          responsavel_3_nome?: string | null
          responsavel_3_whatsapp?: string | null
          sexo?: string
          status_pagamento?: string
          updated_at?: string
          valor?: number
          whatsapp?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          discipulado: string | null
          email: string
          id: string
          password_hash: string
          role: string
        }
        Insert: {
          created_at?: string
          discipulado?: string | null
          email: string
          id?: string
          password_hash: string
          role: string
        }
        Update: {
          created_at?: string
          discipulado?: string | null
          email?: string
          id?: string
          password_hash?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
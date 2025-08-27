// src/types/supabase.ts
import { Database as DB } from "@/integrations/supabase/types";

type Tables<T extends keyof DB['public']['Tables']> = DB['public']['Tables'][T]['Row'];

export type Inscription = Tables<'inscriptions'>;
export type User = Tables<'users'>;
export type EventSettings = Tables<'event_settings'>;

// Você pode adicionar outras tabelas aqui conforme necessário
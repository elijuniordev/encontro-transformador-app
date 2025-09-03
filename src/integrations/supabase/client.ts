// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
// REMOVA a linha abaixo
// import type { Database } from './types';

// Ler as chaves das variáveis de ambiente
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_KEY;

// Garante que as chaves existam
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_KEY são obrigatórias.');
}

// REMOVA a tipagem <Database> da criação do client
// export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {

// ADICIONE a linha abaixo, sem a tipagem genérica
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
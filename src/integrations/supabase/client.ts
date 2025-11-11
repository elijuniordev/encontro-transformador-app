// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase'; // Agora ele importa o tipo Database criado

// Ler as chaves das variáveis de ambiente
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY as string; // Chave pública Anon Key

// Garante que as chaves existam
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_KEY são obrigatórias.');
}

// CRÍTICO: Criando o cliente com a tipagem <Database>
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
    }
});
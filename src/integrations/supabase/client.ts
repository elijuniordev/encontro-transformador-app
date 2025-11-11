// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase'; // Caminho para o tipo Database

// Ler as chaves das variáveis de ambiente
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_KEY as string; 

// Garante que as chaves existam
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_KEY são obrigatórias.');
}

const supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
    }
});

// AÇÃO CORRETA: Removendo a lógica de signOut() que causava a race condition
// O cliente agora confia inteiramente na chave pública (Anon Key) para requisições anônimas.

export const supabase = supabaseClient;
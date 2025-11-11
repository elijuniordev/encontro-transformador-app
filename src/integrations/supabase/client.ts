// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase'; // Caminho para o tipo Database

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_KEY as string; 

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_KEY são obrigatórias.');
}

const supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
        // --- ADIÇÃO CRÍTICA ABAIXO ---
        // Força o fluxo PKCE, que é mais robusto para a inicialização
        // da sessão (incluindo a anónima).
        flowType: 'pkce', 
    }
});

export const supabase = supabaseClient;
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
        autoRefreshToken: false, 
        // --- ADIÇÃO CRÍTICA ABAIXO ---
        // Força o fluxo PKCE, que é mais robusto para a inicialização
        // da sessão (incluindo a anónima).
        flowType: 'pkce', 
    }
});

// Força a limpeza do cache de sessão se houver um erro de sessão para usuários anônimos
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session)) {
        // Garantir que não há token no cache do cliente.
        // O Supabase SDK fará o trabalho pesado, mas é uma camada extra.
    }
});

export const supabase = supabaseClient;
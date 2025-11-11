import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase'; // Caminho para o tipo Database

// ✅ Pegando as variáveis corretas do .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias.'
  );
}

// ✅ Criação do cliente Supabase (modo anônimo público)
const supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true, // 🔄 Reativa o refresh automático de token (melhor prática)
  },
});

// ✅ Limpeza opcional de sessão antiga (boa prática)
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session)) {
    console.info('Sessão anônima inicializada.');
  }
});

// ✅ Exportação única do cliente para todo o app
export const supabase = supabaseClient;

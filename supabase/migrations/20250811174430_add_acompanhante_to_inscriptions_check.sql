// elijuniordev/encontro-transformador-app/encontro-transformador-app-06542ef68f0aa9fe6edea1b21c44f86c78042166/supabase/migrations/20250811174430_add_acompanhante_to_inscriptions_check.sql
-- Remove a restrição de verificação antiga
ALTER TABLE public.inscriptions
DROP CONSTRAINT inscriptions_irmao_voce_e_check;

-- Adiciona a nova restrição de verificação com a opção 'Acompanhante', 'Criança' e 'Pastor...'
ALTER TABLE public.inscriptions
ADD CONSTRAINT inscriptions_irmao_voce_e_check CHECK (
    irmao_voce_e IN ('Encontrista', 'Equipe', 'Acompanhante', 'Cozinha', 'Criança', 'Pastor, obreiro ou discipulador')
);
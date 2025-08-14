-- Remove a restrição de verificação antiga
ALTER TABLE public.inscriptions
DROP CONSTRAINT inscriptions_irmao_voce_e_check;

-- Adiciona a nova restrição de verificação com a opção 'Acompanhante'
ALTER TABLE public.inscriptions
ADD CONSTRAINT inscriptions_irmao_voce_e_check CHECK (
    irmao_voce_e IN ('Encontrista', 'Equipe', 'Acompanhante', 'Cozinha')
);
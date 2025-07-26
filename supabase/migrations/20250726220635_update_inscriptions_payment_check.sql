-- supabase/migrations/SEUTIMESTAMP_update_inscriptions_payment_check.sql
-- (O timestamp no nome do seu arquivo será diferente)

-- 1. Remove a restrição CHECK existente na coluna forma_pagamento
ALTER TABLE public.inscriptions
DROP CONSTRAINT IF EXISTS inscriptions_forma_pagamento_check;

-- 2. Adiciona a nova restrição CHECK com as formas de pagamento atualizadas
ALTER TABLE public.inscriptions
ADD CONSTRAINT inscriptions_forma_pagamento_check CHECK (
    forma_pagamento IN (
        'Pix',
        'Cartão de Crédito',
        'CartaoCredito2x',   -- Novo valor
        'CartaoDebito',      -- Novo valor
        'Transferência',     -- Manter se ainda for usada como opção de SelectItem
        'Dinheiro'
    )
);
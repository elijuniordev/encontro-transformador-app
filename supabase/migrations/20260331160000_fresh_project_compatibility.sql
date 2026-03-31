-- Compatibility migration for bootstrapping a brand-new Supabase project
-- from this repo's current frontend expectations.

-- Ensure the timestamp helper exists with a safe search_path.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Bring inscriptions into sync with the frontend schema.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'inscriptions'
      AND column_name = 'valor'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'inscriptions'
      AND column_name = 'total_value'
  ) THEN
    ALTER TABLE public.inscriptions RENAME COLUMN valor TO total_value;
  END IF;
END $$;

ALTER TABLE public.inscriptions
  ALTER COLUMN discipuladores DROP NOT NULL,
  ALTER COLUMN lider DROP NOT NULL;

ALTER TABLE public.inscriptions
  ADD COLUMN IF NOT EXISTS total_value NUMERIC(10,2) NOT NULL DEFAULT 200.00,
  ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS acompanhante_nome TEXT,
  ADD COLUMN IF NOT EXISTS acompanhante_parentesco TEXT,
  ADD COLUMN IF NOT EXISTS observacao TEXT;

UPDATE public.inscriptions
SET total_value = 200.00
WHERE total_value IS NULL;

UPDATE public.inscriptions
SET paid_amount = 0.00
WHERE paid_amount IS NULL;

ALTER TABLE public.inscriptions
  ALTER COLUMN total_value SET DEFAULT 200.00,
  ALTER COLUMN paid_amount SET DEFAULT 0.00;

ALTER TABLE public.inscriptions
  DROP CONSTRAINT IF EXISTS inscriptions_status_pagamento_check,
  DROP CONSTRAINT IF EXISTS inscriptions_forma_pagamento_check,
  DROP CONSTRAINT IF EXISTS inscriptions_irmao_voce_e_check;

ALTER TABLE public.inscriptions
  ADD CONSTRAINT inscriptions_status_pagamento_check CHECK (
    status_pagamento IN (
      'Pendente',
      'Confirmado',
      'Parcial',
      'Pagamento Incompleto',
      'Cancelado',
      'Isento'
    )
  );

ALTER TABLE public.inscriptions
  ADD CONSTRAINT inscriptions_irmao_voce_e_check CHECK (
    irmao_voce_e IN (
      'Encontrista',
      'Equipe',
      'Acompanhante',
      'Cozinha',
      'Criança',
      'Pastor, obreiro ou discipulador'
    )
  );

-- The app can concatenate multiple payment methods into a single string
-- (for example "Pix, Dinheiro"), so forma_pagamento cannot use a strict enum-like check.

DROP POLICY IF EXISTS "Admin and discipulador can delete inscriptions" ON public.inscriptions;
CREATE POLICY "Admin and discipulador can delete inscriptions"
ON public.inscriptions
FOR DELETE
USING (true);

-- Create the payments table expected by the management UI.
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inscription_id UUID NOT NULL REFERENCES public.inscriptions(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can delete payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can update payments" ON public.payments;

CREATE POLICY "Anyone can read payments"
ON public.payments
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert payments"
ON public.payments
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update payments"
ON public.payments
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete payments"
ON public.payments
FOR DELETE
USING (true);

-- Allow the frontend's viewer role too.
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'discipulador', 'viewer'));

-- Make the event settings policy match how the app actually stores users:
-- auth happens in Supabase Auth and the profile lookup is by email.
DROP POLICY IF EXISTS "Admin can update event settings" ON public.event_settings;
CREATE POLICY "Admin can update event settings"
ON public.event_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users u
    WHERE lower(u.email) = lower(auth.jwt() ->> 'email')
      AND u.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users u
    WHERE lower(u.email) = lower(auth.jwt() ->> 'email')
      AND u.role = 'admin'
  )
);

-- Ensure the settings row exists.
INSERT INTO public.event_settings (registrations_open)
SELECT TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.event_settings
);

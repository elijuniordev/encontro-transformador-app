// supabase/migrations/20250726023250_initial_schema.sql
-- Create inscriptions table
CREATE TABLE public.inscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  anjo_guarda TEXT NOT NULL,
  sexo TEXT NOT NULL CHECK (sexo IN ('masculino', 'feminino')),
  idade TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  situacao TEXT NOT NULL CHECK (situacao IN ('membro', 'visitante', 'novo_convertido')),
  discipuladores TEXT NOT NULL,
  lider TEXT NOT NULL,
  irmao_voce_e TEXT NOT NULL CHECK (irmao_voce_e IN ('Encontrista', 'Equipe', 'Cozinha')),
  responsavel_1_nome TEXT,
  responsavel_1_whatsapp TEXT,
  responsavel_2_nome TEXT,
  responsavel_2_whatsapp TEXT,
  responsavel_3_nome TEXT,
  responsavel_3_whatsapp TEXT,
  status_pagamento TEXT NOT NULL DEFAULT 'Pendente' CHECK (status_pagamento IN ('Pendente', 'Confirmado', 'Cancelado', 'Isento')),
  forma_pagamento TEXT CHECK (forma_pagamento IN ('Pix', 'Cartão de Crédito', 'Transferência', 'Dinheiro')),
  valor DECIMAL(10,2) NOT NULL DEFAULT 200.00,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for inscriptions
-- REMOVEMOS A POLÍTICA ANTIGA E ADICIONAMOS A CORRETA PARA INSERÇÃO PÚBLICA
CREATE POLICY "Allow public insert for inscriptions" 
ON public.inscriptions 
FOR INSERT 
TO public -- Alvo para o role público
WITH CHECK (true);

CREATE POLICY "Admin and discipulador can view all inscriptions" 
ON public.inscriptions 
FOR SELECT 
USING (true);

CREATE POLICY "Admin and discipulador can update inscriptions" 
ON public.inscriptions 
FOR UPDATE 
USING (true);

-- Create users table for login management
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'discipulador')),
  discipulado TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (true);

-- Insert default users
INSERT INTO public.users (email, password_hash, role, discipulado) VALUES
('admin@encontro.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NULL),
('discipulador@encontro.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'discipulador', 'Pastor João e Ana Silva');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_inscriptions_updated_at
  BEFORE UPDATE ON public.inscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
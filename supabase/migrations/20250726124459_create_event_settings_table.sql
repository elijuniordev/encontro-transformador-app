-- supabase/migrations/SEUTIMESTAMP_create_event_settings_table.sql
-- (O timestamp no nome do seu arquivo será diferente)

-- Cria a tabela de configurações do evento
CREATE TABLE public.event_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Este campo controlará se as inscrições estão abertas (true) ou fechadas (false)
    registrations_open BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ativa o Row Level Security (RLS) para a nova tabela
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Apenas o ADMIN pode atualizar o status das inscrições
-- Esta política permite que usuários autenticados com o papel 'admin' atualizem a tabela.
CREATE POLICY "Admin can update event settings"
ON public.event_settings
FOR UPDATE
TO authenticated -- Ou um RLS mais específico para 'admin'
USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')); -- Verifica se o usuário autenticado é admin

-- Policy: Qualquer um pode ler o status das inscrições (necessário para o formulário público)
-- Esta política permite que qualquer um selecione dados desta tabela.
CREATE POLICY "Anyone can read event settings"
ON public.event_settings
FOR SELECT
USING (true);

-- Insere uma linha inicial com as inscrições abertas por padrão
-- É crucial ter pelo menos uma linha nesta tabela para ler/atualizar o status.
INSERT INTO public.event_settings (registrations_open)
VALUES (TRUE);

-- Cria uma função para atualizar o timestamp 'updated_at' automaticamente
-- (Verifique se esta função já existe globalmente no seu projeto Supabase. Se sim, pode pular esta CREATE FUNCTION e apenas criar o TRIGGER.)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = '' -- Importante: Define o search_path para vazio para evitar ataques de SQL Injection
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Cria o trigger para a tabela event_settings
CREATE TRIGGER update_event_settings_updated_at
BEFORE UPDATE ON public.event_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
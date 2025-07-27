-- supabase/migrations/<SEU_TIMESTAMP>_remove_situacao_column.sql

-- Remove a coluna 'situacao' da tabela 'inscriptions'
ALTER TABLE public.inscriptions
DROP COLUMN situacao;
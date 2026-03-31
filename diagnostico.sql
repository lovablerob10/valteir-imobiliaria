-- ==============================================================================
-- DIAGNÓSTICO E CORREÇÃO - Execute no SQL Editor do Supabase
-- ==============================================================================

-- 1. Ver colunas atuais da tabela configuracoes
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'configuracoes'
ORDER BY ordinal_position;

-- 2. Ver dados atuais
SELECT * FROM public.configuracoes;

-- 3. Ver se tabela profiles existe e seus dados
SELECT * FROM public.profiles LIMIT 5;

-- 4. Ver políticas RLS atuais
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'configuracoes';

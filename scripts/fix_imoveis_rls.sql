-- ============================================
-- CORRIGIR RECURSÃO INFINITA NA POLICY DE IMOVEIS
-- Execute no SQL Editor do Supabase Dashboard
-- https://supabase.com/dashboard/project/gvrrmhazmcvqekuvttpm/sql
-- ============================================

-- Remover a policy que causa recursão (referencia a tabela perfis que tem loop)
DROP POLICY IF EXISTS "Admins gerenciam tudo" ON public.imoveis;

-- Também remover duplicata de SELECT (já temos "Leitura Pública Imóveis" com true)
DROP POLICY IF EXISTS "Leitura pública de imóveis ativos" ON public.imoveis;

-- Verificar que ficaram apenas as 2 policies corretas
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'imoveis';

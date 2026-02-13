-- 1. Garante que RLS está habilitado na tabela IMOVEIS
ALTER TABLE public.imoveis ENABLE ROW LEVEL SECURITY;

-- 2. Limpa quaisquer políticas antigas que possam estar bloqueando ou duplicadas
DROP POLICY IF EXISTS "Leitura Pública Imóveis" ON public.imoveis;
DROP POLICY IF EXISTS "Public Access" ON public.imoveis;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.imoveis;

-- 3. Cria a política correta permitindo leitura para TODO MUNDO (Público e Autenticado)
CREATE POLICY "Leitura Pública Imóveis"
ON public.imoveis
FOR SELECT
TO public
USING (true);

-- 4. Garante que a tabela LEADS (formulário) também aceite envios
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Inserção Pública Leads" ON public.leads;

CREATE POLICY "Inserção Pública Leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

-- 5. Força o recarregamento das configurações do PostgREST
NOTIFY pgrst, 'reload config';

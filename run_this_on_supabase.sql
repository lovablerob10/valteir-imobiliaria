-- 1. Forçar reload do schema cache (caso a tabela já exista mas esteja invisível)
NOTIFY pgrst, 'reload config';

-- 2. Garantir que estamos no schema public
SET search_path TO public;

-- 3. Criar a tabela IMOVEIS (se não existir)
CREATE TABLE IF NOT EXISTS public.imoveis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descricao TEXT,
    preco NUMERIC NOT NULL,
    preco_condominio NUMERIC,
    tipo TEXT NOT NULL, -- 'casa', 'apartamento', 'mansao', 'cobertura', etc.
    status TEXT DEFAULT 'ativo',
    endereco TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT DEFAULT 'SP',
    area_util INTEGER,
    quartos INTEGER,
    suites INTEGER,
    banheiros INTEGER,
    vagas_garagem INTEGER,
    destaque BOOLEAN DEFAULT false,
    imagens TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Inserir dados de teste (apenas se a tabela estiver vazia)
INSERT INTO public.imoveis (
    titulo, slug, descricao, preco, tipo, status, endereco, bairro, cidade, area_util, quartos, suites, vagas_garagem, destaque, imagens, features
) 
SELECT 
    'Mansão Suspensa Itaim',
    'mansao-suspensa-itaim',
    'Exclusividade e sofisticação no coração do Itaim Bibi. Um projeto que une design contemporâneo a uma vista inigualável.',
    12500000,
    'mansao',
    'ativo',
    'Rua Leopoldo Couto de Magalhães Júnior',
    'Itaim Bibi',
    'São Paulo',
    450,
    4,
    4,
    5,
    true,
    ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'],
    ARRAY['seguranca_24h', 'academia', 'spa', 'automacao']
WHERE NOT EXISTS (SELECT 1 FROM public.imoveis WHERE slug = 'mansao-suspensa-itaim');

INSERT INTO public.imoveis (
    titulo, slug, descricao, preco, tipo, status, endereco, bairro, cidade, area_util, quartos, suites, vagas_garagem, destaque, imagens, features
) 
SELECT 
    'Penthouse Jardins de Luxemburgo',
    'penthouse-jardins-luxemburgo',
    'Cobertura duplex com acabamentos em mármore italiano e área externa privativa com deck e jacuzzi.',
    8900000,
    'cobertura',
    'ativo',
    'Alameda Campinas',
    'Jardins',
    'São Paulo',
    320,
    3,
    3,
    4,
    true,
    ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'],
    ARRAY['piscina_privativa', 'churrasqueira', 'vista_panoramica', 'jacuzzi']
WHERE NOT EXISTS (SELECT 1 FROM public.imoveis WHERE slug = 'penthouse-jardins-luxemburgo');

-- 5. Criar a tabela LEADS (se não existir)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imovel_id UUID REFERENCES public.imoveis(id),
    imovel_titulo TEXT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    mensagem TEXT,
    origem TEXT DEFAULT 'site',
    status TEXT DEFAULT 'novo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Configurar RLS (Permissões de Leitura e Escrita)
ALTER TABLE public.imoveis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Leitura Pública Imóveis" ON public.imoveis;
CREATE POLICY "Leitura Pública Imóveis" ON public.imoveis FOR SELECT USING (true);
DROP POLICY IF EXISTS "Inserção Admin Imóveis" ON public.imoveis;
CREATE POLICY "Inserção Admin Imóveis" ON public.imoveis FOR ALL USING (auth.role() = 'authenticated'); -- Simplificado

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Inserção Pública Leads" ON public.leads;
CREATE POLICY "Inserção Pública Leads" ON public.leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin Ver Leads" ON public.leads;
-- CREATE POLICY "Admin Ver Leads" ON public.leads FOR SELECT USING (auth.role() = 'authenticated');

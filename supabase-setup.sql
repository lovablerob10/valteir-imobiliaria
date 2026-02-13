
-- Script SQL Final para o Portfólio Valteir Imobiliária
-- Execute este comando no Editor SQL do seu painel Supabase

-- 1. Remover registros de teste antigos
DELETE FROM imoveis WHERE slug IN ('penthouse-jardins');

-- 2. Inserir o portfólio completo com imagens e slugs corretos
INSERT INTO imoveis (
    titulo, slug, descricao, preco, tipo, status, endereco, bairro, cidade, estado, area_util, quartos, suites, banheiros, vagas_garagem, destaque, imagens, features
) VALUES 
(
    'Mansão Suspensa Itaim',
    'mansao-suspensa-itaim',
    'Exclusividade e sofisticação no coração do Itaim Bibi. Um projeto que une design contemporâneo a uma vista inigualável, com janelas do chão ao teto e acabamentos de altíssimo padrão.',
    12500000,
    'mansao',
    'ativo',
    'Rua Leopoldo Couto de Magalhães Júnior',
    'Itaim Bibi',
    'São Paulo',
    'SP',
    450,
    4,
    4,
    5,
    4,
    true,
    ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'],
    ARRAY['seguranca_24h', 'academia', 'spa', 'automacao']
),
(
    'Penthouse Jardins de Luxemburgo',
    'penthouse-jardins-luxemburgo',
    'Cobertura duplex com acabamentos em mármore italiano e área externa privativa com deck e jacuzzi. Localização privilegiada com vista definitiva para o Jardins.',
    8900000,
    'cobertura',
    'ativo',
    'Alameda Campinas',
    'Jardins',
    'São Paulo',
    'SP',
    320,
    3,
    3,
    4,
    3,
    true,
    ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'],
    ARRAY['piscina_privativa', 'churrasqueira', 'vista_panoramica', 'jacuzzi']
),
(
    'Casa Contemporânea Tamboré',
    'casa-contemporanea-tambore',
    'Arquitetura moderna integrada à natureza em um dos condomínios mais exclusivos do Tamboré. Amplos vãos livres e iluminação natural abundante.',
    15700000,
    'casa',
    'ativo',
    'Residencial Tamboré 1',
    'Tamboré',
    'Barueri',
    'SP',
    800,
    5,
    5,
    7,
    6,
    true,
    ARRAY['https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200'],
    ARRAY['piscina_privativa', 'home_theater', 'adega', 'espaco_gourmet']
)
ON CONFLICT (slug) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    imagens = EXCLUDED.imagens,
    preco = EXCLUDED.preco,
    status = 'ativo';

-- 3. Configurar segurança (RLS)
ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir leitura pública de imóveis" ON imoveis;
CREATE POLICY "Permitir leitura pública de imóveis" ON imoveis FOR SELECT USING (true);

-- 4. Garantir tabela de leads para o formulário de contato
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imovel_id UUID REFERENCES imoveis(id),
    imovel_titulo TEXT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    mensagem TEXT,
    origem TEXT DEFAULT 'site',
    status TEXT DEFAULT 'novo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir inserção de leads pública" ON leads;
CREATE POLICY "Permitir inserção de leads pública" ON leads FOR INSERT WITH CHECK (true);

-- SCRIPT DE SEEDING: TABELA DE IMÓVEIS
-- Este script insere 3 imóveis de luxo exemplares para teste do sistema.

-- 1. LIMPAR DADOS EXISTENTES (Opcional - Remova o comentário se quiser limpar antes)
-- DELETE FROM public.imoveis;

-- 2. INSERIR IMÓVEIS
INSERT INTO public.imoveis (
    id, titulo, slug, descricao, tipo, tipo_negocio, 
    status, endereco, bairro, cidade, estado, 
    preco, quartos, suites, banheiros, vagas_garagem, 
    area_util, area_total, destaque, ordem_destaque,
    imagens, features
) VALUES 
(
    gen_random_uuid(),
    'Cobertura Linear Duplex - Jardins de Versalhes',
    'cobertura-linear-duplex-jardins-versalhes',
    '## Luxo e Exclusividade\nUma cobertura incomparável com vista 360 graus para a cidade. Acabamentos em mármore italiano e projeto de iluminação assinado.\n\n### Diferenciais\n- Piscina privativa com borda infinita\n- Área gourmet climatizada\n- Automação residencial completa via iPad.',
    'cobertura',
    'venda',
    'ativo',
    'Al. das Magnólias, 1200',
    'Jardins',
    'São Paulo',
    'SP',
    12500000,
    4,
    4,
    6,
    5,
    450,
    600,
    true,
    1,
    ARRAY['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070'],
    ARRAY['Piscina', 'Elevador Privativo', 'Academia', 'Segurança 24h', 'Automação']
),
(
    gen_random_uuid(),
    'Mansão Contemporânea em Alphaville',
    'mansao-contemporanea-alphaville',
    '## Arquitetura Premiada\nMansão com pé direito duplo, fachada em vidro e integração total com a natureza. Localizada no condomínio mais exclusivo da região.\n\n### Infraestrutura\n- Cinema privativo\n- Adega para 500 garrafas\n- Sistema de energia solar fotovoltaica.',
    'mansao',
    'venda',
    'ativo',
    'Rua das Palmeiras Imperial, 45',
    'Alphaville',
    'Barueri',
    'SP',
    8900000,
    5,
    5,
    7,
    8,
    850,
    1200,
    true,
    2,
    ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070'],
    ARRAY['Cinema', 'Adega', 'Energia Solar', 'Piscina Olímpica', 'Quadra de Tênis']
),
(
    gen_random_uuid(),
    'Loft Industrial de Luxo - Vila Madalena',
    'loft-industrial-luxo-vila-madalena',
    '## Conceito Aberto e Urbano\nLoft com estética industrial refinada. Paredes em tijolo aparente original, concreto polido e estruturas metálicas expostas. Ideal para quem busca um estilo de vida cosmopolita.\n\n### Localização\nCoração da Vila Madalena, próximo às melhores galerias de arte e restaurantes da cidade.',
    'loft',
    'venda',
    'ativo',
    'Rua Harmonia, 880',
    'Vila Madalena',
    'São Paulo',
    'SP',
    3200000,
    1,
    1,
    2,
    2,
    120,
    120,
    true,
    3,
    ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070'],
    ARRAY['Estilo Industrial', 'Pé Direito Duplo', 'Varanda Gourmet', 'Próximo ao Metrô']
);

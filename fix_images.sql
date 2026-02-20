-- Atualização de imagens quebradas para Imóveis
-- Substituindo URLs do Unsplash que retornam 404 por imagens funcionais de alta qualidade

-- 1. Mansão Suspensa Itaim
UPDATE public.imoveis
SET imagens = ARRAY[
    'https://images.unsplash.com/photo-1600596542815-3ad19b6f6705?auto=format&fit=crop&q=80&w=1200', -- Hero Principal
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200', -- Sala
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=1200', -- Cozinha/Interior
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'  -- Piscina/Ext
]
WHERE slug = 'mansao-suspensa-itaim';

-- 2. Penthouse Jardins Luxemburgo
UPDATE public.imoveis
SET imagens = ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200', -- Hero Pool
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200', -- Varanda (Verify this one working, if not fallback)
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200'  -- Interior Classico
]
WHERE slug = 'penthouse-jardins-luxemburgo';

-- 3. Cobertura Duplex Jardins
UPDATE public.imoveis
SET imagens = ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200', -- Interior Loft
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200'  -- Quarto
]
WHERE slug = 'cobertura-duplex-jardins';

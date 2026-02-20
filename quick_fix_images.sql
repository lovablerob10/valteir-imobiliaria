-- CORREÇÃO RÁPIDA DE IMAGENS QUEBRADAS
-- Execute este script no SQL Editor do Supabase para restaurar as fotos.

-- 1. Mansão Suspensa Itaim (Fixing broken image)
UPDATE public.imoveis
SET imagens = ARRAY[
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1400', -- Principal (Solicitada pelo Usuário)
    'https://images.unsplash.com/photo-1600607687644-c7171b42398f?auto=format&fit=crop&q=80&w=1400', -- Interior
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1400'  -- Sala de Jantar
]
WHERE slug = 'mansao-suspensa-itaim';

-- 2. Garantir que os outros imóveis também estejam com imagens funcionais
UPDATE public.imoveis
SET imagens = ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1400', -- Exterior Casa
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1400'  -- Interior Cozinha
]
WHERE slug = 'casa-contemporanea-tambore';

UPDATE public.imoveis
SET imagens = ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1400', -- Penthouse
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1400'  -- Closet/Quarto
]
WHERE slug = 'penthouse-jardins-luxemburgo';

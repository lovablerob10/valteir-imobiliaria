-- Adicionando mais fotos e vídeo para a Mansão Suspensa Itaim
UPDATE public.imoveis 
SET 
    imagens = ARRAY[
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1600607687940-4e2a09695d51?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
    ],
    video_url = 'https://www.youtube.com/embed/dQw4w9WgXcQ' -- Link de exemplo (substituir depois pelo real)
WHERE slug = 'mansao-suspensa-itaim';

-- Adicionando mais fotos e vídeo para a Penthouse Jardins
UPDATE public.imoveis 
SET 
    imagens = ARRAY[
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1628592102751-ba83b0314276?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200'
    ],
    video_url = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
WHERE slug = 'penthouse-jardins-luxemburgo';

NOTIFY pgrst, 'reload config';

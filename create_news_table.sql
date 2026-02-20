-- ==============================================================================
-- 📰 TABELA DE NOTÍCIAS (BLOG)
-- Execute este script no SQL Editor do Supabase.
-- ==============================================================================

-- 1. CRIAR TIPO ENUM PARA STATUS (Se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
        CREATE TYPE public.post_status AS ENUM ('rascunho', 'publicado');
    END IF;
END
$$;

-- 2. CRIAR TABELA DE NOTÍCIAS
CREATE TABLE IF NOT EXISTS public.noticias (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo text NOT NULL,
    slug text UNIQUE NOT NULL,
    conteudo text,
    resumo text,
    imagem_capa text,
    status public.post_status DEFAULT 'rascunho',
    autor text DEFAULT 'Valteir Imobiliária',
    
    -- SEO Metadata
    meta_title text,
    meta_description text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. HABILITAR RLS
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE ACESSO
-- Qualquer pessoa pode ler notícias publicadas
DROP POLICY IF EXISTS "Public can view published news" ON public.noticias;
CREATE POLICY "Public can view published news" ON public.noticias 
FOR SELECT USING (status = 'publicado');

-- Apenas administradores podem gerenciar notícias
DROP POLICY IF EXISTS "Admins can manage news" ON public.noticias;
CREATE POLICY "Admins can manage news" ON public.noticias 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'admin_master'
    )
);

-- 5. TRIGGER PARA UPDATED_AT
DROP TRIGGER IF EXISTS update_noticias_updated_at ON public.noticias;
CREATE TRIGGER update_noticias_updated_at
    BEFORE UPDATE ON public.noticias
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

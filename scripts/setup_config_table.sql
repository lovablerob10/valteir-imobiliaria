-- 1. Criar tabela de configurações
CREATE TABLE IF NOT EXISTS public.configuracoes (
    id SERIAL PRIMARY KEY,
    nome_imobiliaria TEXT DEFAULT 'Valteir Imobiliária',
    whatsapp_principal TEXT,
    endereco_completo TEXT,
    notificacoes_whatsapp_ativa BOOLEAN DEFAULT true,
    email_contato TEXT,
    seo_title TEXT,
    seo_description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Inserir dados iniciais se não existirem
INSERT INTO public.configuracoes (id, nome_imobiliaria)
VALUES (1, 'Valteir Imobiliária')
ON CONFLICT (id) DO NOTHING;

-- 3. Habilitar RLS
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- 4. Políticas
DROP POLICY IF EXISTS "Leitura pública das configs" ON public.configuracoes;
CREATE POLICY "Leitura pública das configs" ON public.configuracoes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins podem editar configs" ON public.configuracoes;
CREATE POLICY "Admins podem editar configs" ON public.configuracoes FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND role IN ('admin', 'admin_master')
    )
);

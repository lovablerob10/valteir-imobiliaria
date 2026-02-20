-- ==============================================================================
-- 🏗️ ESTRUTURA DE EQUIPE E CONFIGURAÇÕES
-- ==============================================================================

-- 1. TABELA DE CONFIGURAÇÕES GERAIS (SINGLETON)
CREATE TABLE IF NOT EXISTS public.configuracoes (
    id integer PRIMARY KEY DEFAULT 1,
    CONSTRAINT single_row CHECK (id = 1),
    
    -- Dados da Empresa
    nome_imobiliaria text DEFAULT 'Valteir Imobiliária',
    razao_social text,
    cnpj text,
    
    -- Contato
    email_contato text,
    telefone_principal text,
    whatsapp_principal text,
    endereco_completo text,
    
    -- Redes Sociais
    instagram_url text,
    facebook_url text,
    linkedin_url text,
    youtube_url text,
    
    -- Identidade Visual
    logo_url text,
    favicon_url text,
    
    -- Notificações
    email_notificacoes_leads text,
    notificacoes_whatsapp_ativa boolean DEFAULT true,
    
    updated_at timestamptz DEFAULT now()
);

-- Inserir registro padrão se não existir
INSERT INTO public.configuracoes (id)
SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM public.configuracoes WHERE id = 1);

-- 2. AJUSTE NA TABELA DE LEADS (ATRIBUIÇÃO)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'leads' AND column_name = 'corretor_id') THEN
        ALTER TABLE public.leads ADD COLUMN corretor_id uuid REFERENCES auth.users(id);
    END IF;
END
$$;

-- 3. HABILITAR RLS NA TABELA DE CONFIGURAÇÕES
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE ACESSO
DROP POLICY IF EXISTS "Public can view settings" ON public.configuracoes;
CREATE POLICY "Public can view settings" ON public.configuracoes 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage settings" ON public.configuracoes;
CREATE POLICY "Admins can manage settings" ON public.configuracoes 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 5. TRIGGER PARA UPDATED_AT
DROP TRIGGER IF EXISTS update_configuracoes_updated_at ON public.configuracoes;
CREATE TRIGGER update_configuracoes_updated_at
    BEFORE UPDATE ON public.configuracoes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

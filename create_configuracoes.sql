-- ==============================================================================
-- CORRIGIR TABELA CONFIGURAÇÕES (já existente com colunas antigas)
-- Execute este script no Editor SQL do Supabase
-- ==============================================================================

-- 1. Verificar e renomear colunas antigas para as novas
DO $$
BEGIN
    -- Renomear whatsapp_principal -> whatsapp (se existir)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'configuracoes' AND column_name = 'whatsapp_principal'
    ) THEN
        ALTER TABLE public.configuracoes RENAME COLUMN whatsapp_principal TO whatsapp;
    END IF;

    -- Renomear email_contato -> email (se existir)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'configuracoes' AND column_name = 'email_contato'
    ) THEN
        ALTER TABLE public.configuracoes RENAME COLUMN email_contato TO email;
    END IF;

    -- Renomear endereco_completo -> endereco (se existir)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'configuracoes' AND column_name = 'endereco_completo'
    ) THEN
        ALTER TABLE public.configuracoes RENAME COLUMN endereco_completo TO endereco;
    END IF;
END $$;

-- 2. Adicionar colunas que podem estar faltando
ALTER TABLE public.configuracoes 
    ADD COLUMN IF NOT EXISTS nome_imobiliaria text DEFAULT 'Valteir Imóveis',
    ADD COLUMN IF NOT EXISTS whatsapp text DEFAULT '',
    ADD COLUMN IF NOT EXISTS email text DEFAULT '',
    ADD COLUMN IF NOT EXISTS endereco text DEFAULT '',
    ADD COLUMN IF NOT EXISTS telefone_secundario text DEFAULT '',
    ADD COLUMN IF NOT EXISTS instagram_url text DEFAULT '',
    ADD COLUMN IF NOT EXISTS facebook_url text DEFAULT '',
    ADD COLUMN IF NOT EXISTS meta_title text DEFAULT 'Valteir Imóveis | Imóveis de Alto Padrão',
    ADD COLUMN IF NOT EXISTS meta_description text DEFAULT 'Descubra o luxo e a exclusividade com a Valteir Imóveis.',
    ADD COLUMN IF NOT EXISTS notificacoes_whatsapp_ativa boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS horario_funcionamento text DEFAULT 'Seg-Sex: 9h às 18h | Sab: 9h às 13h',
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 3. Garantir que existe o registro com id = 1
INSERT INTO public.configuracoes (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- 4. Habilitar RLS
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de acesso
DROP POLICY IF EXISTS "Leitura pública de configurações" ON public.configuracoes;
CREATE POLICY "Leitura pública de configurações" 
    ON public.configuracoes 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Admins podem atualizar configurações" ON public.configuracoes;
CREATE POLICY "Admins podem atualizar configurações" 
    ON public.configuracoes 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'admin_master')
        )
    );

DROP POLICY IF EXISTS "Admins podem inserir configurações" ON public.configuracoes;
CREATE POLICY "Admins podem inserir configurações" 
    ON public.configuracoes 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'admin_master')
        )
    );

-- ==============================================================================
-- PRONTO! Volte ao Dashboard e clique em "SALVAR MUDANÇAS"
-- ==============================================================================

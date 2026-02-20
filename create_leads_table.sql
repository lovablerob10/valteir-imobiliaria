-- ==============================================================================
-- 📂 TABELA DE LEADS (MINI-CRM)
-- Execute este script no SQL Editor do Supabase para habilitar a gestão de leads.
-- ==============================================================================

-- 1. CRIAR TIPO ENUM PARA STATUS (Se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
        CREATE TYPE public.lead_status AS ENUM ('novo', 'em_atendimento', 'convertido', 'perdido');
    END IF;
END
$$;

-- 2. CRIAR TABELA DE LEADS
CREATE TABLE IF NOT EXISTS public.leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome text NOT NULL,
    email text,
    telefone text,
    mensagem text,
    tipo_interesse text, -- Ex: 'contato_geral', 'interesse_imovel', 'fale_com_valteir'
    imovel_id uuid REFERENCES public.imoveis(id) ON DELETE SET NULL,
    status public.lead_status DEFAULT 'novo',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. HABILITAR RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE ACESSO
-- Qualquer pessoa pode inserir um lead (para os formulários do site funcionarem)
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Apenas administradores podem ver/editar leads
-- Nota: O perfil de admin deve ter role 'admin_master' conforme configurado antes
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
CREATE POLICY "Admins can view all leads" ON public.leads 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'admin_master'
    )
);

DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
CREATE POLICY "Admins can update leads" ON public.leads 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'admin_master'
    )
);

-- 5. TRIGGER PARA UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

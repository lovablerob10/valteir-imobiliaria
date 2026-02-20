-- ==============================================================================
-- 🚨 ATENÇÃO: SCRIPT CORRIGIDO (Versão 2) 🚨
-- O erro anterior aconteceu porque a tabela 'profiles' não existia.
-- Este script cria a tabela e depois aplica as correções.
-- ==============================================================================

-- 1. CRIAR TABELA PROFILES (Se não existir)
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text,
  full_name text,
  role text DEFAULT 'user',
  avatar_url text,
  telefone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar segurança (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso (quem pode ver/editar)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone') THEN
        CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile') THEN
        CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END
$$;


-- 2. CORREÇÃO DO LOGIN (AUTH TRIGGER)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'),
    'admin_master' -- Garantir acesso total
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    email = EXCLUDED.email,
    role = 'admin_master';
  RETURN new;
END;
$$;

-- Remove versão antiga quebrada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Cria novamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recupera usuários existentes que ficaram sem perfil (o "Preencha o vazio")
INSERT INTO public.profiles (user_id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Usuário Recuperado'),
    'admin_master'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT (user_id) DO NOTHING;


-- ==============================================================================


-- PARTE 2: NOVOS CAMPOS PARA VENDA E ALUGUEL
-- Adiciona suporte para diferenciar tipos de negócio e dados financeiros de locação.

-- Campo: Tipo de Negócio (Venda, Aluguel ou Ambos)
ALTER TABLE public.imoveis
ADD COLUMN IF NOT EXISTS tipo_negocio text DEFAULT 'venda';

-- Validação para garantir apenas valores permitidos
ALTER TABLE public.imoveis
DROP CONSTRAINT IF EXISTS imoveis_tipo_negocio_check;

ALTER TABLE public.imoveis
ADD CONSTRAINT imoveis_tipo_negocio_check
CHECK (tipo_negocio IN ('venda', 'aluguel', 'ambos'));

-- Campos Financeiros para Aluguel
ALTER TABLE public.imoveis
ADD COLUMN IF NOT EXISTS valor_locacao numeric(15,2),    -- Valor do Aluguel
ADD COLUMN IF NOT EXISTS valor_condominio numeric(15,2), -- Condomínio (já existia preco_condominio? Se sim, vamos usar este novo para padronizar ou manter o antigo. O código atual usa preco_condominio. Vamos manter o antigo ou migrar?)
-- O usuário pediu "Valor do condomínio". Vamos verificar se 'preco_condominio' já existe.
-- Se existir, esse comando apenas será ignorado (IF NOT EXISTS), mas o ideal é usar o que já tem.
-- Vou adicionar 'valor_iptu' para ser explícito, se 'iptu_mensal' já existe, o front deve decidir qual usar. 
-- Para garantir:
ADD COLUMN IF NOT EXISTS valor_iptu numeric(15,2);

-- Garantias Locatícias (Array de textos para múltipla seleção)
ALTER TABLE public.imoveis
ADD COLUMN IF NOT EXISTS garantias text[] DEFAULT '{}';


-- ==============================================================================
-- FIM DO SCRIPT
-- Após executar, tente fazer Login novamente e me avise!

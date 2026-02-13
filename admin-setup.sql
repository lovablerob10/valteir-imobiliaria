
-- 1. Criar tabela de perfis para controle de acesso
CREATE TABLE IF NOT EXISTS perfis (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    nome TEXT,
    role TEXT DEFAULT 'corretor' CHECK (role IN ('admin', 'corretor', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Habilitar RLS
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON perfis;
CREATE POLICY "Usuários podem ver seu próprio perfil" ON perfis FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON perfis;
CREATE POLICY "Admins podem ver todos os perfis" ON perfis FOR SELECT USING (
    EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Função para criar perfil automaticamente no SignUp
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfis (id, email, nome, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'nome', 'corretor');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger para automatizar a criação
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- IMPORTANTE: Execute este comando substituindo 'SEU_EMAIL' pelo e-mail que você usa para logar
-- UPDATE perfis SET role = 'admin' WHERE email = 'SEU_EMAIL';

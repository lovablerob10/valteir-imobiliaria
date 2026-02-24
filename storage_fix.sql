-- 1. Criar o bucket 'imoveis' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('imoveis', 'imoveis', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Habilitar RLS no bucket (se necessário, geralmente padrão em novos projetos)
-- (O Supabase gerencia isso automaticamente para buckets)

-- 3. Limpar políticas antigas (opcional, para evitar duplicatas ao re-executar)
DROP POLICY IF EXISTS "Qualquer pessoa pode ver imagens dos imoveis" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados podem subir imagens" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados podem deletar suas imagens" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados podem atualizar suas imagens" ON storage.objects;

-- 4. Criar política de visualização pública
CREATE POLICY "Qualquer pessoa pode ver imagens dos imoveis"
ON storage.objects FOR SELECT
USING ( bucket_id = 'imoveis' );

-- 5. Criar política de upload para usuários autenticados
CREATE POLICY "Usuarios autenticados podem subir imagens"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'imoveis' );

-- 6. Criar política de deleção para usuários autenticados
CREATE POLICY "Usuarios autenticados podem deletar suas imagens"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'imoveis' );

-- 7. Criar política de atualização para usuários autenticados
CREATE POLICY "Usuarios autenticados podem atualizar suas imagens"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'imoveis' );

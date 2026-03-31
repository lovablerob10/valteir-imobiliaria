-- ==============================================================================
-- LIMPEZA FINAL - Execute no SQL Editor do Supabase
-- ==============================================================================

-- 1. Remover política antiga que pode estar bloqueando
DROP POLICY IF EXISTS "Admins can manage settings" ON public.configuracoes;
DROP POLICY IF EXISTS "Public can view settings" ON public.configuracoes;

-- 2. Adicionar colunas que podem estar faltando
ALTER TABLE public.configuracoes 
    ADD COLUMN IF NOT EXISTS telefone_secundario text DEFAULT '',
    ADD COLUMN IF NOT EXISTS meta_title text DEFAULT 'Valteir Imóveis | Imóveis de Alto Padrão',
    ADD COLUMN IF NOT EXISTS meta_description text DEFAULT 'Descubra o luxo e a exclusividade com a Valteir Imóveis.',
    ADD COLUMN IF NOT EXISTS notificacoes_whatsapp_ativa boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS horario_funcionamento text DEFAULT 'Seg-Sex: 9h às 18h | Sab: 9h às 13h',
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 3. Atualizar nome para "Valteir Imóveis"
UPDATE public.configuracoes 
SET nome_imobiliaria = 'Valteir Imóveis' 
WHERE id = 1;

-- 4. Confirmar
SELECT 'LIMPEZA CONCLUÍDA!' as status;
SELECT id, nome_imobiliaria, whatsapp, email, endereco FROM public.configuracoes;

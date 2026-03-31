-- ==============================================================================
-- CORREÇÃO RÁPIDA - SE DIANOSTICO MOSTRAR PROBLEMA COM RLS
-- Execute no SQL Editor do Supabase
-- ==============================================================================

-- Opção A: Trocar as políticas para permitir qualquer usuário autenticado
DROP POLICY IF EXISTS "Admins podem atualizar configurações" ON public.configuracoes;
CREATE POLICY "Admins podem atualizar configurações" 
    ON public.configuracoes 
    FOR UPDATE 
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins podem inserir configurações" ON public.configuracoes;
CREATE POLICY "Admins podem inserir configurações" 
    ON public.configuracoes 
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Verificar se registro id=1 existe
INSERT INTO public.configuracoes (id) 
VALUES (1) 
ON CONFLICT (id) DO NOTHING;

-- Confirmar
SELECT 'CORREÇÃO APLICADA COM SUCESSO!' as status;
SELECT * FROM public.configuracoes;

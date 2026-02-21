import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const type = requestUrl.searchParams.get('type')

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Se for convite ou recuperação de senha, redireciona para definir senha
            if (type === 'invite' || type === 'recovery' || type === 'signup') {
                return NextResponse.redirect(new URL('/auth/set-password', requestUrl.origin))
            }
            // Login normal vai pro admin
            return NextResponse.redirect(new URL('/admin', requestUrl.origin))
        }
    }

    // Em caso de erro, redireciona pro login com mensagem
    return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
}

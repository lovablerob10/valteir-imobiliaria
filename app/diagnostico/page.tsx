import { createClient } from "@/lib/supabase/server";

export default async function DiagnosticPage() {
    const supabase = await createClient();

    let dbStatus = "Iniciando teste...";
    let data_raw = null;
    let error_raw = null;

    try {
        const { data, error } = await supabase
            .from("imoveis")
            .select("id, titulo, slug")
            .limit(1);

        if (error) {
            dbStatus = "❌ Erro na consulta do Banco";
            error_raw = error;
        } else if (data && data.length > 0) {
            dbStatus = "✅ Conexão via SERVIDOR funcionando!";
            data_raw = data;
        } else {
            dbStatus = "⚠️ Conexão OK, mas a tabela está VAZIA ou RLS bloqueou.";
            data_raw = data;
        }
    } catch (e: any) {
        dbStatus = "📂 Erro de execução no Servidor";
        error_raw = { message: e.message, stack: e.stack };
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-10 font-mono">
            <h1 className="text-3xl font-bold text-accent mb-8">TESTE DE DIAGNÓSTICO (SERVER-SIDE)</h1>

            <div className="grid gap-6">
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <p className="text-zinc-400 text-xs mb-1 uppercase tracking-widest">Resultado do Teste:</p>
                    <p className="text-xl font-bold">{dbStatus}</p>
                </div>

                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <p className="text-zinc-400 text-xs mb-1 uppercase tracking-widest">URL Supabase Configurada:</p>
                    <code className="text-blue-400">{process.env.NEXT_PUBLIC_SUPABASE_URL}</code>
                </div>

                {data_raw && (
                    <div className="p-6 bg-green-950/20 border border-green-500/30 rounded-xl">
                        <p className="text-green-400 text-xs mb-2 font-bold uppercase">Dados Encontrados:</p>
                        <pre className="text-xs text-green-200 overflow-auto">{JSON.stringify(data_raw, null, 2)}</pre>
                    </div>
                )}

                {error_raw && (
                    <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 text-xs mb-2 font-bold uppercase">Erro Detalhado:</p>
                        <pre className="text-xs text-red-200 overflow-auto">{JSON.stringify(error_raw, null, 2)}</pre>
                    </div>
                )}
            </div>

            <div className="mt-10 p-6 bg-blue-950/20 border border-blue-500/30 rounded-xl">
                <h3 className="text-blue-400 font-bold mb-2">O QUE ISSO SIGNIFICA?</h3>
                <p className="text-sm text-zinc-300">
                    Se este teste de **SERVIDOR** funcionar (mostrar ✅), mas a página do imóvel der erro de **Fetch**,
                    significa que o seu **NAVEGADOR** está bloqueando a conexão com o Supabase.
                    Isso geralmente é causado por:
                </p>
                <ul className="list-disc list-inside text-xs text-zinc-400 mt-2 space-y-1">
                    <li>Extensões de AdBlocker (uBlock Origin, AdBlock Plus)</li>
                    <li>Configurações de Privacidade do Navegador (Modo Estrito)</li>
                    <li>Firewall do Windows ou Antivírus</li>
                    <li>Uso de VPN</li>
                </ul>
            </div>
        </div>
    );
}

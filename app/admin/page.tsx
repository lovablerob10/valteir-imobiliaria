import { createClient } from "@/lib/supabase/server";
import {
    LayoutDashboard,
    Home,
    MessageSquare,
    Eye,
    TrendingUp,
    Clock
} from "lucide-react";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Buscar dados do usuário logado
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user?.id)
        .single();

    const firstName = profile?.full_name?.split(' ')[0] || "Administrador";

    // Buscar estatísticas reais
    const { count: activeProperties } = await supabase
        .from('imoveis')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo');

    const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

    const { data: recentLeads } = await supabase
        .from('leads')
        .select('*, imoveis(titulo)')
        .order('created_at', { ascending: false })
        .limit(3);

    const stats = [
        { name: "Imóveis Ativos", value: activeProperties || 0, trend: "Atualizado", icon: Home },
        { name: "Novos Leads", value: totalLeads || 0, trend: "Pendente", icon: MessageSquare },
        { name: "Visualizações", value: "1.2k", trend: "+15%", icon: Eye }, // Ainda estático (browser side tracking necessário)
        { name: "Novas Notícias", value: "03", trend: "Recente", icon: Clock },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Welcome Section */}
            <section className="flex flex-col gap-2">
                <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-2">Visão Geral</span>
                <h1 className="text-5xl font-serif text-white tracking-tight">
                    Painel de <span className="text-accent italic">Controle</span>
                </h1>
                <p className="text-zinc-500">
                    Bem-vindo de volta, <span className="text-white font-medium">{firstName}</span>. Aqui está o resumo atualizado do seu portfólio.
                </p>
            </section>

            {/* Quick Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="p-6 bg-zinc-900/40 border border-white/5 rounded-3xl hover:border-accent/40 transition-all group backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 blur-2xl rounded-full" />
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-xl bg-zinc-950/50 text-accent border border-white/5">
                                <stat.icon size={18} />
                            </div>
                            <span className="text-[10px] text-accent/60 font-medium uppercase tracking-tighter">{stat.trend}</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1 font-bold">{stat.name}</p>
                        <h3 className="text-3xl font-serif text-white">{stat.value}</h3>
                    </div>
                ))}
            </section>

            {/* Recent Activity Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 bg-zinc-900/40 border border-white/10 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 blur-3xl rounded-full" />
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xl font-serif text-white">Últimos Leads</h4>
                        <span className="text-[10px] text-accent font-bold uppercase tracking-widest cursor-pointer hover:underline">Ver Todos</span>
                    </div>
                    <div className="space-y-4">
                        {(recentLeads || []).map((lead) => (
                            <div key={lead.id} className="flex items-center justify-between p-5 bg-zinc-950/50 rounded-2xl border border-white/5 hover:border-accent/20 transition-all">
                                <div>
                                    <p className="text-sm font-medium text-white">{lead.nome}</p>
                                    <p className="text-[11px] text-zinc-500">
                                        {lead.imoveis?.titulo ? `Interesse: ${lead.imoveis.titulo}` : 'Interesse Geral'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] bg-accent/10 text-accent px-3 py-1 rounded-full uppercase font-bold tracking-tighter">
                                        {lead.status}
                                    </span>
                                    <p className="text-[9px] text-zinc-600 mt-1 uppercase tracking-tighter">
                                        {new Date(lead.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {(!recentLeads || recentLeads.length === 0) && (
                            <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-2xl">
                                <p className="text-zinc-600 text-sm italic">Nenhum lead registrado recentemente.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 bg-zinc-900/40 border border-white/10 rounded-3xl backdrop-blur-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/5 blur-3xl rounded-full" />
                    <TrendingUp size={48} className="text-zinc-800 mb-4" />
                    <h4 className="text-xl font-serif text-white mb-2">Performance de Mercado</h4>
                    <p className="text-zinc-500 text-sm max-w-[240px]">Insights inteligentes baseados na demanda local e visualizações exclusivas em breve.</p>
                </div>
            </section>
        </div>
    );
}

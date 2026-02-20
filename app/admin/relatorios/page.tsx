import { createClient } from "@/lib/supabase/server";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Users,
    Home,
    DollarSign,
    Target
} from "lucide-react";

export default async function RelatoriosPage() {
    const supabase = await createClient();

    // Buscar dados reais para o relatório
    const { data: properties } = await supabase.from('imoveis').select('*');
    const { data: leads } = await supabase.from('leads').select('*');

    const totalImoveis = properties?.length || 0;
    const totalLeads = leads?.length || 0;

    // Distribuição por Status
    const statusCounts = (properties || []).reduce((acc: any, prop) => {
        acc[prop.status] = (acc[prop.status] || 0) + 1;
        return acc;
    }, {});

    // Distribuição por Tipo
    const typeCounts = (properties || []).reduce((acc: any, prop) => {
        acc[prop.tipo] = (acc[prop.tipo] || 0) + 1;
        return acc;
    }, {});

    const stats = [
        { label: "Valor Total Portfólio", value: `R$ ${(properties?.reduce((sum, p) => sum + (p.preco || 0), 0) / 1000000).toFixed(1)}M`, icon: DollarSign, color: "text-emerald-400" },
        { label: "Média de Preço", value: `R$ ${((properties?.reduce((sum, p) => sum + (p.preco || 0), 0) || 0) / (totalImoveis || 1) / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "text-accent" },
        { label: "Interessados Únicos", value: totalLeads, icon: Users, color: "text-blue-400" },
        { label: "Taxa de Conversão", value: "4.2%", icon: Target, color: "text-purple-400" },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <header className="flex flex-col gap-2">
                <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-2">Análise de Performance</span>
                <h1 className="text-5xl font-serif text-white tracking-tight">Relatórios <span className="text-accent italic">Gerais</span></h1>
                <p className="text-zinc-500 max-w-2xl">Visualização consolidada do inventário, performance de mercado e engajamento de leads qualificados.</p>
            </header>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-sm group hover:border-accent/40 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl bg-zinc-950/50 ${stat.color} border border-white/5`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-serif text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inventário por Status */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full" />
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <PieChart size={18} />
                        </div>
                        <h3 className="text-lg font-serif text-white">Status do Inventário</h3>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(statusCounts).map(([status, count]: [string, any]) => (
                            <div key={status} className="space-y-2">
                                <div className="flex justify-between text-xs uppercase tracking-widest">
                                    <span className="text-zinc-400">{status}</span>
                                    <span className="text-white font-bold">{count} unidades</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-accent transition-all duration-1000"
                                        style={{ width: `${(count / totalImoveis) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribuição por Tipo */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <BarChart3 size={18} />
                        </div>
                        <h3 className="text-lg font-serif text-white">Segmentação por Tipo</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(typeCounts).map(([type, count]: [string, any]) => (
                            <div key={type} className="p-4 bg-zinc-950/50 rounded-2xl border border-white/5 hover:border-blue-400/20 transition-all">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">{type}</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-serif text-white">{count}</span>
                                    <span className="text-[10px] text-blue-400 mb-1.5">Unidades</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Leads Recap */}
            <div className="bg-zinc-950/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm overflow-hidden border-t-accent/20">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                            <Users size={18} />
                        </div>
                        <h3 className="text-lg font-serif text-white">Fluxo de Leads Recentes</h3>
                    </div>
                    <button className="text-[10px] text-accent uppercase font-bold tracking-widest hover:underline">Ver Detalhes</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase text-zinc-600 border-b border-white/5">
                                <th className="pb-4 font-bold tracking-widest">Prospecto</th>
                                <th className="pb-4 font-bold tracking-widest">Data</th>
                                <th className="pb-4 font-bold tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(leads || []).slice(0, 5).map((lead) => (
                                <tr key={lead.id} className="group">
                                    <td className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-white font-medium">{lead.nome}</span>
                                            <span className="text-[10px] text-zinc-500">{lead.email || 'Telefone: ' + lead.telefone}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-xs text-zinc-400">
                                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className="text-[9px] px-3 py-1 bg-accent/10 text-accent rounded-full font-bold uppercase tracking-tighter">
                                            {lead.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {totalLeads === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-sm text-zinc-600 italic">
                                        Nenhum lead registrado até o momento.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

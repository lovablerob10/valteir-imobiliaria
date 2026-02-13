export default function AdminDashboard() {
    const stats = [
        { name: "Imóveis Ativos", value: "24", trend: "+2 este mês" },
        { name: "Novos Leads", value: "12", trend: "Últimas 48h" },
        { name: "Visualizações", value: "1.2k", trend: "+15% vs ontem" },
        { name: "Tickets Abertos", value: "05", trend: "--" },
    ];

    return (
        <div className="space-y-12">
            {/* Welcome Section */}
            <section>
                <h1 className="text-4xl font-serif mb-2">Painel de Controle</h1>
                <p className="text-zinc-500">Bem-vindo de volta, Arthur. Aqui está o resumo do seu portfólio hoje.</p>
            </section>

            {/* Quick Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:border-accent/30 transition-all group">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">{stat.name}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-serif text-white">{stat.value}</h3>
                            <span className="text-[10px] text-accent font-medium">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </section>

            {/* Recent Activity / Tasks (Placeholders) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                    <h4 className="text-xl font-serif mb-6">Últimos Leads</h4>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-900">
                                <div>
                                    <p className="text-sm font-medium">Lead #{i}2024</p>
                                    <p className="text-xs text-zinc-500">Interesse em: Mansão Itaim</p>
                                </div>
                                <span className="text-[10px] bg-accent/10 text-accent px-3 py-1 rounded-full uppercase font-bold tracking-tighter">Novo</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                    <h4 className="text-xl font-serif mb-6">Status dos Imóveis</h4>
                    <div className="h-48 flex items-center justify-center text-zinc-700 italic border-2 border-dashed border-zinc-800 rounded-2xl">
                        Gráfico de performance em breve...
                    </div>
                </div>
            </section>
        </div>
    );
}

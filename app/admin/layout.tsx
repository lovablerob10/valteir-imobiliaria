import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <AdminSidebar />
            <div className="lg:pl-64 transition-all duration-300">
                <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-30">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Gestão Imobiliária
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-white">Arthur Valteir</span>
                            <span className="text-[10px] text-accent uppercase tracking-widest">Administrador</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-accent">AV</span>
                        </div>
                    </div>
                </header>
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

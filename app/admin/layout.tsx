import AdminSidebar from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('user_id', user?.id)
        .single();

    const userName = profile?.full_name || "Administrador";
    const userRole = profile?.role === 'admin_master' ? 'Master Admin' : 'Corretor VIP';
    const Initials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <AdminSidebar />
            <div className="lg:pl-64 transition-all duration-300">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md sticky top-0 z-30">
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                            Gestão de Ativos <span className="text-accent">/ Valteir</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-white tracking-wide">{userName}</span>
                            <span className="text-[9px] text-accent uppercase font-bold tracking-[0.2em] opacity-80">{userRole}</span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center shadow-lg group hover:border-accent/30 transition-all">
                            <span className="text-[10px] font-black text-accent group-hover:scale-110 transition-transform">{Initials}</span>
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

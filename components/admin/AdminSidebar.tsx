"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Home,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    Menu,
    X,
    PlusCircle,
    MessageSquare
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
    className?: string;
}

export default function AdminSidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
        { name: "Imóveis", icon: Home, href: "/admin/imoveis" },
        { name: "Leads", icon: MessageSquare, href: "/admin/leads" },
        { name: "Equipe", icon: Users, href: "/admin/equipe" },
        { name: "Configurações", icon: Settings, href: "/admin/configuracoes" },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-accent text-primary rounded-full shadow-lg"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            <aside className={`fixed top-0 left-0 h-full bg-zinc-950 border-r border-zinc-900 transition-all duration-300 z-40 ${isOpen ? "w-64" : "w-20 lg:w-20"
                } ${className}`}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="h-24 flex items-center px-6 border-b border-zinc-900">
                        <Link href="/" className="flex items-center gap-2 overflow-hidden">
                            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center shrink-0">
                                <span className="text-primary font-serif font-black">V</span>
                            </div>
                            <span className={`text-lg font-serif text-white tracking-widest transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
                                ADMIN
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 py-8 px-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${isActive ? "bg-accent/10 text-accent" : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-accent" : "group-hover:text-accent"}`} />
                                    <span className={`text-xs font-bold uppercase tracking-widest transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
                                        {item.name}
                                    </span>
                                    {isActive && isOpen && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Section */}
                    <div className="p-4 border-t border-zinc-900">
                        <Link
                            href="/admin/imoveis/novo"
                            className={`flex items-center gap-4 p-3 mb-2 rounded-xl bg-accent text-primary font-bold transition-all hover:bg-white mb-4 ${!isOpen && "justify-center px-0"
                                }`}
                        >
                            <PlusCircle className="w-5 h-5" />
                            {isOpen && <span className="text-[10px] uppercase tracking-tighter">Novo Imóvel</span>}
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 w-full p-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all group"
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            {isOpen && <span className="text-xs font-bold uppercase tracking-widest">Sair</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

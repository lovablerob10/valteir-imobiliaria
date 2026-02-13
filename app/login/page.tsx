"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast.success("Bem-vindo ao Exclusivo!");
            router.push("/admin");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Credenciais inválidas");
        } finally {
            setLoading(false);
        }
    };

    if (!isMounted) return null;

    return (
        <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#050505]">
            {/* Cinematic Background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] animate-subtle-zoom"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1600607687940-4e524cb35d0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                }}
            />

            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-20 w-full max-w-[440px]"
            >
                {/* Login Card with Glassmorphism */}
                <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                    {/* Brand Identity */}
                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 mb-6 flex items-center justify-center border border-accent/30 rounded-full bg-zinc-950/50 relative group"
                        >
                            <div className="absolute inset-0 rounded-full bg-accent/5 blur-xl group-hover:bg-accent/10 transition-all" />
                            <span className="text-3xl font-serif text-accent relative z-10">V</span>
                        </motion.div>
                        <h1 className="text-white text-2xl font-serif tracking-[0.2em] uppercase text-center">
                            Valteir <span className="italic text-accent">Imobiliária</span>
                        </h1>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold mt-2 opacity-60">
                            Curadoria de Alto Padrão
                        </p>
                    </div>

                    {/* Welcome Text */}
                    <div className="text-center mb-10">
                        <h2 className="text-white text-xl font-medium mb-2">Bem-vindo ao Painel</h2>
                        <p className="text-zinc-400 text-sm font-light">Acesse sua gestão personalizada de ativos elite.</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2 group">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1 group-focus-within:text-accent transition-colors">E-mail Corporativo</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="email"
                                    placeholder="seu@valteirimoveis.com.br"
                                    className="w-full bg-zinc-900/50 border border-white/5 focus:border-accent/40 focus:ring-1 focus:ring-accent/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-700 transition-all font-light outline-none text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold group-focus-within:text-accent transition-colors">Chave de Acesso</label>
                                <button type="button" className="text-[9px] uppercase tracking-tighter text-accent/60 hover:text-accent transition-colors font-bold">Esqueci a senha</button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-900/50 border border-white/5 focus:border-accent/40 focus:ring-1 focus:ring-accent/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-700 transition-all font-light outline-none text-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-14 bg-accent hover:bg-white text-zinc-950 font-bold tracking-[0.2em] uppercase rounded-2xl shadow-[0_10px_30px_rgba(197,159,89,0.2)] transition-all duration-500 transform active:scale-[0.98] text-xs"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Verificando...</span>
                                    </div>
                                ) : (
                                    "Acessar Painel"
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Footer security tag */}
                    <div className="mt-12 flex items-center justify-center space-x-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-60 transition-all cursor-default">
                        <ShieldCheck className="w-4 h-4 text-accent" />
                        <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-white">Segurança Nível Militar</span>
                    </div>
                </div>

                {/* Sub-footer help link */}
                <div className="mt-8 text-center">
                    <p className="text-zinc-600 text-xs font-light tracking-wide space-x-1">
                        <span>Precisa de assistência técnica?</span>
                        <a href="mailto:suporte@valteirimoveis.com.br" className="text-zinc-400 hover:text-accent transition-colors font-medium border-b border-zinc-800 pb-0.5">Falar com Suporte</a>
                    </p>
                </div>
            </motion.div>

            <style jsx global>{`
                @keyframes subtle-zoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                .animate-subtle-zoom {
                    animation: subtle-zoom 30s infinite alternate ease-in-out;
                }
            `}</style>
        </main>
    );
}


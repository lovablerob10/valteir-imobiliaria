"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoginForm, VideoBackground } from "@/components/sections/LuxuryLogin";

export default function LoginPage() {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogin = async (email: string, password: string, remember: boolean) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast.success("Bem-vindo de volta ao Valteir Imobiliária.");
            router.push("/admin");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Credenciais inválidas");
        }
    };

    if (!isMounted) return null;

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-hidden">
            <VideoBackground videoUrl="/videos/hero-entrance.mp4" />

            <div className="relative z-20 w-full max-w-md animate-in fade-in zoom-in duration-700">
                <LoginForm onSubmit={handleLogin} />
            </div>

            <footer className="absolute bottom-6 left-0 right-0 text-center text-zinc-600 text-[10px] uppercase tracking-widest z-20">
                © {new Date().getFullYear()} Valteir Imobiliária. All rights reserved.
            </footer>
        </main>
    );
}


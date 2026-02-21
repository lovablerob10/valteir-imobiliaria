"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";

export default function SetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setSuccess(true);
            toast.success("Senha definida com sucesso!");

            setTimeout(() => {
                router.push("/admin");
            }, 2000);
        } catch (error: any) {
            toast.error(error.message || "Erro ao definir senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-amber-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Senha Definida!</h1>
                    <p className="text-zinc-400">Redirecionando para o painel administrativo...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8 space-y-3">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-amber-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Defina sua Senha
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Bem-vindo ao <span className="text-amber-500 font-semibold">Valteir Imobiliária</span>.
                        Crie uma senha segura para acessar o painel administrativo.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSetPassword} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400 font-medium">
                            Nova Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400 font-medium">
                            Confirme a Senha
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repita a senha"
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                            required
                            minLength={6}
                        />
                    </div>

                    {/* Password strength indicator */}
                    {password.length > 0 && (
                        <div className="space-y-1">
                            <div className="flex gap-1">
                                <div className={`h-1 flex-1 rounded-full transition-all ${password.length >= 2 ? 'bg-red-500' : 'bg-zinc-800'}`} />
                                <div className={`h-1 flex-1 rounded-full transition-all ${password.length >= 4 ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                                <div className={`h-1 flex-1 rounded-full transition-all ${password.length >= 6 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                                <div className={`h-1 flex-1 rounded-full transition-all ${password.length >= 8 && /[!@#$%^&*]/.test(password) ? 'bg-emerald-400' : 'bg-zinc-800'}`} />
                            </div>
                            <p className="text-xs text-zinc-500">
                                {password.length < 6 ? 'Senha fraca' : password.length < 8 ? 'Senha boa' : 'Senha forte'}
                            </p>
                        </div>
                    )}

                    {/* Match indicator */}
                    {confirmPassword.length > 0 && (
                        <p className={`text-xs ${password === confirmPassword ? 'text-emerald-500' : 'text-red-500'}`}>
                            {password === confirmPassword ? '✓ Senhas coincidem' : '✗ Senhas não coincidem'}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || password.length < 6 || password !== confirmPassword}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                    >
                        {loading ? "Salvando..." : "Definir Senha e Acessar"}
                    </button>
                </form>

                <p className="text-center text-zinc-600 text-xs mt-8">
                    © {new Date().getFullYear()} Valteir Imobiliária
                </p>
            </div>
        </main>
    );
}

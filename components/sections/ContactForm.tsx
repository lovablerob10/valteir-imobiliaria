"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

const leadSchema = z.object({
    nome: z.string().min(2, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    telefone: z.string().min(10, "Telefone inválido"),
    mensagem: z.string().min(10, "A mensagem deve ser mais detalhada"),
});

interface ContactFormProps {
    imovelId?: string;
    imovelTitulo?: string;
}

export default function ContactForm({ imovelId, imovelTitulo }: ContactFormProps) {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof leadSchema>>({
        resolver: zodResolver(leadSchema),
    });

    async function onSubmit(data: z.infer<typeof leadSchema>) {
        setLoading(true);
        try {
            const { error } = await supabase.from("leads").insert({
                ...data,
                imovel_id: imovelId || null,
                status: 'novo',
            });

            if (error) throw error;

            toast.success("Mensagem enviada! Em breve nossa equipe entrará em contato.");
            reset();
        } catch (error: any) {
            toast.error("Erro ao enviar: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-zinc-900/90 p-10 rounded-3xl border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            {/* Efeito de profundidade para evitar o aspecto "apagado" */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="mb-10 text-center">
                    <h3 className="text-2xl font-serif text-white mb-3">Solicitar Consultoria</h3>
                    <p className="text-zinc-500 text-[10px] leading-relaxed max-w-[240px] mx-auto uppercase tracking-[0.2em] font-bold opacity-80">
                        {imovelTitulo
                            ? `Interessado no imóvel ${imovelTitulo}? Envie seus dados.`
                            : "Consulte nossos especialistas sobre este imóvel."}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold ml-1">Nome Completo</label>
                            <Input
                                {...register("nome")}
                                placeholder="Como gostaria de ser chamado?"
                                className="bg-zinc-950/50 border-zinc-800 text-white h-14 focus:border-accent/50 focus:ring-accent/20 transition-all rounded-xl"
                            />
                            {errors.nome && <p className="text-red-500 text-[10px] uppercase font-bold mt-1 ml-1">{errors.nome.message}</p>}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold ml-1">E-mail</label>
                                <Input
                                    {...register("email")}
                                    placeholder="seu@email.com"
                                    className="bg-zinc-950/50 border-zinc-800 text-white h-14 focus:border-accent/50 focus:ring-accent/20 transition-all rounded-xl"
                                />
                                {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold mt-1 ml-1">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold ml-1">WhatsApp / Telefone</label>
                                <Input
                                    {...register("telefone")}
                                    placeholder="(11) 99999-9999"
                                    className="bg-zinc-950/50 border-zinc-800 text-white h-14 focus:border-accent/50 focus:ring-accent/20 transition-all rounded-xl"
                                />
                                {errors.telefone && <p className="text-red-500 text-[10px] uppercase font-bold mt-1 ml-1">{errors.telefone.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold ml-1">Mensagem</label>
                            <Textarea
                                {...register("mensagem")}
                                placeholder="Em que podemos ajudar?"
                                className="bg-zinc-950/50 border-zinc-800 text-white h-36 resize-none focus:border-accent/50 focus:ring-accent/20 transition-all rounded-xl"
                            />
                            {errors.mensagem && <p className="text-red-500 text-[10px] uppercase font-bold mt-1 ml-1">{errors.mensagem.message}</p>}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-gradient-to-r from-accent to-amber-600 text-primary font-bold tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl shadow-lg shadow-accent/10"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Send className="w-5 h-5 mr-3" />}
                        Enviar Solicitação
                    </Button>

                    <div className="pt-4">
                        <p className="text-[9px] text-zinc-600 text-center uppercase tracking-[0.1em] leading-relaxed max-w-[200px] mx-auto">
                            Seus dados estão protegidos sob nossa política de privacidade de luxo.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

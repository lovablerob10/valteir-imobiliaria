"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Save,
    ArrowLeft,
    Loader2,
    Maximize,
    Bed,
    Bath,
    Car,
    DollarSign,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { Imovel } from "@/types/database";

const formSchema = z.object({
    titulo: z.string().min(5, "Título muito curto"),
    descricao: z.string().min(20, "A descrição deve ser mais detalhada"),
    preco: z.coerce.number().min(0),
    tipo: z.enum(['casa', 'apartamento', 'terreno', 'comercial', 'mansao', 'cobertura', 'loft']),

    // Novos Campos
    tipo_negocio: z.enum(['venda', 'aluguel', 'ambos']).default('venda'),
    valor_locacao: z.coerce.number().optional().nullable(),
    valor_condominio: z.coerce.number().optional().nullable(),
    valor_iptu: z.coerce.number().optional().nullable(),
    garantias: z.array(z.string()).default([]),

    bairro: z.string().min(2),
    cidade: z.string().min(2),
    estado: z.string().min(2),
    endereco: z.string().min(5),
    quartos: z.coerce.number().min(0),
    suites: z.coerce.number().min(0),
    area_util: z.coerce.number().min(0),
    vagas_garagem: z.coerce.number().min(0),
    destaque: z.boolean().default(false),
    status: z.enum(['ativo', 'vendido', 'reservado', 'inativo', 'alugado']).default('ativo'),
});

const GARANTIAS_OPTIONS = [
    "Caução",
    "Seguro Fiança",
    "Fiador",
    "Título de Capitalização",
    "CredPago",
    "Outro"
];

interface PropertyFormProps {
    initialData?: Imovel;
    mode: 'create' | 'edit';
}

export default function PropertyForm({ initialData, mode }: PropertyFormProps) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>(initialData?.imagens || []);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            preco: Number(initialData.preco),
            quartos: Number(initialData.quartos || 0),
            suites: Number(initialData.suites || 0),
            area_util: Number(initialData.area_util || 0),
            vagas_garagem: Number(initialData.vagas_garagem || 0),
            valor_locacao: Number(initialData.valor_locacao || 0),
            valor_condominio: Number(initialData.valor_condominio || 0),
            valor_iptu: Number(initialData.valor_iptu || 0),
            tipo_negocio: (initialData.tipo_negocio as any) || 'venda',
            status: (initialData.status as any) || 'ativo',
            garantias: initialData.garantias || [],
        } : {
            tipo: 'mansao',
            estado: 'SP',
            cidade: 'São Paulo',
            destaque: false,
            tipo_negocio: 'venda',
            status: 'ativo',
            garantias: [],
        },
    });

    const tipoNegocio = form.watch("tipo_negocio");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (images.length === 0) {
            toast.error("Adicione ao menos uma imagem do imóvel.");
            return;
        }

        setLoading(true);
        try {
            const slug = values.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const payload = {
                ...values,
                slug: mode === 'create' ? slug : undefined, // Only set slug on create to avoid changes impacting SEO
                imagens: images,
                updated_at: new Date().toISOString(),
                // Ensure zeros are nulls if preferred, or keep as zeros. Keeping as is for now.
            };

            let error;
            if (mode === 'create') {
                const { error: insertError } = await supabase.from("imoveis").insert({
                    ...payload,
                    visualizacoes: 0,
                    favoritos_count: 0,
                });
                error = insertError;
            } else {
                const { error: updateError } = await supabase
                    .from("imoveis")
                    .update(payload)
                    .eq("id", initialData!.id);
                error = updateError;
            }

            if (error) throw error;

            toast.success(mode === 'create' ? "Imóvel cadastrado!" : "Imóvel atualizado!");
            router.push("/admin/imoveis");
            router.refresh();
        } catch (error: any) {
            toast.error("Erro ao salvar: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* Seção 1: Imagens */}
            <section className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
                <h2 className="text-xl font-serif text-white mb-6">Galeria de Imagens</h2>
                <ImageUpload images={images} onChange={setImages} />
            </section>

            {/* Seção 2: Informações do Negócio */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 space-y-6">
                    <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-accent" />
                        Finanças & Negócio
                    </h2>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Tipo de Negócio</label>
                        <Select onValueChange={(val) => form.setValue("tipo_negocio", val as any)} defaultValue={form.getValues("tipo_negocio")}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 h-12">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                <SelectItem value="venda">Venda</SelectItem>
                                <SelectItem value="aluguel">Aluguel</SelectItem>
                                <SelectItem value="ambos">Venda e Aluguel</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {(tipoNegocio === 'venda' || tipoNegocio === 'ambos') && (
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Valor Venda</label>
                                <div className="relative">
                                    <Input type="number" {...form.register("preco")} className="bg-zinc-950 border-zinc-800 pl-8" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">$</span>
                                </div>
                            </div>
                        )}
                        {(tipoNegocio === 'aluguel' || tipoNegocio === 'ambos') && (
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-accent font-black">Valor Aluguel</label>
                                <div className="relative">
                                    <Input type="number" {...form.register("valor_locacao")} className="bg-zinc-950 border-accent/30 pl-8" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent text-xs">$</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Condomínio</label>
                            <Input type="number" {...form.register("valor_condominio")} className="bg-zinc-950 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">IPTU (Mensal)</label>
                            <Input type="number" {...form.register("valor_iptu")} className="bg-zinc-950 border-zinc-800" />
                        </div>
                    </div>

                    {(tipoNegocio === 'aluguel' || tipoNegocio === 'ambos') && (
                        <div className="pt-4 border-t border-zinc-800 space-y-4">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Garantias Aceitas
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {GARANTIAS_OPTIONS.map((g) => (
                                    <label key={g} className="flex items-center space-x-2 bg-zinc-950 p-2 rounded cursor-pointer hover:bg-zinc-900">
                                        <Checkbox
                                            checked={form.watch("garantias")?.includes(g)}
                                            onCheckedChange={(checked) => {
                                                const current = form.getValues("garantias") || [];
                                                if (checked) {
                                                    form.setValue("garantias", [...current, g]);
                                                } else {
                                                    form.setValue("garantias", current.filter((item) => item !== g));
                                                }
                                            }}
                                            className="border-zinc-700 data-[state=checked]:bg-accent data-[state=checked]:text-black"
                                        />
                                        <span className="text-xs text-zinc-300">{g}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 space-y-6">
                    <h2 className="text-xl font-serif text-white mb-6">Dados do Imóvel</h2>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Título</label>
                        <Input {...form.register("titulo")} placeholder="Ex: Mansão Suspensa Itaim" className="bg-zinc-950 border-zinc-800" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Tipo</label>
                            <Select onValueChange={(val) => form.setValue("tipo", val as any)} defaultValue={form.getValues("tipo")}>
                                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="mansao">Mansão</SelectItem>
                                    <SelectItem value="cobertura">Cobertura</SelectItem>
                                    <SelectItem value="apartamento">Apartamento</SelectItem>
                                    <SelectItem value="casa">Casa</SelectItem>
                                    <SelectItem value="terreno">Terreno</SelectItem>
                                    <SelectItem value="comercial">Comercial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Status</label>
                            <Select onValueChange={(val) => form.setValue("status", val as any)} defaultValue={form.getValues("status")}>
                                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="reservado">Reservado</SelectItem>
                                    <SelectItem value="vendido">Vendido</SelectItem>
                                    <SelectItem value="alugado">Alugado</SelectItem>
                                    <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Descrição</label>
                        <div className="h-48">
                            <Textarea {...form.register("descricao")} placeholder="Detalhes exclusivos..." className="bg-zinc-950 border-zinc-800 h-full resize-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção 3: Detalhes Técnicos */}
            <section className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
                <h2 className="text-xl font-serif text-white mb-6">Características & Localização</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black flex items-center gap-2">
                                <Maximize className="w-3 h-3" /> Área Útil (m²)
                            </label>
                            <Input type="number" {...form.register("area_util")} className="bg-zinc-950 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black flex items-center gap-2">
                                <Bed className="w-3 h-3" /> Quartos
                            </label>
                            <Input type="number" {...form.register("quartos")} className="bg-zinc-950 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black flex items-center gap-2">
                                <Bath className="w-3 h-3" /> Suítes
                            </label>
                            <Input type="number" {...form.register("suites")} className="bg-zinc-950 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black flex items-center gap-2">
                                <Car className="w-3 h-3" /> Vagas
                            </label>
                            <Input type="number" {...form.register("vagas_garagem")} className="bg-zinc-950 border-zinc-800" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input {...form.register("bairro")} placeholder="Bairro" className="bg-zinc-950 border-zinc-800" />
                            <Input {...form.register("cidade")} placeholder="Cidade" className="bg-zinc-950 border-zinc-800" />
                        </div>
                        <Input {...form.register("endereco")} placeholder="Endereço completo" className="bg-zinc-950 border-zinc-800" />
                        <div className="pt-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <Checkbox
                                    checked={form.watch("destaque")}
                                    onCheckedChange={(checked) => form.setValue("destaque", checked as boolean)}
                                    className="border-zinc-700 data-[state=checked]:bg-accent data-[state=checked]:text-black"
                                />
                                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">Imóvel em Destaque na Home</span>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-end gap-4 pb-20">
                <Button type="button" variant="outline" className="h-14 px-8 border-zinc-800 bg-transparent text-white" onClick={() => router.back()}>
                    Cancelar
                </Button>
                <Button type="submit" className="h-14 px-12 bg-accent text-primary font-bold tracking-widest uppercase hover:bg-white" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {mode === 'create' ? "Cadastrar Imóvel" : "Salvar Alterações"}
                </Button>
            </div>
        </form>
    );
}

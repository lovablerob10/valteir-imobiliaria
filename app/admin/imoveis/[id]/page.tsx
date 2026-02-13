"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
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
import {
    Save,
    ArrowLeft,
    Loader2,
    Maximize,
    Bed,
    Bath,
    Car
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
    bairro: z.string().min(2),
    cidade: z.string().min(2),
    estado: z.string().min(2),
    endereco: z.string().min(5),
    quartos: z.coerce.number().min(0),
    suites: z.coerce.number().min(0),
    area_util: z.coerce.number().min(0),
    vagas_garagem: z.coerce.number().min(0),
    destaque: z.boolean().default(false),
    status: z.enum(['ativo', 'vendido', 'reservado', 'inativo']).default('ativo'),
});

export default function EditPropertyPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        async function fetchProperty() {
            const { data, error } = await supabase
                .from("imoveis")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                toast.error("Erro ao carregar imóvel");
                router.push("/admin/imoveis");
                return;
            }

            const property = data as Imovel;
            form.reset({
                titulo: property.titulo,
                descricao: property.descricao || "",
                preco: Number(property.preco),
                tipo: property.tipo,
                bairro: property.bairro,
                cidade: property.cidade,
                estado: property.estado,
                endereco: property.endereco,
                quartos: Number(property.quartos || 0),
                suites: Number(property.suites || 0),
                area_util: Number(property.area_util || 0),
                vagas_garagem: Number(property.vagas_garagem || 0),
                destaque: Boolean(property.destaque),
                status: property.status as any,
            });
            setImages(property.imagens || []);
            setLoading(false);
        }
        fetchProperty();
    }, [id, supabase, form, router]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (images.length === 0) {
            toast.error("O imóvel deve ter ao menos uma imagem.");
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from("imoveis")
                .update({
                    ...values,
                    imagens: images,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", id);

            if (error) throw error;

            toast.success("Alterações salvas com sucesso!");
            router.push("/admin/imoveis");
            router.refresh();
        } catch (error: any) {
            toast.error("Erro ao salvar: " + error.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
                <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Carregando dados...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin/imoveis" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
                </Link>
                <h1 className="text-3xl font-serif text-white">Editar Imóvel</h1>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                {/* Seção 1: Imagens */}
                <section className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
                    <h2 className="text-xl font-serif text-white mb-6">Galeria Atual</h2>
                    <ImageUpload images={images} onChange={setImages} />
                </section>

                {/* Seção 2: Informações Básicas */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 space-y-6">
                        <h2 className="text-xl font-serif text-white mb-6">Dados Principais</h2>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Título do Imóvel</label>
                            <Input {...form.register("titulo")} className="bg-zinc-950 border-zinc-800" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Preço</label>
                                <Input type="number" {...form.register("preco")} className="bg-zinc-950 border-zinc-800 pl-8" />
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
                                        <SelectItem value="inativo">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Descrição</label>
                            <Textarea {...form.register("descricao")} className="bg-zinc-950 border-zinc-800 h-32" />
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 space-y-6">
                        <h2 className="text-xl font-serif text-white mb-6">Características</h2>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 text-accent">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black flex items-center gap-2">
                                    <Maximize className="w-3 h-3" /> Área (m²)
                                </label>
                                <Input type="number" {...form.register("area_util")} className="bg-zinc-950 border-zinc-800 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black flex items-center gap-2">
                                    <Bed className="w-3 h-3" /> Quartos
                                </label>
                                <Input type="number" {...form.register("quartos")} className="bg-zinc-950 border-zinc-800" />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-800 space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" {...form.register("destaque")} className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-accent focus:ring-accent" />
                                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">Imóvel em Destaque na Home</span>
                            </label>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end gap-4 pb-20">
                    <Button type="button" variant="outline" className="h-14 px-8 border-zinc-800 bg-transparent text-white" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="h-14 px-12 bg-accent text-primary font-bold tracking-widest uppercase hover:bg-white" disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Salvar Alterações
                    </Button>
                </div>
            </form>
        </div>
    );
}

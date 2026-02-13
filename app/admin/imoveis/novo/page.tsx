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
import {
    Save,
    ArrowLeft,
    Loader2,
    Euro,
    Maximize,
    Bed,
    Bath,
    Car
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

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
});

export default function NewPropertyPage() {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            tipo: 'mansao',
            estado: 'SP',
            cidade: 'São Paulo',
            destaque: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (images.length === 0) {
            toast.error("Adicione ao menos uma imagem do imóvel.");
            return;
        }

        setLoading(true);
        try {
            const slug = values.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const { error } = await supabase.from("imoveis").insert({
                ...values,
                slug,
                imagens: images,
                status: 'ativo',
                visualizacoes: 0,
                favoritos_count: 0,
            });

            if (error) throw error;

            toast.success("Imóvel cadastrado com sucesso!");
            router.push("/admin/imoveis");
            router.refresh();
        } catch (error: any) {
            toast.error("Erro ao salvar: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin/imoveis" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
                </Link>
                <h1 className="text-3xl font-serif text-white">Novo Imóvel de Luxo</h1>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                {/* Seção 1: Imagens */}
                <section className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
                    <h2 className="text-xl font-serif text-white mb-6">Galeria de Imagens</h2>
                    <ImageUpload images={images} onChange={setImages} />
                </section>

                {/* Seção 2: Informações Básicas */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 space-y-6">
                        <h2 className="text-xl font-serif text-white mb-6">Dados Principais</h2>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Título do Imóvel</label>
                            <Input {...form.register("titulo")} placeholder="Ex: Mansão Suspensa Itaim" className="bg-zinc-950 border-zinc-800" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Preço de Venda</label>
                                <div className="relative">
                                    <Input type="number" {...form.register("preco")} className="bg-zinc-950 border-zinc-800 pl-8" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">$</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Tipo</label>
                                <Select onValueChange={(val) => form.setValue("tipo", val as any)} defaultValue="mansao">
                                    <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="mansao">Mansão</SelectItem>
                                        <SelectItem value="cobertura">Cobertura</SelectItem>
                                        <SelectItem value="apartamento">Apartamento</SelectItem>
                                        <SelectItem value="casa">Casa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Descrição</label>
                            <div className="h-48">
                                <Textarea {...form.register("descricao")} placeholder="Detalhes exclusivos do imóvel..." className="bg-zinc-950 border-zinc-800 h-full resize-none" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 space-y-6">
                        <h2 className="text-xl font-serif text-white mb-6">Características Técnicas</h2>

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

                        <div className="pt-6 border-t border-zinc-800 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Localização</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Input {...form.register("bairro")} placeholder="Bairro" className="bg-zinc-950 border-zinc-800" />
                                <Input {...form.register("cidade")} placeholder="Cidade" className="bg-zinc-950 border-zinc-800" />
                            </div>
                            <Input {...form.register("endereco")} placeholder="Endereço completo" className="bg-zinc-950 border-zinc-800" />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" className="h-14 px-8 border-zinc-800 bg-transparent text-white" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="h-14 px-12 bg-accent text-primary font-bold tracking-widest uppercase hover:bg-white" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Salvar Imóvel
                    </Button>
                </div>
            </form>
        </div>
    );
}

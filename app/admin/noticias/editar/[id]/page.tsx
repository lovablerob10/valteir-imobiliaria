"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Loader2,
    Type,
    Globe,
    ImageIcon,
    Eye,
    EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function EditNewsPage({ params }: { params: any }) {
    const { id } = use(params) as { id: string };
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const [form, setForm] = useState({
        titulo: "",
        slug: "",
        resumo: "",
        conteudo: "",
        imagem_capa: "",
        status: "rascunho",
        meta_title: "",
        meta_description: ""
    });

    useEffect(() => {
        fetchNews();
    }, [id]);

    async function fetchNews() {
        try {
            const { data, error } = await supabase
                .from("noticias")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            if (data) setForm(data);
        } catch (error: any) {
            toast.error("Erro ao carregar notícia: " + error.message);
            router.push("/admin/noticias");
        } finally {
            setLoading(false);
        }
    }

    // Auto-slug generation (only for new titles)
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/--+/g, "-")
            .trim();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setForm(prev => ({
            ...prev,
            titulo: title,
            slug: generateSlug(title),
            meta_title: title
        }));
    };

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from("noticias")
                .update(form)
                .eq("id", id);

            if (error) throw error;

            toast.success("Notícia atualizada!");
            router.push("/admin/noticias");
        } catch (error: any) {
            toast.error("Erro ao salvar: " + error.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Carregando News...</p>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Fixo / Ações */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
                <div className="flex items-center gap-4">
                    <Link href="/admin/noticias">
                        <Button variant="outline" size="icon" className="rounded-full border-zinc-800 hover:bg-zinc-900">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-serif text-white">Editar Notícia</h1>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mt-1">Refinando conteúdo</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Select
                        value={form.status}
                        onValueChange={(val) => setForm(prev => ({ ...prev, status: val }))}
                    >
                        <SelectTrigger className="w-32 bg-zinc-950 border-zinc-800 h-12 rounded-xl text-zinc-400">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-900">
                            <SelectItem value="rascunho">Rascunho</SelectItem>
                            <SelectItem value="publicado">Publicado</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        disabled={saving}
                        className="bg-accent hover:bg-white text-primary font-bold tracking-[0.2em] uppercase rounded-xl h-12 px-8 flex-1 md:flex-none"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                        Salvar Alterações
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-accent mb-2">
                            <Type className="w-4 h-4" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Informações Básicas</span>
                        </div>

                        <div className="space-y-4">
                            <label className="text-zinc-300 text-sm font-medium">Título da Notícia</label>
                            <Input
                                required
                                value={form.titulo}
                                onChange={handleTitleChange}
                                className="bg-zinc-900/50 border-zinc-800 h-14 text-lg font-serif focus:ring-accent/20"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-zinc-300 text-sm font-medium">Link Permanente (Slug)</label>
                            <div className="flex items-center gap-3 bg-zinc-900/30 border border-zinc-800 rounded-xl px-4 h-12 opacity-70">
                                <span className="text-zinc-600 text-sm">valteir.com.br/blog/</span>
                                <input
                                    required
                                    value={form.slug}
                                    readOnly
                                    className="bg-transparent border-none focus:ring-0 text-accent text-sm flex-1 outline-none cursor-not-allowed"
                                />
                            </div>
                            <p className="text-[10px] text-zinc-600 italic">* O slug é gerado automaticamente e não pode ser editado após a criação por segurança de SEO.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-zinc-300 text-sm font-medium">Resumo (Chamada)</label>
                            <Textarea
                                required
                                value={form.resumo}
                                onChange={(e) => setForm({ ...form, resumo: e.target.value })}
                                className="bg-zinc-900/50 border-zinc-800 min-h-[100px] resize-none focus:ring-accent/20"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-zinc-300 text-sm font-medium">Conteúdo (Texto)</label>
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
                                <div className="bg-zinc-950 p-3 border-b border-zinc-800 flex gap-2">
                                    <Badge variant="outline" className="text-[10px] border-zinc-800 uppercase">Markdown Suportado</Badge>
                                </div>
                                <Textarea
                                    required
                                    value={form.conteudo}
                                    onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
                                    className="bg-transparent border-none min-h-[400px] focus:ring-0 resize-y p-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lateral / Configurações */}
                <div className="space-y-10">
                    {/* Preview Badge */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-8 flex items-center justify-between">
                        <span className="text-white font-bold text-sm tracking-wider uppercase">Visualizar</span>
                        <Link href={`/blog/${form.slug}`} target="_blank">
                            <Button variant="outline" size="icon" className="rounded-full border-zinc-800">
                                <Eye className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Imagem de Capa */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3 text-accent">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Mídia de Capa</span>
                        </div>
                        <Input
                            value={form.imagem_capa}
                            onChange={(e) => setForm({ ...form, imagem_capa: e.target.value })}
                            className="bg-zinc-950 border-zinc-800 h-12"
                        />
                        <div className="aspect-video bg-zinc-950 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center overflow-hidden">
                            {form.imagem_capa && (
                                <img src={form.imagem_capa} className="w-full h-full object-cover" alt="Preview" />
                            )}
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3 text-accent">
                            <Globe className="w-4 h-4" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">SEO & Metadata</span>
                        </div>

                        <div className="space-y-4">
                            <label className="text-zinc-400 text-xs">Título SEO</label>
                            <Input
                                value={form.meta_title}
                                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                                maxLength={60}
                                className="bg-zinc-950 border-zinc-800 h-10 text-xs"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-zinc-400 text-xs">Descrição SEO (Meta)</label>
                            <Textarea
                                value={form.meta_description}
                                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                                maxLength={160}
                                className="bg-zinc-950 border-zinc-800 text-xs min-h-[80px] resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

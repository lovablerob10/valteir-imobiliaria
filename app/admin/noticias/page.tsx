"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Plus,
    Loader2,
    Trash2,
    Pencil,
    ExternalLink,
    Search,
    Eye,
    EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

export default function NewsAdminPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const supabase = createClient();

    useEffect(() => {
        fetchNews();
    }, [supabase]);

    async function fetchNews() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("noticias")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                if (error.code === '42P01') {
                    toast.error("Tabela de notícias não encontrada. Execute o script SQL.");
                } else {
                    toast.error("Erro ao buscar notícias: " + error.message);
                }
                return;
            }
            setNews(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function deleteNews(id: string) {
        if (!confirm("Deseja realmente excluir esta notícia?")) return;

        const { error } = await supabase.from("noticias").delete().eq("id", id);
        if (!error) {
            setNews(news.filter(n => n.id !== id));
            toast.success("Notícia excluída");
        }
    }

    const filteredNews = news.filter(n =>
        n.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-1">Notícias do Mercado</h1>
                    <p className="text-zinc-500 text-sm">Gerencie o conteúdo do seu blog e estratégias de SEO.</p>
                </div>
                <Link href="/admin/noticias/nova">
                    <Button className="bg-accent hover:bg-white text-primary font-bold tracking-[0.2em] uppercase rounded-xl h-12 px-6">
                        <Plus className="w-5 h-5 mr-2" /> Nova Notícia
                    </Button>
                </Link>
            </div>

            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-accent transition-colors" />
                <Input
                    placeholder="Buscar notícias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 bg-zinc-900/50 border-zinc-800 h-12 rounded-xl focus:border-accent/30"
                />
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <Loader2 className="w-12 h-12 text-accent animate-spin" />
                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Carregando Blog...</p>
                    </div>
                ) : filteredNews.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-950/50">
                                <TableRow className="border-zinc-900 hover:bg-transparent">
                                    <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest py-6 px-8">Notícia / Status</TableHead>
                                    <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-8">Data de Publicação</TableHead>
                                    <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-8 text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredNews.map((item) => (
                                    <TableRow key={item.id} className="border-zinc-900/50 hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="py-6 px-8">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-white font-serif text-lg leading-tight">{item.titulo}</span>
                                                <div className="flex items-center gap-2">
                                                    {item.status === 'publicado' ? (
                                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-1">
                                                            <Eye className="w-3 h-3" /> Publicado
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30 gap-1">
                                                            <EyeOff className="w-3 h-3" /> Rascunho
                                                        </Badge>
                                                    )}
                                                    <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">/{item.slug}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8">
                                            <div className="text-zinc-400 text-sm">
                                                {new Date(item.created_at).toLocaleDateString("pt-BR", {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/blog/${item.slug}`} target="_blank">
                                                    <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-500 hover:text-white rounded-xl">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/noticias/editar/${item.id}`}>
                                                    <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-500 hover:text-white rounded-xl">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-zinc-600 hover:text-red-500 hover:bg-red-500/5 rounded-xl"
                                                    onClick={() => deleteNews(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="py-40 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-800">
                            <FileText className="w-6 h-6 text-zinc-600" />
                        </div>
                        <div>
                            <p className="text-white font-serif text-xl">Nenhuma notícia ainda</p>
                            <p className="text-zinc-500 text-sm mt-1">Clique em "Nova Notícia" para começar seu blog.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

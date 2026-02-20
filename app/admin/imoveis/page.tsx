"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Imovel } from "@/types/database";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    MoreHorizontal,
    Plus,
    Search,
    Edit,
    Trash2,
    ExternalLink,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function AdminImoveisPage() {
    const [imoveis, setImoveis] = useState<Imovel[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const supabase = createClient();

    useEffect(() => {
        fetchImoveis();
    }, [supabase]);

    async function fetchImoveis() {
        setLoading(true);
        const { data, error } = await supabase
            .from("imoveis")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) {
            setImoveis(data as Imovel[]);
        } else {
            toast.error("Erro ao carregar imóveis");
        }
        setLoading(false);
    }

    async function deleteImovel(id: string) {
        if (!window.confirm("Deseja realmente excluir este imóvel e todas as suas imagens?")) return;

        const { error } = await supabase
            .from("imoveis")
            .delete()
            .eq("id", id);

        if (!error) {
            setImoveis(prev => prev.filter(i => i.id !== id));
            toast.success("Imóvel excluído com sucesso");
        } else {
            toast.error("Erro ao excluir imóvel");
        }
    }

    const filteredImoveis = imoveis.filter(i =>
        i.titulo.toLowerCase().includes(search.toLowerCase()) ||
        i.bairro.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-1">Gestão de Imóveis</h1>
                    <p className="text-zinc-500 text-sm">Visualize e gerencie todo o seu catálogo de propriedades.</p>
                </div>
                <Link href="/admin/imoveis/novo">
                    <Button className="bg-accent text-primary font-bold tracking-widest uppercase text-xs h-12 px-6 rounded-xl hover:bg-white transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <Plus className="w-4 h-4 mr-2" /> Novo Imóvel
                    </Button>
                </Link>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-900 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-zinc-900 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                            placeholder="Buscar por título ou bairro..."
                            className="pl-10 bg-zinc-950 border-zinc-800 text-white focus:ring-accent/50"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                        <p className="text-zinc-500 font-medium tracking-widest uppercase text-[10px]">Carregando Portfólio...</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-zinc-950/50">
                            <TableRow className="border-zinc-900 hover:bg-transparent">
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest py-5 px-6">Imóvel</TableHead>
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-6">Tipo / Status</TableHead>
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-6">Preço</TableHead>
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-6 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredImoveis.map((imovel) => (
                                <TableRow key={imovel.id} className="border-zinc-900 hover:bg-zinc-800/10 transition-colors">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                                                <Image
                                                    src={imovel.imagens?.[0] || "/images/properties/placeholder.jpg"}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium line-clamp-1">{imovel.titulo}</p>
                                                <p className="text-zinc-500 text-xs">{imovel.bairro}, {imovel.cidade}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex flex-col gap-1.5">
                                            <Badge variant="outline" className="w-fit text-[9px] uppercase tracking-tighter border-zinc-800 text-zinc-400">
                                                {imovel.tipo}
                                            </Badge>
                                            <Badge className={`w-fit text-[9px] uppercase tracking-tighter ${imovel.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'
                                                }`}>
                                                {imovel.status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <p className="text-accent font-medium">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(imovel.preco)}
                                        </p>
                                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                                            {imovel.area_util}m² • {imovel.quartos}Q
                                        </p>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:text-white hover:bg-zinc-800">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-48">
                                                <DropdownMenuLabel className="text-zinc-500 text-[10px] uppercase tracking-widest p-4">Opções</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-zinc-800" />
                                                <Link href={`/admin/imoveis/${imovel.id}`}>
                                                    <DropdownMenuItem className="p-3 focus:bg-zinc-800 cursor-pointer">
                                                        <Edit className="w-4 h-4 mr-3 text-accent" /> Editar Detalhes
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/imovel/${imovel.slug}`} target="_blank">
                                                    <DropdownMenuItem className="p-3 focus:bg-zinc-800 cursor-pointer">
                                                        <ExternalLink className="w-4 h-4 mr-3 text-zinc-400" /> Ver no Site
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator className="bg-zinc-800" />
                                                <DropdownMenuItem
                                                    className="p-3 focus:bg-red-500/10 focus:text-red-500 text-red-500/70 cursor-pointer"
                                                    onClick={() => deleteImovel(imovel.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-3" /> Excluir Imóvel
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredImoveis.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-zinc-500 italic">
                                        Nenhum imóvel encontrado para sua busca.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}

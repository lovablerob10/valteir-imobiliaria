"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Imovel } from "@/types/database";
import PropertyCard from "@/components/sections/PropertyCard";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Imovel[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [type, setType] = useState<string>("all");
    const [priceRange, setPriceRange] = useState([0, 500000000]);
    const [businessType, setBusinessType] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const supabase = createClient();

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    useEffect(() => {
        // Reset para página 1 quando filtros mudam
        setPage(1);
    }, [search, type, priceRange[0], priceRange[1], businessType]);

    useEffect(() => {
        async function fetchProperties() {
            setLoading(true);

            // Query para contar o total
            let countQuery = supabase
                .from("imoveis")
                .select("*", { count: "exact", head: true })
                .eq("status", "ativo");

            // Query para os dados
            let dataQuery = supabase
                .from("imoveis")
                .select("*")
                .eq("status", "ativo");

            if (type !== "all") {
                countQuery = countQuery.eq("tipo", type);
                dataQuery = dataQuery.eq("tipo", type);
            }

            if (businessType !== "all") {
                countQuery = countQuery.eq("tipo_negocio", businessType);
                dataQuery = dataQuery.eq("tipo_negocio", businessType);
            }

            if (search) {
                countQuery = countQuery.ilike("titulo", `%${search}%`);
                dataQuery = dataQuery.ilike("titulo", `%${search}%`);
            }

            countQuery = countQuery.gte("preco", priceRange[0]).lte("preco", priceRange[1]);
            dataQuery = dataQuery.gte("preco", priceRange[0]).lte("preco", priceRange[1]);

            // Paginação
            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            dataQuery = dataQuery
                .order("destaque", { ascending: false })
                .order("created_at", { ascending: false })
                .range(from, to);

            const [countResult, dataResult] = await Promise.all([
                countQuery,
                dataQuery,
            ]);

            if (countResult.count !== null) {
                setTotalCount(countResult.count);
            }

            if (dataResult.error) {
                console.error("Error fetching properties:", dataResult.error);
            } else {
                setProperties((dataResult.data || []) as Imovel[]);
            }
            setLoading(false);
        }

        const timer = setTimeout(() => {
            fetchProperties();
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, type, priceRange[0], priceRange[1], businessType, page]);

    return (
        <main className="min-h-screen bg-primary pt-32 pb-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho */}
                <div className="mb-12">
                    <span className="text-accent text-xs font-medium tracking-[0.4em] uppercase mb-4 block">
                        Portfólio Valteir
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-8">
                        Encontre sua <span className="text-accent italic">residência ideal</span>
                    </h1>

                    {/* Filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input
                                placeholder="Buscar por título ou localização..."
                                className="pl-10 bg-zinc-950 border-zinc-800 text-white focus:ring-accent/50"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Select value={businessType} onValueChange={setBusinessType}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                                <SelectValue placeholder="Finalidade" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="venda">Venda</SelectItem>
                                <SelectItem value="aluguel">Locação</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                                <SelectValue placeholder="Tipo de Imóvel" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white font-sans">
                                <SelectItem value="all">Todos os tipos</SelectItem>
                                <SelectItem value="mansao">Mansões</SelectItem>
                                <SelectItem value="apartamento">Apartamentos</SelectItem>
                                <SelectItem value="cobertura">Coberturas</SelectItem>
                                <SelectItem value="casa">Casas de Condomínio</SelectItem>
                                <SelectItem value="terreno">Terrenos</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex flex-col justify-center px-2">
                            <div className="flex justify-between mb-2">
                                <span className="text-[10px] text-muted-luxury uppercase tracking-wider">Preço Máx</span>
                                <span className="text-[10px] text-accent font-bold">
                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(priceRange[1])}
                                </span>
                            </div>
                            <Slider
                                value={[priceRange[1]]}
                                max={500000000}
                                step={5000000}
                                onValueChange={(val) => setPriceRange([0, val[0]])}
                                className="accent-accent"
                            />
                        </div>
                    </div>
                </div>

                {/* Contador de resultados */}
                {!loading && (
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-zinc-500 text-sm">
                            <span className="text-accent font-bold">{totalCount}</span> imóvel(is) encontrado(s)
                            {totalPages > 1 && (
                                <span className="text-zinc-600 ml-2">
                                    — Página {page} de {totalPages}
                                </span>
                            )}
                        </p>
                    </div>
                )}

                {/* Grid de Resultados */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-[400px] w-full bg-zinc-900/50 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : properties.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>

                        {/* Paginação */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-16">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Anterior
                                </Button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                                    .reduce<(number | string)[]>((acc, p, i, arr) => {
                                        if (i > 0 && p - (arr[i - 1] as number) > 1) {
                                            acc.push('...');
                                        }
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((item, i) => (
                                        typeof item === 'string' ? (
                                            <span key={`dots-${i}`} className="text-zinc-600 px-2">...</span>
                                        ) : (
                                            <Button
                                                key={item}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setPage(item)}
                                                className={`w-10 h-10 p-0 ${page === item
                                                    ? 'bg-accent text-primary font-bold hover:bg-accent/90'
                                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                                    }`}
                                            >
                                                {item}
                                            </Button>
                                        )
                                    ))
                                }

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                                >
                                    Próxima
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-32 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
                        <X className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-xl font-serif text-white mb-2">Nenhum imóvel encontrado</h3>
                        <p className="text-muted-luxury">Tente ajustar seus filtros para encontrar o que procura.</p>
                        <button
                            onClick={() => { setSearch(""); setType("all"); setPriceRange([0, 50000000]); setBusinessType("all"); }}
                            className="mt-8 text-accent text-xs font-bold tracking-widest uppercase border-b border-accent/30 pb-1 hover:border-accent"
                        >
                            Limpar todos os filtros
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

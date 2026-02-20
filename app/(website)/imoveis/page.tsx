"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
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
import { Search, Filter, X } from "lucide-react";

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Imovel[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [type, setType] = useState<string>("all");
    const [priceRange, setPriceRange] = useState([0, 50000000]);
    const [businessType, setBusinessType] = useState<string>("all");

    useEffect(() => {
        async function fetchProperties() {
            setLoading(true);
            let query = supabase.from("imoveis").select("*").eq("status", "ativo");

            if (type !== "all") {
                query = query.eq("tipo", type);
            }

            if (businessType !== "all") {
                query = query.eq("tipo_negocio", businessType);
            }

            if (search) {
                query = query.ilike("titulo", `%${search}%`);
            }

            query = query.gte("preco", priceRange[0]).lte("preco", priceRange[1]);

            const { data, error } = await query.order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching properties:", error);
            } else {
                setProperties(data as Imovel[]);
            }
            setLoading(false);
        }

        const timer = setTimeout(() => {
            fetchProperties();
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, type, priceRange[0], priceRange[1], businessType]);

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
                                max={50000000}
                                step={500000}
                                onValueChange={(val) => setPriceRange([0, val[0]])}
                                className="accent-accent"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid de Resultados */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-[400px] w-full bg-zinc-900/50 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : properties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
                        <X className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-xl font-serif text-white mb-2">Nenhum imóvel encontrado</h3>
                        <p className="text-muted-luxury">Tente ajustar seus filtros para encontrar o que procura.</p>
                        <button
                            onClick={() => { setSearch(""); setType("all"); setPriceRange([0, 50000000]); }}
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

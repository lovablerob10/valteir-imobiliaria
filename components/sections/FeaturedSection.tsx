import PropertyCard from "./PropertyCard";
import { Imovel } from "@/types/database";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default async function FeaturedSection() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fallback.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback_key'
    );

    const { data: properties, error } = await supabase
        .from("imoveis")
        .select("*")
        .eq("status", "ativo")
        .eq("destaque", true)
        .order("ordem_destaque", { ascending: true })
        .limit(3);

    if (error) {
        console.error("Erro Supabase FeaturedSection:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
        return null;
    }

    if (!properties || properties.length === 0) {
        return (
            <section className="py-24 px-4 md:px-8 bg-zinc-950">
                <div className="max-w-7xl mx-auto text-center border border-zinc-900 rounded-3xl py-20 px-6">
                    <h2 className="text-2xl font-serif text-white mb-4">Nenhum imóvel em destaque</h2>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        Para que um imóvel apareça aqui, ele deve estar marcado como <strong>Ativo</strong> e <strong>Destaque</strong> no painel administrativo.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 px-4 md:px-8 bg-zinc-950">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-accent text-xs font-medium tracking-[0.4em] uppercase mb-4 block">
                            Curadoria Exclusiva
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
                            Onde o luxo encontra <br />
                            <span className="text-accent italic">o seu estilo de vida</span>
                        </h2>
                    </div>
                    <Link href="/imoveis">
                        <button className="text-accent text-xs font-bold tracking-[0.2em] uppercase border-b border-accent/30 pb-1 hover:border-accent transition-all flex items-center gap-2 group">
                            Ver todo o portfólio
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property as Imovel} />
                    ))}
                </div>
            </div>
        </section>
    );
}

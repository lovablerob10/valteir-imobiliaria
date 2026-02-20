import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function NewsSection() {
    const supabase = await createClient();

    const { data: noticias, error } = await supabase
        .from("noticias")
        .select("*")
        .eq("status", "publicado")
        .order("created_at", { ascending: false })
        .limit(3);

    if (error) {
        return (
            <div className="py-10 text-center text-zinc-500 text-xs">
                Erro ao carregar notícias: {error.message}
            </div>
        );
    }

    if (!noticias || noticias.length === 0) {
        return (
            <div className="py-10 text-center text-zinc-500 text-xs">
                Nenhuma notícia publicada encontrada no banco.
            </div>
        );
    }

    return (
        <section className="py-24 px-4 md:px-8 bg-zinc-950 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <span className="text-accent text-[10px] font-medium tracking-[0.4em] uppercase block">
                            Blog & Conteúdo
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-white max-w-xl">
                            Insights do Mercado <br />
                            <span className="text-accent italic">Imobiliário</span>
                        </h2>
                    </div>
                    <Link href="/blog">
                        <Button variant="link" className="text-accent text-xs font-bold tracking-widest uppercase p-0 group">
                            Ver todas as notícias <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {noticias.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group relative flex flex-col h-full bg-zinc-900/10 border border-white/5 rounded-3xl overflow-hidden hover:bg-zinc-900/30 transition-all"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                {post.imagem_capa ? (
                                    <Image
                                        src={post.imagem_capa}
                                        alt={post.titulo}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                        <Image src="/logo.png" alt="Logo" width={60} height={60} className="opacity-10" />
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950 to-transparent" />
                            </div>

                            <div className="p-8 space-y-4 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold tracking-widest uppercase">
                                    <Calendar className="w-3 h-3 text-accent" />
                                    {new Date(post.created_at).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                                </div>

                                <h3 className="text-xl font-serif text-white group-hover:text-accent transition-colors leading-tight">
                                    {post.titulo}
                                </h3>

                                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                                    {post.resumo}
                                </p>

                                <div className="pt-4 mt-auto">
                                    <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all">
                                        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

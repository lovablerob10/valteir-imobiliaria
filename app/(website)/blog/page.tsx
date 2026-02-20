import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600;

export default async function BlogPage() {
    const supabase = await createClient();

    const { data: noticias } = await supabase
        .from("noticias")
        .select("*")
        .eq("status", "publicado")
        .order("created_at", { ascending: false });

    const featuredPost = noticias && noticias.length > 0 ? noticias[0] : null;
    const remainingPosts = noticias ? noticias.slice(1) : [];

    return (
        <main className="pt-32 pb-32 bg-primary min-h-screen">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-3xl space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] w-12 bg-accent/30" />
                            <span className="text-accent text-[10px] font-medium tracking-[0.5em] uppercase">
                                Journal & Insights
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1]">
                            Crônicas do <br />
                            <span className="text-accent italic">Mercado de Luxo</span>
                        </h1>
                    </div>
                </div>

                {/* Featured Artigo */}
                {featuredPost && (
                    <div className="mb-24 group">
                        <Link href={`/blog/${featuredPost.slug}`} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="relative aspect-[16/9] lg:aspect-square rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                                {featuredPost.imagem_capa ? (
                                    <Image
                                        src={featuredPost.imagem_capa}
                                        alt={featuredPost.titulo}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-900 border border-zinc-800" />
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                            </div>
                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <Badge className="bg-accent text-primary font-bold tracking-widest uppercase text-[10px] px-4 py-1.5 rounded-full">
                                        Destaque
                                    </Badge>
                                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold tracking-widest uppercase">
                                        <Calendar className="w-3.5 h-3.5 text-accent/50" />
                                        {new Date(featuredPost.created_at).toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight group-hover:text-accent transition-colors duration-500">
                                    {featuredPost.titulo}
                                </h2>

                                <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                                    {featuredPost.resumo}
                                </p>

                                <div className="flex items-center gap-4 text-accent text-xs font-bold tracking-[0.3em] uppercase group-hover:gap-6 transition-all duration-500">
                                    Continuar Lendo <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-24" />

                {/* Grid de Artigos Secundários */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {remainingPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col space-y-8"
                        >
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/5">
                                {post.imagem_capa ? (
                                    <Image
                                        src={post.imagem_capa}
                                        alt={post.titulo}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-900" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            <div className="space-y-4 px-2">
                                <div className="flex items-center gap-4 text-zinc-500 text-[9px] font-bold tracking-[0.2em] uppercase">
                                    <span className="text-accent">{new Date(post.created_at).toLocaleDateString("pt-BR", { month: 'short', year: 'numeric' })}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                    <span>{post.autor || "Valteir Imob"}</span>
                                </div>
                                <h3 className="text-2xl font-serif text-white group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-tight">
                                    {post.titulo}
                                </h3>
                                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                                    {post.resumo}
                                </p>
                                <div className="pt-2">
                                    <span className="inline-flex items-center text-accent/70 group-hover:text-accent text-[10px] font-bold tracking-widest uppercase transition-colors">
                                        Explorar Artigo <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 opacity-0 group-hover:opacity-100 transition-all" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {!noticias || noticias.length === 0 && (
                    <div className="py-24 text-center space-y-6">
                        <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto border border-accent/10">
                            <span className="text-accent italic font-serif text-3xl">v</span>
                        </div>
                        <h3 className="text-2xl font-serif text-white">Nossas publicações estão a caminho</h3>
                        <p className="text-zinc-500 max-w-md mx-auto">Em breve, você encontrará aqui análises exclusivas e tendências do mercado imobiliário de alto padrão.</p>
                    </div>
                )}
            </div>
        </main>
    );
}

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: any }) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: post } = await supabase
        .from("noticias")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!post) return {};

    return {
        title: `${post.meta_title || post.titulo} | Valteir Imobiliária`,
        description: post.meta_description || post.resumo,
        openGraph: {
            title: post.titulo,
            description: post.resumo,
            images: post.imagem_capa ? [post.imagem_capa] : [],
        },
    };
}

export default async function BlogPostPage({ params }: { params: any }) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from("noticias")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!post) notFound();

    return (
        <article className="min-h-screen bg-zinc-950 pt-32 pb-24">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-accent/5 blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 md:px-8 relative">
                {/* Back Link */}
                <Link href="/blog" className="inline-flex items-center text-accent text-[10px] uppercase font-bold tracking-[0.3em] mb-12 hover:pl-2 transition-all group">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Blog
                </Link>

                <div className="space-y-8 mb-12">
                    <div className="flex items-center gap-6 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-accent" />
                            {new Date(post.created_at).toLocaleDateString("pt-BR", {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-accent" />
                            Escrito por Valteir
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                        {post.titulo}
                    </h1>

                    <p className="text-xl text-zinc-400 font-light leading-relaxed italic">
                        {post.resumo}
                    </p>
                </div>

                {/* Imagem de Capa */}
                {post.imagem_capa && (
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 mb-16 shadow-2xl">
                        <Image
                            src={post.imagem_capa}
                            alt={post.titulo}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Conteúdo */}
                <div className="prose prose-invert prose-zinc max-w-none prose-h2:font-serif prose-h2:text-3xl prose-p:text-zinc-400 prose-p:text-lg prose-p:leading-relaxed">
                    {post.conteudo?.split('\n').map((paragraph: string, i: number) => (
                        paragraph.trim() === "" ? <br key={i} /> : <p key={i}>{paragraph}</p>
                    ))}
                </div>

                {/* Footer do Artigo */}
                <div className="mt-24 pt-12 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent p-0.5">
                            <Image src="/images/IMG_5740-Editar.jpg" alt="Valteir" width={64} height={64} className="rounded-full object-cover aspect-square" />
                        </div>
                        <div>
                            <p className="text-white font-bold uppercase text-[10px] tracking-widest">Sobre o Autor</p>
                            <h4 className="text-lg font-serif text-white">Valteir Imobiliária</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="rounded-full border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 group">
                            <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> Compartilhar
                        </Button>
                        <Button className="rounded-full bg-accent hover:bg-white text-primary font-bold uppercase text-xs tracking-widest px-8 h-12">
                            Falar com Especialista
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
import { Imovel } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InteractiveBentoGallery, { MediaItemType } from "@/components/ui/interactive-bento-gallery";
import {
    BedDouble,
    Bath,
    Square,
    MapPin,
    Share2,
    Heart,
    CheckCircle2,
    Car
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import ContactForm from "@/components/sections/ContactForm";
import { toast } from "sonner";

// Span patterns for bento grid layout based on image count
const SPAN_PATTERNS: Record<number, string[]> = {
    1: ["col-span-2 sm:col-span-3 md:col-span-4 row-span-4"],
    2: [
        "col-span-2 md:col-span-2 row-span-3",
        "col-span-2 md:col-span-2 row-span-3",
    ],
    3: [
        "col-span-2 md:col-span-2 row-span-3",
        "col-span-1 md:col-span-1 row-span-3",
        "col-span-1 md:col-span-1 row-span-3",
    ],
    4: [
        "col-span-2 md:col-span-2 row-span-3",
        "col-span-1 md:col-span-1 row-span-2",
        "col-span-1 md:col-span-1 row-span-2",
        "col-span-2 md:col-span-2 row-span-2",
    ],
    5: [
        "col-span-2 md:col-span-2 row-span-3",
        "col-span-1 md:col-span-1 row-span-2",
        "col-span-1 md:col-span-1 row-span-2",
        "col-span-1 md:col-span-1 row-span-2",
        "col-span-1 md:col-span-1 row-span-2",
    ],
};

function getDefaultSpans(total: number): string[] {
    if (SPAN_PATTERNS[total]) return SPAN_PATTERNS[total];
    // Fallback for 6+ items: first big, rest alternate
    const spans: string[] = [
        "col-span-2 md:col-span-2 row-span-3",
    ];
    for (let i = 1; i < total; i++) {
        spans.push(
            i % 3 === 0
                ? "col-span-2 md:col-span-2 row-span-2"
                : "col-span-1 md:col-span-1 row-span-2"
        );
    }
    return spans;
}

export default function PropertyDetailPage() {
    const { slug } = useParams();
    const [property, setProperty] = useState<Imovel | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (property) {
            try {
                const favorites = JSON.parse(localStorage.getItem("@valteir:favorites") || "[]");
                setIsFavorite(favorites.includes(property.id));
            } catch (e) {
                console.error("Erro ao ler favoritos", e);
            }
        }
    }, [property]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copiado para a área de transferência!");
        } catch (err) {
            toast.error("Não foi possível copiar o link.");
        }
    };

    const toggleFavorite = () => {
        if (!property) return;
        try {
            const favorites = JSON.parse(localStorage.getItem("@valteir:favorites") || "[]");
            let newFavorites;
            if (isFavorite) {
                newFavorites = favorites.filter((id: string) => id !== property.id);
                toast.success("Imóvel removido dos favoritos!");
            } else {
                newFavorites = [...favorites, property.id];
                toast.success("Imóvel adicionado aos favoritos!");
            }
            localStorage.setItem("@valteir:favorites", JSON.stringify(newFavorites));
            setIsFavorite(!isFavorite);
        } catch (e) {
            toast.error("Erro ao salvar favorito.");
        }
    };

    useEffect(() => {
        async function fetchProperty() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("imoveis")
                    .select("*")
                    .eq("slug", slug)
                    .maybeSingle();

                if (data) {
                    setProperty(data as Imovel);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProperty();
    }, [slug]);

    // Convert property images + video to MediaItemType[]
    const mediaItems = useMemo<MediaItemType[]>(() => {
        if (!property) return [];

        const items: MediaItemType[] = [];
        const allImages = property.imagens || [];
        const totalMedia = allImages.length + (property.video_url ? 1 : 0);
        const spans = getDefaultSpans(totalMedia);

        allImages.forEach((url, idx) => {
            items.push({
                id: idx + 1,
                type: "image",
                title: idx === 0 ? property.titulo : `Vista ${idx + 1}`,
                desc: idx === 0
                    ? `${property.bairro}, ${property.cidade}`
                    : `${property.titulo} — Foto ${idx + 1}`,
                url,
                span: spans[idx] || "col-span-1 row-span-2",
            });
        });

        if (property.video_url) {
            items.push({
                id: allImages.length + 1,
                type: "video",
                title: "Tour Virtual",
                desc: `Apresentação exclusiva — ${property.titulo}`,
                url: property.video_url,
                span: spans[allImages.length] || "col-span-2 row-span-2",
            });
        }

        return items;
    }, [property]);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary pt-32 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-luxury animate-pulse">Carregando detalhes exclusivos...</p>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-primary pt-32 text-center text-white px-4">
                <h1 className="text-4xl font-serif mb-4">Imóvel não encontrado</h1>
                <Link href="/imoveis" className="text-accent hover:underline block mb-8">Voltar para a listagem</Link>
            </div>
        );
    }

    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
    }).format(property.preco);

    return (
        <main className="min-h-screen bg-primary pt-24 pb-20">
            {/* Hero com imagem principal */}
            <section className="relative w-full mb-0">
                <div className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
                    <Image
                        src={property.imagens[0] || "/images/properties/placeholder.jpg"}
                        alt={property.titulo}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-black/30" />

                    <div className="absolute bottom-12 left-4 md:left-8 right-4 md:right-8 flex justify-between items-end">
                        <div className="max-w-3xl">
                            <div className="flex gap-2 mb-4">
                                <Badge className="bg-accent text-primary border-none font-bold px-3 py-1 uppercase text-[10px] tracking-widest">
                                    {property.tipo}
                                </Badge>
                                <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-3 py-1 uppercase text-[10px] tracking-widest">
                                    {property.status}
                                </Badge>
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4 leading-tight">
                                {property.titulo}
                            </h1>
                            <div className="flex items-center gap-2 text-zinc-300">
                                <MapPin className="w-4 h-4 text-accent" />
                                <span className="text-sm tracking-wide">{property.endereco} - {property.bairro}, {property.cidade}</span>
                            </div>
                        </div>

                        <div className="hidden md:flex gap-4">
                            <Button variant="outline" onClick={handleShare} className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white/20 transition-all">
                                <Share2 className="w-4 h-4 mr-2" /> Compartilhar
                            </Button>
                            <Button
                                variant="outline"
                                onClick={toggleFavorite}
                                className={`rounded-full border-white/10 transition-all ${isFavorite ? 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 hover:text-accent' : 'bg-white/5 text-white hover:bg-white/20'}`}
                            >
                                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-accent text-accent' : ''}`} />
                                {isFavorite ? 'Favorito' : 'Favoritar'}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento Gallery */}
            {mediaItems.length > 1 && (
                <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                    <InteractiveBentoGallery
                        mediaItems={mediaItems}
                        title="Galeria do Imóvel"
                        description="Arraste e explore todas as fotos"
                    />
                </section>
            )}

            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Coluna Esquerda: Informações */}
                <div className="lg:col-span-2">
                    {/* Features Rápidas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 mb-12">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-muted-luxury">Área Útil</span>
                            <div className="flex items-center gap-2 text-white">
                                <Square className="w-5 h-5 text-accent" />
                                <span className="text-xl font-medium">{property.area_util}m²</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-muted-luxury">Quartos</span>
                            <div className="flex items-center gap-2 text-white">
                                <BedDouble className="w-5 h-5 text-accent" />
                                <span className="text-xl font-medium">{property.quartos}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-muted-luxury">Suítes</span>
                            <div className="flex items-center gap-2 text-white">
                                <Bath className="w-5 h-5 text-accent" />
                                <span className="text-xl font-medium">{property.suites}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-muted-luxury">Vagas</span>
                            <div className="flex items-center gap-2 text-white">
                                <Car className="w-5 h-5 text-accent" />
                                <span className="text-xl font-medium">{property.vagas_garagem}</span>
                            </div>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-serif text-white mb-6 border-l-4 border-accent pl-4">Sobre o Imóvel</h2>
                        <p className="text-muted-luxury leading-relaxed text-lg whitespace-pre-line">
                            {property.descricao || "Um imóvel excepcional que redefine o conceito de luxo e sofisticação."}
                        </p>
                    </div>

                    {/* Seção de Vídeo (iframe YouTube / Vimeo separado) */}
                    {property.video_url && property.video_url.includes("youtube") && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-serif text-white mb-6 border-l-4 border-accent pl-4">Apresentação Exclusiva</h2>
                            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-zinc-800 shadow-2xl group">
                                <iframe
                                    src={property.video_url}
                                    title="Apresentação do Imóvel"
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    {/* Diferenciais (Features) */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-serif text-white mb-6 border-l-4 border-accent pl-4">Diferenciais e Lazer</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {property.features?.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-zinc-300 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
                                    <CheckCircle2 className="w-4 h-4 text-accent" />
                                    <span className="text-sm capitalize">{feature.replace("_", " ")}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coluna Direita: CTA e Preço */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 space-y-6">
                        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
                            <span className="text-[10px] uppercase tracking-widest text-muted-luxury block mb-2">Valor de Investimento</span>
                            <h3 className="text-4xl font-serif text-accent">{formattedPrice}</h3>
                            {property.preco_condominio && (
                                <p className="text-sm text-muted-luxury mt-2">Condomínio: R$ {property.preco_condominio}/mês</p>
                            )}
                        </div>

                        <ContactForm imovelId={property.id} imovelTitulo={property.titulo} />

                        <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-3xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                                    <h4 className="text-accent font-serif font-bold text-lg">AV</h4>
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-medium">Arthur Valteir</h4>
                                    <p className="text-[10px] text-accent uppercase tracking-wider font-bold">Corretor de Luxo</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-luxury italic">"Minha missão é encontrar não apenas uma casa, mas o cenário perfeito para a sua nova história."</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

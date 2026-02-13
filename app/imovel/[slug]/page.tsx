"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Imovel } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BedDouble,
    Bath,
    Square,
    MapPin,
    Calendar,
    Share2,
    Heart,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Car
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import ContactForm from "@/components/sections/ContactForm";

export default function PropertyDetailPage() {
    const { slug } = useParams();
    const [property, setProperty] = useState<Imovel | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const supabase = createClient();

    const [errorMsg, setErrorMsg] = useState<any>(null);

    useEffect(() => {
        async function fetchProperty() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("imoveis")
                    .select("*")
                    .eq("slug", slug)
                    .maybeSingle();

                if (error) {
                    setErrorMsg(error);
                    console.error("Supabase Error:", error);
                } else if (data) {
                    setProperty(data as Imovel);
                } else {
                    setErrorMsg({ message: "Dado retornado é nulo/vazio para este slug" });
                }
            } catch (err) {
                setErrorMsg(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProperty();
    }, [slug, supabase]);

    if (loading) {
        return <div className="min-h-screen bg-primary pt-32 flex items-center justify-center text-white">Carregando detalhes...</div>;
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-primary pt-32 text-center text-white px-4">
                <h1 className="text-4xl font-serif mb-4">Imóvel não encontrado</h1>
                <Link href="/imoveis" className="text-accent hover:underline block mb-8">Voltar para a listagem</Link>

                <div className="max-w-2xl mx-auto p-6 bg-red-950/40 border border-red-500/50 rounded-2xl text-left shadow-2xl">
                    <h2 className="text-red-400 font-bold mb-4 uppercase tracking-tighter">🚨 DEBUG DE SISTEMA (LEVEL: CRITICAL)</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-mono">
                        <div className="space-y-2">
                            <p className="text-zinc-400">URL SUPA: <span className="text-white">{process.env.NEXT_PUBLIC_SUPABASE_URL || "NÃO DEFINIDA"}</span></p>
                            <p className="text-zinc-400">SLUG BUSCADO: <span className="text-yellow-400">{slug}</span></p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-zinc-400">ANON KEY: <span className="text-white">{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "PRESENTE (OK)" : "AUSENTE (ERRO)"}</span></p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-black/40 rounded border border-white/5">
                        <p className="text-xs text-red-300 mb-2 font-bold">ERRO BRUTO DO SUPABASE:</p>
                        <pre className="text-[10px] text-white overflow-auto max-h-40 whitespace-pre-wrap">
                            {JSON.stringify(errorMsg, null, 2)}
                        </pre>
                    </div>

                    <div className="mt-6">
                        <p className="text-xs text-blue-300 mb-2 font-bold">ORIENTAÇÃO:</p>
                        <ul className="text-[10px] text-zinc-300 space-y-2">
                            <li>• Se a URL terminar em **'hyhe'**, seu VS Code ainda está usando o projeto antigo.</li>
                            <li>• Se o erro for **'PGRST204'**, a tabela `imoveis` não foi encontrada nesse projeto.</li>
                            <li>• Se o erro for **'PGRST116'**, o filtro não retornou nada.</li>
                            <li>• Se o erro for **'vazio'**, as permissões RLS podem estar bloqueando o acesso público.</li>
                        </ul>
                    </div>
                </div>
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
            {/* Galeria de Imagens Cinematográfica */}
            <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden mb-12">
                <Image
                    src={property.imagens[activeImage] || "/images/properties/placeholder.jpg"}
                    alt={property.titulo}
                    fill
                    className="object-cover transition-all duration-1000"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30" />

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
                        <Button variant="outline" className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white/20">
                            <Share2 className="w-4 h-4 mr-2" /> Compartilhar
                        </Button>
                        <Button variant="outline" className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white/20">
                            <Heart className="w-4 h-4 mr-2" /> Favoritar
                        </Button>
                    </div>
                </div>
            </section>

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
                        <h2 className="text-2xl font-serif text-white mb-6">Sobre o Imóvel</h2>
                        <p className="text-muted-luxury leading-relaxed text-lg whitespace-pre-line">
                            {property.descricao || "Um imóvel excepcional que redefine o conceito de luxo e sofisticação."}
                        </p>
                    </div>

                    {/* Diferenciais (Features) */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-serif text-white mb-6">Diferenciais e Lazer</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {property.features?.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-zinc-300">
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
                        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
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
                                    <h4 className="text-accent font-serif font-bold">AV</h4>
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

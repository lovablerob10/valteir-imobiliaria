"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageSquare, Award, ShieldCheck, Target } from "lucide-react";

export default function AboutValteir() {
    return (
        <section className="py-24 px-4 md:px-8 bg-zinc-950 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Imagem com Scroll Reveal Effect */}
                    <div className="relative aspect-[4/5] group">
                        <div className="absolute -inset-4 bg-accent/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                            <Image
                                src="/images/IMG_5740-Editar.jpg"
                                alt="Valteir - Consultor Imobiliário de Luxo"
                                fill
                                className="object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                        </div>

                        {/* Selo de Experiência */}
                        <div className="absolute -bottom-6 -right-6 bg-accent p-8 rounded-2xl shadow-2xl hidden md:block">
                            <p className="text-primary font-serif font-black text-4xl leading-none">15+</p>
                            <p className="text-primary text-[10px] uppercase font-bold tracking-widest mt-2 leading-tight">Anos de <br />Experiência</p>
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <span className="text-accent text-xs font-medium tracking-[0.4em] uppercase block">
                                Autoridade no Mercado
                            </span>
                            <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                                Sobre <span className="text-accent italic">Valteir</span>
                            </h2>
                        </div>

                        <p className="text-muted-luxury text-lg leading-relaxed">
                            Com mais de 15 anos de atuação dedicada ao mercado de alto padrão em São Paulo e região, Valteir consolidou-se como uma referência em consultoria técnica e imobiliária.
                            Sua abordagem transcende a simples transação: trata-se de uma curadoria minuciosa, onde cada detalhe é analisado sob a ótica da exclusividade e do potencial de investimento.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                                    <Award className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">Expertise Técnica</h4>
                                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Profundo conhecimento em engenharia e viabilidade para garantir segurança total.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">Discrição & Sigilo</h4>
                                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Atendimento personalizado focado na privacidade absoluta dos nossos clientes.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button
                                className="h-16 px-10 bg-accent hover:bg-white text-primary font-bold tracking-[0.2em] uppercase rounded-xl transition-all group lg:w-auto w-full"
                                onClick={() => window.open('https://wa.me/5517991726078', '_blank')}
                            >
                                <MessageSquare className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                                Fale com Valteir
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

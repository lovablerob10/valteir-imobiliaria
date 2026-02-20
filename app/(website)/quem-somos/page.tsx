"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    CheckCircle2,
    Award,
    ShieldCheck,
    History,
    TrendingUp,
    ArrowRight,
    Users,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const values = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-accent" />,
        title: "Transparência Total",
        description: "Cada etapa da negociação é pautada pela clareza absoluta, garantindo que você tome decisões com total segurança e conhecimento."
    },
    {
        icon: <Award className="w-8 h-8 text-accent" />,
        title: "Excelência Técnica",
        description: "Avaliações precisas baseadas em normas ABNT e análises de mercado profundas para garantir o melhor valor de investimento."
    },
    {
        icon: <Zap className="w-8 h-8 text-accent" />,
        title: "Confiança e Agilidade",
        description: "Simulação de crédito e assessoria jurídica integrada para que o processo de aquisição seja fluido, rápido e livre de burocracias."
    }
];

export default function QuemSomosPage() {
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Hero Parallax (Depth Effect)
            gsap.to(".hero-bg", {
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                },
                y: 200,
                scale: 1.15,
                ease: "none"
            });

            gsap.to(".hero-content", {
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                },
                y: -150,
                opacity: 0,
                ease: "none"
            });

            // 2. Pinned Storytelling Section
            const storyTrigger = ScrollTrigger.create({
                trigger: ".story-section",
                start: "top top",
                end: "+=150%",
                pin: true,
                pinSpacing: true
            });

            // Story Text Reveal Sequence
            gsap.from(".story-reveal-1", {
                scrollTrigger: {
                    trigger: ".story-section",
                    start: "top 10%",
                    end: "top -20%",
                    scrub: 1
                },
                y: 100,
                opacity: 0
            });

            gsap.from(".story-reveal-2", {
                scrollTrigger: {
                    trigger: ".story-section",
                    start: "top -60%",
                    end: "top -120%",
                    scrub: 1
                },
                y: 100,
                opacity: 0
            });

            // 3. Floating Value Cards (Independent Parallax)
            gsap.utils.toArray(".value-card").forEach((card: any, i) => {
                const speed = 40 * (i + 1);
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: ".values-section",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    },
                    y: -speed,
                    ease: "none"
                });
            });

            // 4. Image Mask Reveal
            gsap.from(".reveal-mask", {
                scrollTrigger: {
                    trigger: ".reveal-section",
                    start: "top 80%",
                    end: "top 20%",
                    scrub: 1
                },
                clipPath: "inset(0% 100% 0% 0%)",
                ease: "power2.inOut"
            });

        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={mainRef} className="bg-zinc-950 text-white overflow-x-hidden">
            {/* Hero Section Surreal */}
            <section className="hero-section relative h-screen flex items-center px-4 md:px-8 overflow-hidden pt-20">
                <div className="hero-bg absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
                        alt="Background Luxo"
                        fill
                        className="object-cover opacity-40 grayscale brightness-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
                </div>

                <div className="max-w-7xl mx-auto w-full relative z-10 hero-content text-center">
                    <div className="inline-block overflow-hidden mb-6">
                        <span className="text-accent text-sm font-medium tracking-[0.6em] uppercase block hover:tracking-[0.8em] transition-all duration-700">
                            Valteir Imobiliária
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif leading-none mb-10">
                        Onde o <span className="text-accent italic">Impossível</span> <br />
                        se torna <span className="border-b-2 border-accent/30 pb-2">Endereço.</span>
                    </h1>
                    <div className="flex justify-center gap-8 mt-12">
                        <div className="h-[1px] w-24 bg-accent/30 self-center" />
                        <p className="text-zinc-400 text-sm uppercase tracking-[0.3em]">Exclusividade Valteir de Oliveira</p>
                        <div className="h-[1px] w-24 bg-accent/30 self-center" />
                    </div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                    <div className="w-[1px] h-12 bg-accent/50" />
                </div>
            </section>

            {/* Pinned Storytelling Section */}
            <section className="story-section relative min-h-screen bg-zinc-950 flex items-center py-20 pb-40">
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-start w-full">
                    <div className="relative aspect-[3/4] rounded-sm overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 top-0 lg:mt-32">
                        <Image
                            src="/images/IMG_5643-Editar-Editar.jpg"
                            alt="Valteir de Oliveira - Fundador"
                            fill
                            className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000 scale-100"
                            onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200";
                                e.currentTarget.srcset = ""; // Disable srcset to force fallback
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black via-black/80 to-transparent">
                            <p className="text-accent text-[10px] uppercase tracking-[0.4em] mb-2 font-bold">Fundador & Visionário</p>
                            <h3 className="text-white text-3xl font-serif">Valteir de Oliveira</h3>
                        </div>
                    </div>

                    <div className="space-y-48 lg:pl-12 lg:mt-32">
                        <div className="story-reveal-1">
                            <span className="text-accent/50 text-xs font-bold tracking-[0.3em] uppercase mb-4 block">O Início de um Legado</span>
                            <h2 className="text-5xl font-serif mb-8 text-white leading-tight">Da Engenharia à <br /><span className="text-accent italic">Consultoria de Elite.</span></h2>
                            <p className="text-zinc-400 text-xl leading-relaxed font-light">
                                Fundada em 2023, a **Valteir Imobiliária** é o reflexo da visão de seu fundador sobre o mercado de São José do Rio Preto. Valteir traz consigo um diferencial raro: a capacidade de ler a estrutura física e financeira de um imóvel com precisão técnica.
                            </p>
                            <p className="text-zinc-500 text-lg leading-relaxed mt-6">
                                Com raízes no canteiro de obras e na gestão de ativos, ele transformou o ato de comprar um imóvel em uma jornada de segurança e transparência absoluta.
                            </p>

                            {/* Novo bloco de texto solicitado pelo usuário */}
                            <div className="mt-12 space-y-6 border-l border-accent/20 pl-8">
                                <p className="text-zinc-400 text-lg leading-relaxed italic">
                                    "Minha missão nunca foi apenas fechar negócios, mas garantir que cada patrimônio adquirido sob minha consultoria seja um ativo de valor perpétuo para as próximas gerações."
                                </p>
                                <p className="text-zinc-500 text-md leading-relaxed leading-extra-relaxed font-light">
                                    A curadoria de Valteir é rigorosa. Ele seleciona pessoalmente cada propriedade, avaliando não apenas a estética, mas a procedência jurídica, a solidez estrutural e o potencial real de valorização. É essa ética inegociável que transformou seu nome em sinônimo de confiança no setor de alto padrão.
                                </p>
                                <div className="flex gap-4 pt-4">
                                    <div className="flex items-center gap-2 text-accent/60">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-[10px] uppercase tracking-[0.2em]">Valorização</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-accent/60">
                                        <Zap className="w-4 h-4" />
                                        <span className="text-[10px] uppercase tracking-[0.2em]">Agilidade</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-accent/60">
                                        <Award className="w-4 h-4" />
                                        <span className="text-[10px] uppercase tracking-[0.2em]">Excelência</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="story-reveal-2">
                            <h3 className="text-3xl font-serif mb-6 text-zinc-300">Missão: Tranquilidade Absoluta.</h3>
                            <p className="text-zinc-400 text-xl leading-relaxed font-light">
                                Facilitamos a aquisição do patrimônio dos seus sonhos com a clareza que só quem conhece o mercado de alto padrão pode oferecer. Nossa história é escrita com cada aperto de mão e cada sonho realizado com sucesso.
                            </p>
                            <div className="mt-12 flex items-center gap-6">
                                <div className="h-[1px] flex-1 bg-accent/20" />
                                <Award className="text-accent w-6 h-6 animate-pulse" />
                                <div className="h-[1px] flex-1 bg-accent/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Values Section with Glassmorphism */}
            <section className="values-section py-40 px-4 md:px-8 relative bg-zinc-950">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto">
                    <div className="mb-24 text-center">
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">Os Contrastes do <span className="text-accent">Sucesso</span></h2>
                        <p className="text-zinc-500 uppercase tracking-widest text-xs">Valores que sustentam um império</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Rigor", text: "Normas ABNT aplicadas em cada avaliação, garantindo precisão matemática no seu investimento." },
                            { title: "Visão", text: "Identificamos tendências de valorização antes que elas se tornem notícia." },
                            { title: "Discrição", text: "Tranquilidade absoluta. Suas negociações são tratadas com o sigilo que o seu patrimônio exige." }
                        ].map((v, i) => (
                            <div key={i} className="value-card bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-12 h-80 flex flex-col justify-end group hover:bg-zinc-800/60 transition-all cursor-default">
                                <span className="text-accent text-5xl font-serif mb-6 opacity-20 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                                <h4 className="text-2xl font-serif text-white mb-4">{v.title}</h4>
                                <p className="text-zinc-500 text-sm leading-relaxed">{v.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reveal Image Mask Section */}
            <section className="reveal-section relative h-[80vh] bg-zinc-950 overflow-hidden">
                <div className="reveal-mask absolute inset-0 z-10">
                    <Image
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000"
                        alt="Arquitetura"
                        fill
                        className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-zinc-950/40" />
                </div>
                <div className="relative z-20 flex items-center justify-center h-full px-4">
                    <div className="text-center p-12 md:p-20 bg-black/60 backdrop-blur-[40px] border border-white/10 rounded-sm max-w-4xl shadow-2xl relative overflow-hidden group">
                        {/* Efeito de brilho interno para simular vidro fumê premium */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-serif mb-8 italic text-accent leading-tight">
                                "O luxo é o resultado de mil pequenos detalhes executados com perfeição."
                            </h2>
                            <div className="w-24 h-[1px] bg-accent/40 mx-auto mb-8" />
                            <p className="text-zinc-400 uppercase tracking-[0.4em] text-xs font-bold">Valteir de Oliveira</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Surreal */}
            <section className="py-40 px-4 md:px-8 bg-zinc-950 text-center relative">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-6xl md:text-8xl font-serif mb-12 tracking-tighter">Eleve sua <br /><span className="text-accent">Perspectiva.</span></h2>
                    <p className="text-zinc-400 text-xl mb-16 leading-relaxed">
                        Permita que Valteir de Oliveira guie sua próxima conquista. Uma consultoria que transcende a venda.
                    </p>
                    <Link href="/contato">
                        <Button className="bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-primary transition-all rounded-none px-16 h-20 font-serif italic text-2xl group">
                            Agendar Consultoria Exclusiva
                            <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}

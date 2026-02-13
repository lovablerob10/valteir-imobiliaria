"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function HeroDoorway() {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftDoorRef = useRef<HTMLDivElement>(null);
    const rightDoorRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=200%",
                    pin: true,
                    scrub: 1,
                },
            });

            tl.to(leftDoorRef.current, {
                xPercent: -100,
                ease: "power2.inOut",
            }, 0)
                .to(rightDoorRef.current, {
                    xPercent: 100,
                    ease: "power2.inOut",
                }, 0)
                .to(contentRef.current, {
                    scale: 1.1,
                    opacity: 0,
                    ease: "none",
                }, 0);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-primary">
            {/* Camada 1: Interior (Fundo) */}
            <div className="absolute inset-0 z-0 bg-zinc-900">
                <Image
                    src="/images/hero/interior-mansion.jpg"
                    alt="Interior da Mansão"
                    fill
                    className="object-cover opacity-60"
                    priority
                    onError={(e) => {
                        (e.target as any).style.display = "none";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
            </div>

            {/* Camada 2: Portas (Meio) */}
            <div className="absolute inset-0 z-20 flex w-full">
                <div
                    ref={leftDoorRef}
                    className="relative h-full w-1/2 border-r border-accent/30 bg-zinc-900/90 shadow-2xl"
                >
                    <Image
                        src="/images/hero/door-left.jpg"
                        alt="Porta Esquerda"
                        fill
                        className="object-cover"
                        onError={(e) => {
                            (e.target as any).style.display = "none";
                        }}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 h-24 w-1 rounded-full bg-accent/40 shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
                </div>
                <div
                    ref={rightDoorRef}
                    className="relative h-full w-1/2 border-l border-accent/30 bg-zinc-900/90 shadow-2xl"
                >
                    <Image
                        src="/images/hero/door-right.jpg"
                        alt="Porta Direita"
                        fill
                        className="object-cover"
                        onError={(e) => {
                            (e.target as any).style.display = "none";
                        }}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 h-24 w-1 rounded-full bg-accent/40 shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
                </div>
            </div>

            {/* Camada 3: Texto (Frente) */}
            <div
                ref={contentRef}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center pointer-events-none"
            >
                <span className="mb-4 text-xs font-medium tracking-[0.5em] text-accent uppercase animate-fade-in opacity-80">
                    Valteir Imobiliária
                </span>
                <h1 className="max-w-5xl text-5xl md:text-7xl lg:text-9xl font-serif text-white leading-[1.1]">
                    Abra a porta para o seu <br />
                    <span className="text-accent italic">novo destino</span>
                </h1>
                <div className="mt-16 flex flex-col items-center gap-4">
                    <div className="h-24 w-[1px] bg-gradient-to-b from-accent to-transparent" />
                    <span className="text-[10px] tracking-[0.4em] text-accent/60 uppercase">Role para abrir</span>
                </div>
            </div>
        </section>
    );
}

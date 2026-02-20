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
    const sloganRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=250%",
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                },
            });

            // Opening doors - synced animation
            tl.to(leftDoorRef.current, {
                xPercent: -100,
                ease: "power2.inOut",
            }, 0);

            tl.to(rightDoorRef.current, {
                xPercent: 100,
                ease: "power2.inOut",
            }, 0);

            // Revealing background and slogan simultaneously as doors split
            tl.to(bgRef.current, {
                scale: 1.05,
                filter: "brightness(0.7)",
                ease: "power1.out",
            }, 0);

            tl.fromTo(sloganRef.current,
                { opacity: 0, scale: 0.9, y: 15 },
                { opacity: 1, scale: 1, y: 0, ease: "power2.out", duration: 1 },
                0.05 // Starts almost immediately
            );

            // Deepen focus at the bottom of the section
            tl.to(bgRef.current, {
                filter: "brightness(0.3)",
                ease: "none"
            }, ">0.5");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-[100vh] w-full overflow-hidden bg-black">
            {/* 1. Main Background Image (Behind) - z-10 */}
            <div ref={bgRef} className="absolute inset-0 z-10">
                <Image
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000"
                    alt="Mansão de Luxo"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* 2. Slogan - In the middle - z-20 */}
            <div
                ref={sloganRef}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center pointer-events-none"
            >
                <div className="flex flex-col items-center gap-2 mb-8">
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.8em] text-accent uppercase opacity-70 mb-2">
                        Valteir Imobiliária
                    </span>
                    <div className="h-[1px] w-20 bg-accent/30" />
                </div>

                <div className="flex flex-col items-center">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-white/90 tracking-tight mb-2">
                        Abra a porta para
                    </h2>

                    <div className="flex items-center gap-6 my-4">
                        <div className="h-[1px] w-12 md:w-20 bg-white/10" />
                        <span className="text-xl md:text-3xl text-accent italic font-serif opacity-90">o seu</span>
                        <div className="h-[1px] w-12 md:w-20 bg-white/10" />
                    </div>

                    <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-serif text-white leading-none tracking-tighter drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]">
                        novo <span className="text-accent italic">destino</span>
                    </h1>
                </div>

                <div className="mt-20 flex flex-col items-center gap-6 opacity-30">
                    <div className="h-24 w-[1px] bg-gradient-to-b from-accent to-transparent" />
                </div>
            </div>

            {/* 3. The Doors (In Front) - z-30 */}
            <div className="absolute inset-0 z-30 flex pointer-events-none">
                {/* Left Door */}
                <div
                    ref={leftDoorRef}
                    className="relative w-1/2 h-full bg-[#0a0a0a] backdrop-blur-3xl border-r border-white/10 flex justify-end items-center"
                >
                    {/* Glass visual effect shadow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/[0.02]" />
                    {/* Handle decoration */}
                    <div className="w-[1px] h-40 bg-white/20 mr-0 z-40" />
                </div>

                {/* Right Door */}
                <div
                    ref={rightDoorRef}
                    className="relative w-1/2 h-full bg-[#0a0a0a] backdrop-blur-3xl border-l border-white/10 flex justify-start items-center"
                >
                    {/* Glass visual effect shadow */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/[0.02]" />
                    {/* Handle decoration */}
                    <div className="w-[1px] h-40 bg-white/20 ml-0 z-40" />
                </div>
            </div>

            {/* Top/Bottom Frames */}
            <div className="absolute top-0 left-0 w-full h-12 bg-black/40 z-40" />
            <div className="absolute bottom-0 left-0 w-full h-12 bg-black/40 z-40" />
        </section>
    );
}

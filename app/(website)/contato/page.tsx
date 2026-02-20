"use client";

import { useEffect, useRef } from "react";
import { Mail, Phone, MapPin, MessageSquare, Clock } from "lucide-react";
import { gsap } from "gsap";
import ContactForm from "@/components/sections/ContactForm";

export default function ContactPage() {
    const mainRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".contact-reveal", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });

            gsap.to(".map-container", {
                scale: 1,
                opacity: 1,
                duration: 1,
                delay: 0.5,
                ease: "power2.out"
            });
        }, mainRef);

        return () => ctx.revert();
    }, []);

    const contactDetails = [
        {
            icon: <MapPin className="w-6 h-6 text-accent" />,
            title: "Endereço",
            value: "Av. Dr. Alberto Andaló, 3942, Vila Redentora",
            sub: "São José do Rio Preto - SP"
        },
        {
            icon: <Phone className="w-6 h-6 text-accent" />,
            title: "WhatsApp / Telefone",
            value: "(17) 99172-6078",
            sub: "Atendimento imediato via WhatsApp",
            href: "https://wa.me/5517991726078"
        },
        {
            icon: <Clock className="w-6 h-6 text-accent" />,
            title: "Horário de Atendimento",
            value: "Segunda a Sábado",
            sub: "Das 07h00 às 23h00"
        }
    ];

    return (
        <main ref={mainRef} className="bg-zinc-950 text-white pt-32 pb-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4 contact-reveal opacity-0">
                    <span className="text-accent text-xs font-bold tracking-[0.4em] uppercase">Contato Exclusivo</span>
                    <h1 className="text-5xl md:text-7xl font-serif">Vamos <span className="text-accent italic">Conversar</span>?</h1>
                    <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Estamos à disposição para oferecer a melhor consultoria técnica e imobiliária da região. Entre em contato por qualquer um dos nossos canais.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Informações de Contato */}
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                            {contactDetails.map((detail, idx) => (
                                <div key={idx} className="contact-reveal opacity-0 translate-y-8 group p-8 bg-zinc-900/90 border border-zinc-800/50 rounded-2xl hover:border-accent/30 transition-colors duration-500">
                                    <div className="flex items-start gap-6">
                                        <div className="p-4 bg-zinc-800/50 rounded-xl group-hover:scale-110 transition-transform duration-500 border border-white/5">
                                            {detail.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-accent/70 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">{detail.title}</h3>
                                            {detail.href ? (
                                                <a href={detail.href} target="_blank" rel="noopener noreferrer" className="text-xl md:text-2xl font-serif text-white hover:text-accent transition-colors">
                                                    {detail.value}
                                                </a>
                                            ) : (
                                                <p className="text-xl md:text-2xl font-serif text-white">{detail.value}</p>
                                            )}
                                            <p className="text-zinc-400 text-sm mt-1">{detail.sub}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mapa Container */}
                        <div className="map-container opacity-0 scale-95 relative aspect-video rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
                            <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center -z-10">
                                <span className="text-zinc-800 animate-pulse uppercase tracking-widest text-xs">Carregando Mapa...</span>
                            </div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.3228694420042!2d-49.387532!3d-20.816654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94bdad7c7f42c2af%3A0xc3f1f7ca5e49bb42!2sAv.%20Alberto%20Andal%C3%B3%2C%203942%20-%20Vila%20Redentora%2C%20S%C3%A3o%20Jos%C3%A9%20do%20Rio%20Preto%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1707694452145!5m2!1spt-BR!2sbr"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 bg-zinc-950"
                            ></iframe>
                        </div>
                    </div>

                    {/* Formulário */}
                    <div className="sticky top-24">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </main>
    );
}

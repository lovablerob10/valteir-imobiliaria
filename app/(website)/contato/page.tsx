"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { gsap } from "gsap";
import ContactForm from "@/components/sections/ContactForm";
import { createClient } from "@/lib/supabase/client";

interface SiteConfig {
    endereco: string | null;
    whatsapp: string | null;
    email: string | null;
    horario_funcionamento: string | null;
}

export default function ContactPage() {
    const mainRef = useRef(null);
    const [config, setConfig] = useState<SiteConfig | null>(null);

    useEffect(() => {
        async function fetchConfig() {
            const supabase = createClient();
            const { data } = await supabase
                .from("configuracoes")
                .select("endereco, whatsapp, email, horario_funcionamento")
                .eq("id", 1)
                .single();
            setConfig(data);
        }
        fetchConfig();
    }, []);

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
    }, [config]);

    // Dados dinâmicos — puxa do banco, com fallback
    const enderecoRaw = config?.endereco || "Endereço não informado";
    const whatsappRaw = config?.whatsapp || "(17) 99999-9999";
    const whatsappClean = whatsappRaw.replace(/\D/g, "");
    const horario = config?.horario_funcionamento || "Seg-Sex: 9h às 18h | Sáb: 9h às 13h";
    
    const whatsappFormatted = whatsappClean.length === 11 
        ? `(${whatsappClean.substring(0, 2)}) ${whatsappClean.substring(2, 7)}-${whatsappClean.substring(7, 11)}`
        : whatsappClean.length === 10
            ? `(${whatsappClean.substring(0, 2)}) ${whatsappClean.substring(2, 6)}-${whatsappClean.substring(6, 10)}`
            : whatsappRaw;

    const contactDetails = [
        {
            icon: <MapPin className="w-6 h-6 text-accent" />,
            title: "Endereço",
            value: enderecoRaw,
            sub: "",
        },
        {
            icon: <Phone className="w-6 h-6 text-accent" />,
            title: "WhatsApp / Telefone",
            value: whatsappFormatted,
            sub: "Atendimento imediato via WhatsApp",
            href: `https://wa.me/55${whatsappClean}`,
        },
        {
            icon: <Clock className="w-6 h-6 text-accent" />,
            title: "Horário de Atendimento",
            value: horario,
            sub: "",
        },
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
                                            {detail.sub && <p className="text-zinc-400 text-sm mt-1">{detail.sub}</p>}
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
                                src="https://maps.google.com/maps?q=Avenida%20An%C3%ADsio%20Haddad,%208001,%20S%C3%A3o%20Jos%C3%A9%20do%20Rio%20Preto&t=&z=15&ie=UTF8&iwloc=&output=embed"
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Início", href: "/" },
        { name: "Imóveis", href: "/imoveis" },
        { name: "Quem Somos", href: "/quem-somos" },
        { name: "Contato", href: "/contato" },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-zinc-950/80 backdrop-blur-md py-4 border-b border-zinc-800/50" : "bg-transparent py-8"
            }`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="group">
                    <span className="text-2xl md:text-3xl font-serif text-white tracking-tighter flex items-center">
                        VALTEIR<span className="text-accent group-hover:animate-pulse">.</span>IMOB
                    </span>
                </Link>

                {/* Menu Desktop */}
                <div className="hidden md:flex items-center gap-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-[13.5px] font-bold tracking-[0.3em] uppercase transition-all hover:text-accent ${pathname === link.href ? "text-accent" : "text-zinc-300"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/contato"
                        className="flex items-center gap-2 bg-accent/10 border border-accent/20 px-5 py-2.5 rounded-xl text-accent text-[13.5px] font-bold tracking-widest uppercase hover:bg-accent hover:text-primary transition-all"
                    >
                        <Phone className="w-3.5 h-3.5" />
                        Agendar Visita
                    </Link>
                </div>

                {/* Botão Mobile */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Menu Mobile Fullscreen */}
            <div className={`fixed inset-0 bg-zinc-950 z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                }`}>
                <ul className="flex flex-col items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-4xl font-serif text-white hover:text-accent transition-colors"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mt-16 h-20 w-[1px] bg-accent/30" />
            </div>
        </nav>
    );
}

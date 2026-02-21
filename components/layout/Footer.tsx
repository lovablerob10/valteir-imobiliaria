import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Footer() {
    const supabase = await createClient();
    const { data: config } = await supabase.from('configuracoes').select('*').eq('id', 1).single();

    const imobName = config?.nome_imobiliaria || "VALTEIR IMÓVEIS";
    const nameParts = imobName.split(' ');
    const firstName = nameParts[0];
    const restName = nameParts.slice(1).join(' ');

    return (
        <footer className="bg-zinc-950 border-t border-zinc-900 pt-20 pb-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Logo & Bio */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-2xl font-serif text-white tracking-tighter">
                                {firstName}<span className="text-accent">.</span>{restName}
                            </span>
                        </Link>
                        <p className="text-muted-luxury max-w-sm leading-relaxed mb-8">
                            Especialistas em curadoria de imóveis de luxo.
                            Elevando o conceito de morar com exclusividade e sofisticação.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-accent hover:text-primary transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-accent hover:text-primary transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Rápidos */}
                    <div>
                        <h4 className="text-white font-serif text-lg mb-6 tracking-wide">Explore</h4>
                        <ul className="space-y-4">
                            <li><Link href="/imoveis" className="text-muted-luxury hover:text-accent transition-colors">Portfólio Completo</Link></li>
                            <li><Link href="/imoveis?tipo=mansao" className="text-muted-luxury hover:text-accent transition-colors">Mansões Selecionadas</Link></li>
                            <li><Link href="/quem-somos" className="text-muted-luxury hover:text-accent transition-colors">Quem Somos</Link></li>
                            <li><Link href="/contato" className="text-muted-luxury hover:text-accent transition-colors">Falar com Consultor</Link></li>
                        </ul>
                    </div>

                    {/* Contato */}
                    <div>
                        <h4 className="text-white font-serif text-lg mb-6 tracking-wide">Contato</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-accent shrink-0" />
                                <span className="text-muted-luxury text-sm whitespace-pre-line">
                                    {config?.endereco || "Endereço não informado"}
                                </span>
                            </li>
                            {config?.whatsapp && (
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-accent shrink-0" />
                                    <a href={`https://wa.me/55${config.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-luxury text-sm hover:text-accent transition-colors">
                                        {config.whatsapp}
                                    </a>
                                </li>
                            )}
                            {config?.email && (
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-accent shrink-0" />
                                    <a href={`mailto:${config.email}`} className="text-muted-luxury text-sm hover:text-accent transition-colors">
                                        {config.email}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                        © {new Date().getFullYear()} Valteir Imóveis. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/termos" className="text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest">Termos</Link>
                        <Link href="/privacidade" className="text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest">Privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

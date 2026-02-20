"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Perfil } from "@/types/database";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, Phone, Shield, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";

export default function EquipePage() {
    const [equipe, setEquipe] = useState<Perfil[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchEquipe();
    }, []);

    async function fetchEquipe() {
        setLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("role", { ascending: true });

        if (!error) {
            setEquipe(data as Perfil[]);
        }
        setLoading(false);
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-1">Equipe & Corretores</h1>
                    <p className="text-zinc-500 text-sm">Gerencie os acessos e permissões dos consultores da imobiliária.</p>
                </div>
                <Button className="bg-accent text-primary font-bold tracking-widest uppercase text-xs h-12 px-6 rounded-xl hover:bg-white transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <UserPlus className="w-4 h-4 mr-2" /> Convidar Corretor
                </Button>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-900 rounded-3xl overflow-hidden backdrop-blur-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                        <p className="text-zinc-500 font-medium tracking-widest uppercase text-[10px]">Carregando Equipe...</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-zinc-950/50">
                            <TableRow className="border-zinc-900 hover:bg-transparent">
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest py-5 px-6">Nome / Nome de Usuário</TableHead>
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-6">Nível de Acesso</TableHead>
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-6">Contato</TableHead>
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-6 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {equipe.map((membro) => (
                                <TableRow key={membro.user_id} className="border-zinc-900 hover:bg-zinc-800/10 transition-colors">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 overflow-hidden">
                                                {membro.avatar_url ? (
                                                    <img src={membro.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white font-bold">{membro.full_name?.charAt(0) || "U"}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{membro.full_name || "Sem Nome"}</p>
                                                <p className="text-zinc-500 text-xs">{membro.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-2">
                                            {membro.role === 'admin' ? (
                                                <Badge className="bg-accent/10 text-accent border-accent/20 gap-1.5 px-2.5 py-1">
                                                    <ShieldCheck className="w-3 h-3" /> ADMIN
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-zinc-800 text-zinc-400 gap-1.5 px-2.5 py-1">
                                                    <Shield className="w-3 h-3" /> CORRETOR
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                                <Mail className="w-3 h-3 text-zinc-600" /> {membro.email}
                                            </div>
                                            {membro.telefone && (
                                                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                                    <Phone className="w-3 h-3 text-zinc-600" /> {membro.telefone}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <Button variant="ghost" className="text-zinc-500 hover:text-white hover:bg-zinc-800 text-xs px-4">
                                            Editar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}

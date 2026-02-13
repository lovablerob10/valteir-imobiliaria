"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lead } from "@/types/database";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Mail,
    Phone,
    Calendar,
    MessageSquare,
    Loader2,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchLeads();
    }, [supabase]);

    async function fetchLeads() {
        setLoading(true);
        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) {
            setLeads(data as Lead[]);
        }
        setLoading(false);
    }

    async function deleteLead(id: string) {
        if (!confirm("Deseja realmente excluir este lead?")) return;

        const { error } = await supabase.from("leads").delete().eq("id", id);
        if (!error) {
            setLeads(leads.filter(l => l.id !== id));
            toast.success("Lead excluído");
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif text-white mb-1">Gestão de Leads</h1>
                <p className="text-zinc-500 text-sm">Acompanhe as solicitações de contato e visitas.</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-900 rounded-3xl overflow-hidden backdrop-blur-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                        <p className="text-zinc-500 font-medium uppercase text-[10px] tracking-widest">Carregando contatos...</p>
                    </div>
                ) : leads.length > 0 ? (
                    <Table>
                        <TableHeader className="bg-zinc-950/50">
                            <TableRow className="border-zinc-900 hover:bg-transparent">
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest py-5 px-6">Cliente</TableHead>
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-6">Contato</TableHead>
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-6">Data</TableHead>
                                <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-6 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead.id} className="border-zinc-900 hover:bg-zinc-800/10">
                                    <TableCell className="py-5 px-6">
                                        <p className="text-white font-medium">{lead.nome}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[9px] uppercase border-zinc-800 text-zinc-500">
                                                {lead.status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                                <Mail className="w-3 h-3 text-accent" /> {lead.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                                <Phone className="w-3 h-3 text-accent" /> {lead.telefone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-600 hover:text-white" title="Ver Mensagem">
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-zinc-600 hover:text-red-500"
                                                onClick={() => deleteLead(lead.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="py-32 text-center text-zinc-500 italic">
                        Nenhum lead recebido até o momento.
                    </div>
                )}
            </div>
        </div>
    );
}

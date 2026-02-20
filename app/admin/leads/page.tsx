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
    Trash2,
    Search,
    Filter,
    CheckCircle,
    Clock,
    UserCheck,
    AlertCircle,
    Eye,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<{ id: string, role: string } | null>(null);
    const [corretores, setCorretores] = useState<{ user_id: string, full_name: string }[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchInitialData();
    }, [supabase]);

    async function fetchInitialData() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("user_id, role")
                .eq("user_id", user.id)
                .single();

            if (profile) {
                setUserProfile({ id: profile.user_id, role: profile.role });

                // Se for admin, carrega lista de corretores para atribuição
                if (['admin', 'admin_master'].includes(profile.role)) {
                    const { data: team } = await supabase
                        .from("profiles")
                        .select("user_id, full_name")
                        .in("role", ["corretor", "admin", "admin_master"]);
                    setCorretores(team || []);
                }

                await fetchLeads(profile.user_id, profile.role);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        let result = leads;

        if (searchTerm) {
            result = result.filter(lead =>
                lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.telefone?.includes(searchTerm)
            );
        }

        if (statusFilter !== "todos") {
            result = result.filter(lead => lead.status === statusFilter);
        }

        setFilteredLeads(result);
    }, [searchTerm, statusFilter, leads]);

    async function fetchLeads(userId: string, role: string) {
        let query = supabase.from("leads").select("*");

        // Se for corretor, vê apenas os dele
        if (role === 'corretor') {
            query = query.eq("corretor_id", userId);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
            if (error.code === '42P01') {
                toast.error("Tabela de leads não encontrada. Execute o script SQL enviado.");
            } else {
                toast.error("Erro ao buscar leads: " + error.message);
            }
            return;
        }

        setLeads(data as Lead[]);
    }

    async function assignLead(leadId: string, corretorId: string) {
        setIsAssigning(true);
        const { error } = await supabase
            .from("leads")
            .update({ corretor_id: corretorId })
            .eq("id", leadId);

        if (!error) {
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, corretor_id: corretorId } : l));
            toast.success("Lead atribuído com sucesso");
            if (selectedLead?.id === leadId) {
                setSelectedLead(prev => prev ? { ...prev, corretor_id: corretorId } : null);
            }
        } else {
            toast.error("Erro ao atribuir lead");
        }
        setIsAssigning(false);
    }

    async function updateLeadStatus(id: string, newStatus: string) {
        const { error } = await supabase
            .from("leads")
            .update({ status: newStatus })
            .eq("id", id);

        if (!error) {
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus as any } : l));
            toast.success(`Status atualizado para ${newStatus}`);
            if (selectedLead?.id === id) {
                setSelectedLead(prev => prev ? { ...prev, status: newStatus as any } : null);
            }
        } else {
            toast.error("Erro ao atualizar status");
        }
    }

    async function deleteLead(id: string) {
        if (!confirm("Deseja realmente excluir este lead?")) return;

        const { error } = await supabase.from("leads").delete().eq("id", id);
        if (!error) {
            setLeads(leads.filter(l => l.id !== id));
            toast.success("Lead excluído");
            setIsDetailsOpen(false);
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'novo':
                return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 gap-1"><Clock className="w-3 h-3" /> Novo</Badge>;
            case 'em_atendimento':
                return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1"><UserCheck className="w-3 h-3" /> Atendimento</Badge>;
            case 'convertido':
                return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-1"><CheckCircle className="w-3 h-3" /> Convertido</Badge>;
            case 'perdido':
                return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 gap-1"><AlertCircle className="w-3 h-3" /> Perdido</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-1">Gestão de Leads</h1>
                    <p className="text-zinc-500 text-sm">Central de inteligência e acompanhamento de contatos.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => fetchInitialData()}
                        className="border-zinc-800 text-zinc-400 hover:text-white"
                    >
                        Atualizar Lista
                    </Button>
                </div>
            </div>

            {/* Filtros e Busca */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-accent transition-colors" />
                    <Input
                        placeholder="Buscar por nome, email ou tel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 bg-zinc-900/50 border-zinc-800 h-12 rounded-xl focus:border-accent/30"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-zinc-500" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-12 rounded-xl">
                            <SelectValue placeholder="Filtrar por Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-800">
                            <SelectItem value="todos">Todos os Status</SelectItem>
                            <SelectItem value="novo">Novos</SelectItem>
                            <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                            <SelectItem value="convertido">Convertidos</SelectItem>
                            <SelectItem value="perdido">Perdidos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="relative">
                            <Loader2 className="w-12 h-12 text-accent animate-spin" />
                            <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
                        </div>
                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Sincronizando Leads...</p>
                    </div>
                ) : filteredLeads.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-950/50">
                                <TableRow className="border-zinc-900 hover:bg-transparent">
                                    <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest py-6 px-8">Cliente / Status</TableHead>
                                    <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-8">Canais de Contato</TableHead>
                                    <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-8">Interesse / Data</TableHead>
                                    <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest px-8 text-right">Gestão</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLeads.map((lead) => (
                                    <TableRow key={lead.id} className="border-zinc-900/50 hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="py-6 px-8">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-white font-serif text-lg leading-none">{lead.nome}</span>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(lead.status || 'novo')}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                                                    <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/5">
                                                        <Mail className="w-3 h-3 text-accent" />
                                                    </div>
                                                    {lead.email}
                                                </div>
                                                <div className="flex items-center gap-3 text-zinc-400 text-xs">
                                                    <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/5">
                                                        <Phone className="w-3 h-3 text-accent" />
                                                    </div>
                                                    {lead.telefone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8">
                                            <div className="space-y-1">
                                                <p className="text-xs text-white font-medium uppercase tracking-wider">
                                                    {lead.tipo_interesse === 'interesse_imovel' ? '🏡 Interesse em Imóvel' : '📞 Contato Geral'}
                                                </p>
                                                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                                                        day: '2-digit',
                                                        month: 'long'
                                                    })}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-zinc-800 hover:border-accent/50 text-zinc-400 hover:text-accent rounded-xl"
                                                    onClick={() => {
                                                        setSelectedLead(lead);
                                                        setIsDetailsOpen(true);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" /> Detalhes
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-zinc-600 hover:text-red-500 hover:bg-red-500/5 rounded-xl"
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
                    </div>
                ) : (
                    <div className="py-40 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-800">
                            <Search className="w-6 h-6 text-zinc-600" />
                        </div>
                        <div>
                            <p className="text-white font-serif text-xl">Nenhum lead encontrado</p>
                            <p className="text-zinc-500 text-sm mt-1">Refine sua busca ou aguarde novos contatos.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Detalhes */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-900 border-2 max-w-2xl text-white rounded-3xl overflow-hidden p-0 gap-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <DialogHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle className="text-3xl font-serif text-accent">Detalhes do Contato</DialogTitle>
                            <DialogDescription className="text-zinc-500">Gestão individual de lead / Mini-CRM</DialogDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-white/5"
                            onClick={() => setIsDetailsOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </DialogHeader>

                    {selectedLead && (
                        <div className="p-8 pt-6 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Cliente</span>
                                        <p className="text-xl font-serif">{selectedLead.nome}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Data da Solicitação</span>
                                        <p className="text-zinc-400">{new Date(selectedLead.created_at).toLocaleString("pt-BR")}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Status Atual</span>
                                        <div className="mt-1">
                                            <Select
                                                defaultValue={selectedLead.status || 'novo'}
                                                onValueChange={(val) => updateLeadStatus(selectedLead.id, val)}
                                            >
                                                <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 rounded-xl h-11">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                                    <SelectItem value="novo">Novo</SelectItem>
                                                    <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                                                    <SelectItem value="convertido">Convertido</SelectItem>
                                                    <SelectItem value="perdido">Perdido</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Seção de Atribuição (Admin Only) */}
                            {['admin', 'admin_master'].includes(userProfile?.role || '') && (
                                <div className="p-6 bg-zinc-950/50 rounded-2xl border border-zinc-900 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold block">Responsável pelo Atendimento</span>
                                        {selectedLead.corretor_id ? (
                                            <Badge variant="outline" className="border-accent/20 text-accent/80">Atribuído</Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-red-500/20 text-red-500/80">Não Atribuído</Badge>
                                        )}
                                    </div>

                                    <Select
                                        defaultValue={selectedLead.corretor_id || "none"}
                                        onValueChange={(val) => assignLead(selectedLead.id, val === "none" ? "" : val)}
                                        disabled={isAssigning}
                                    >
                                        <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 rounded-xl h-12">
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="w-4 h-4 text-accent" />
                                                <SelectValue placeholder="Selecionar Corretor..." />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                            <SelectItem value="none">-- Sem Atribuição --</SelectItem>
                                            {corretores.map(c => (
                                                <SelectItem key={c.user_id} value={c.user_id}>
                                                    {c.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-4">
                                <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold block">Mensagem Recebida</span>
                                <p className="text-zinc-300 leading-relaxed italic">
                                    "{selectedLead.mensagem}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-zinc-900">
                                <Button
                                    className="flex-1 bg-accent hover:bg-white text-primary font-bold h-12 rounded-xl transition-all"
                                    onClick={() => window.open(`https://wa.me/55${selectedLead.telefone.replace(/\D/g, '')}?text=Olá ${selectedLead.nome}, recebemos seu contato na Valteir Imobiliária. Como podemos ajudar?`, '_blank')}
                                >
                                    <Phone className="w-4 h-4 mr-2" /> Iniciar WhatsApp
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 border-zinc-800 hover:bg-zinc-900 text-white h-12 rounded-xl"
                                    onClick={() => window.location.href = `mailto:${selectedLead.email}?subject=Retorno - Valteir Imobiliária`}
                                >
                                    <Mail className="w-4 h-4 mr-2" /> Responder E-mail
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

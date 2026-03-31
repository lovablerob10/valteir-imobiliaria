"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Save, Globe, MessageSquare, Shield, Bell, Loader2, CheckCircle2, MapPin, Phone, Mail, Instagram, Facebook, Clock } from "lucide-react";
import { toast } from "sonner";

interface ConfigData {
    id: number;
    nome_imobiliaria: string;
    whatsapp: string;
    email: string;
    endereco: string;
    telefone_secundario: string;
    instagram_url: string;
    facebook_url: string;
    meta_title: string;
    meta_description: string;
    notificacoes_whatsapp_ativa: boolean;
    horario_funcionamento: string;
    updated_at: string;
}

const DEFAULT_CONFIG: ConfigData = {
    id: 1,
    nome_imobiliaria: "Valteir Imóveis",
    whatsapp: "",
    email: "",
    endereco: "",
    telefone_secundario: "",
    instagram_url: "",
    facebook_url: "",
    meta_title: "Valteir Imóveis | Imóveis de Alto Padrão",
    meta_description: "Descubra o luxo e a exclusividade com a Valteir Imóveis.",
    notificacoes_whatsapp_ativa: false,
    horario_funcionamento: "Seg-Sex: 9h às 18h | Sab: 9h às 13h",
    updated_at: new Date().toISOString(),
};

export default function ConfigPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [config, setConfig] = useState<ConfigData>(DEFAULT_CONFIG);
    const [activeTab, setActiveTab] = useState("geral");
    const supabase = createClient();

    useEffect(() => {
        fetchConfig();
    }, []);

    async function fetchConfig() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("configuracoes")
                .select("*")
                .eq("id", 1)
                .single();

            if (error) {
                console.error("Erro ao buscar configurações:", error);
                // Se a tabela não existe, tenta criar o registro
                if (error.code === "PGRST116" || error.code === "42P01") {
                    toast.error("Tabela de configurações não encontrada. Execute o script create_configuracoes.sql no Supabase.");
                }
            } else if (data) {
                setConfig({ ...DEFAULT_CONFIG, ...data });
            }
        } catch (err) {
            console.error("Erro inesperado:", err);
        }
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        setSaved(false);

        const payload = {
            nome_imobiliaria: config.nome_imobiliaria,
            whatsapp: config.whatsapp,
            email: config.email,
            endereco: config.endereco,
            telefone_secundario: config.telefone_secundario,
            instagram_url: config.instagram_url,
            facebook_url: config.facebook_url,
            meta_title: config.meta_title,
            meta_description: config.meta_description,
            notificacoes_whatsapp_ativa: config.notificacoes_whatsapp_ativa,
            horario_funcionamento: config.horario_funcionamento,
            updated_at: new Date().toISOString(),
        };

        // Tenta update primeiro
        const { error: updateError } = await supabase
            .from("configuracoes")
            .update(payload)
            .eq("id", 1);

        if (updateError) {
            // Se o update falhou, tenta upsert
            const { error: upsertError } = await supabase
                .from("configuracoes")
                .upsert({ id: 1, ...payload });

            if (upsertError) {
                console.error("Erro ao salvar:", upsertError);
                toast.error(`Erro ao salvar: ${upsertError.message}`);
                setSaving(false);
                return;
            }
        }

        setSaved(true);
        toast.success("Configurações salvas com sucesso!");
        setTimeout(() => setSaved(false), 3000);
        setSaving(false);
    }

    function updateField(field: keyof ConfigData, value: any) {
        setConfig(prev => ({ ...prev, [field]: value }));
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                <p className="text-zinc-500 font-medium tracking-widest uppercase text-[10px]">Carregando Configurações...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-8">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-1">Configurações do <span className="text-accent italic">Sistema</span></h1>
                    <p className="text-zinc-500 text-sm">Gerencie a identidade visual, dados de contato e SEO da plataforma.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className={`font-bold tracking-widest uppercase text-xs h-12 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] ${saved
                        ? "bg-emerald-500 text-white hover:bg-emerald-400"
                        : "bg-accent text-primary hover:bg-white"
                        }`}
                >
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saved ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Salvo!
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Mudanças
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Menu */}
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("geral")}
                        className={`justify-start rounded-none h-12 px-6 transition-all ${activeTab === "geral"
                            ? "text-accent bg-accent/5 border-r-2 border-accent"
                            : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                            }`}
                    >
                        <Globe className="w-4 h-4 mr-3" /> Geral & SEO
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("contato")}
                        className={`justify-start rounded-none h-12 px-6 transition-all ${activeTab === "contato"
                            ? "text-accent bg-accent/5 border-r-2 border-accent"
                            : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                            }`}
                    >
                        <Phone className="w-4 h-4 mr-3" /> Contato & Endereço
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("redes")}
                        className={`justify-start rounded-none h-12 px-6 transition-all ${activeTab === "redes"
                            ? "text-accent bg-accent/5 border-r-2 border-accent"
                            : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                            }`}
                    >
                        <Instagram className="w-4 h-4 mr-3" /> Redes Sociais
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("notificacoes")}
                        className={`justify-start rounded-none h-12 px-6 transition-all ${activeTab === "notificacoes"
                            ? "text-accent bg-accent/5 border-r-2 border-accent"
                            : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                            }`}
                    >
                        <Bell className="w-4 h-4 mr-3" /> Notificações
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("seguranca")}
                        className={`justify-start rounded-none h-12 px-6 transition-all ${activeTab === "seguranca"
                            ? "text-accent bg-accent/5 border-r-2 border-accent"
                            : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                            }`}
                    >
                        <Shield className="w-4 h-4 mr-3" /> Segurança
                    </Button>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8 bg-zinc-900/10 p-8 rounded-3xl border border-zinc-900/50 backdrop-blur-sm">
                    {/* ===== ABA: GERAL & SEO ===== */}
                    {activeTab === "geral" && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <section className="space-y-6">
                                <h2 className="text-lg font-serif text-white flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-accent" /> Identidade da Imobiliária
                                </h2>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Nome da Imobiliária</Label>
                                        <Input
                                            className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                            value={config.nome_imobiliaria}
                                            onChange={e => updateField("nome_imobiliaria", e.target.value)}
                                            placeholder="Ex: Valteir Imóveis"
                                        />
                                        <p className="text-zinc-600 text-[10px]">Este nome aparece no cabeçalho, rodapé e em todo o site.</p>
                                    </div>
                                </div>
                            </section>

                            <Separator className="bg-zinc-900/50" />

                            <section className="space-y-6">
                                <h2 className="text-lg font-serif text-white flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-accent" /> SEO & Metadados
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Título do Site (Meta Title)</Label>
                                        <Input
                                            className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                            value={config.meta_title}
                                            onChange={e => updateField("meta_title", e.target.value)}
                                            placeholder="Ex: Valteir Imóveis | Imóveis de Alto Padrão"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Descrição do Site (Meta Description)</Label>
                                        <textarea
                                            className="flex min-h-[100px] w-full rounded-xl border border-zinc-900 bg-zinc-950/50 px-3 py-2 text-sm text-white focus:ring-accent ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            value={config.meta_description}
                                            onChange={e => updateField("meta_description", e.target.value)}
                                            placeholder="Descrição que aparece nos resultados do Google"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ===== ABA: CONTATO & ENDEREÇO ===== */}
                    {activeTab === "contato" && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <section className="space-y-6">
                                <h2 className="text-lg font-serif text-white flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-accent" /> Dados de Contato
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">WhatsApp Principal</Label>
                                        <Input
                                            className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                            value={config.whatsapp}
                                            placeholder="(17) 99999-9999"
                                            onChange={e => updateField("whatsapp", e.target.value)}
                                        />
                                        <p className="text-zinc-600 text-[10px]">Aparece no rodapé do site e nos botões de contato.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Telefone Secundário</Label>
                                        <Input
                                            className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                            value={config.telefone_secundario}
                                            placeholder="(17) 3333-3333"
                                            onChange={e => updateField("telefone_secundario", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">E-mail de Contato</Label>
                                    <Input
                                        className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                        value={config.email}
                                        placeholder="contato@valteirimoveis.com.br"
                                        onChange={e => updateField("email", e.target.value)}
                                    />
                                </div>
                            </section>

                            <Separator className="bg-zinc-900/50" />

                            <section className="space-y-6">
                                <h2 className="text-lg font-serif text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-accent" /> Endereço
                                </h2>

                                <div className="space-y-2">
                                    <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Endereço Completo</Label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-xl border border-zinc-900 bg-zinc-950/50 px-3 py-3 text-sm text-white focus:ring-accent ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={config.endereco}
                                        placeholder="Rua Exemplo, 123 - Centro&#10;São José do Rio Preto - SP"
                                        onChange={e => updateField("endereco", e.target.value)}
                                    />
                                    <p className="text-zinc-600 text-[10px]">Aparece no rodapé do site. Use Enter para dividir em linhas.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Horário de Funcionamento</Label>
                                    <Input
                                        className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                        value={config.horario_funcionamento}
                                        placeholder="Seg-Sex: 9h às 18h | Sab: 9h às 13h"
                                        onChange={e => updateField("horario_funcionamento", e.target.value)}
                                    />
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ===== ABA: REDES SOCIAIS ===== */}
                    {activeTab === "redes" && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <section className="space-y-6">
                                <h2 className="text-lg font-serif text-white flex items-center gap-2">
                                    <Instagram className="w-5 h-5 text-accent" /> Redes Sociais
                                </h2>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Instagram (URL)</Label>
                                        <Input
                                            className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                            value={config.instagram_url}
                                            placeholder="https://instagram.com/valteirimoveis"
                                            onChange={e => updateField("instagram_url", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Facebook (URL)</Label>
                                        <Input
                                            className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                            value={config.facebook_url}
                                            placeholder="https://facebook.com/valteirimoveis"
                                            onChange={e => updateField("facebook_url", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ===== ABA: NOTIFICAÇÕES ===== */}
                    {activeTab === "notificacoes" && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <section className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900">
                                    <div className="space-y-1">
                                        <h3 className="text-white font-medium flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-accent" /> Alertas de Novos Leads
                                        </h3>
                                        <p className="text-zinc-500 text-xs">Enviar notificação instantânea no WhatsApp quando um novo lead for capturado.</p>
                                    </div>
                                    <Switch
                                        checked={config.notificacoes_whatsapp_ativa}
                                        onCheckedChange={checked => updateField("notificacoes_whatsapp_ativa", checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900">
                                    <div className="space-y-1">
                                        <h3 className="text-white font-medium flex items-center gap-2">
                                            <Bell className="w-4 h-4 text-accent" /> Relatórios Semanais
                                        </h3>
                                        <p className="text-zinc-500 text-xs">Enviar resumo de performance da semana por e-mail.</p>
                                    </div>
                                    <Switch checked={false} disabled />
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ===== ABA: SEGURANÇA ===== */}
                    {activeTab === "seguranca" && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <section className="space-y-6">
                                <h2 className="text-lg font-serif text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-accent" /> Acesso & Permissões
                                </h2>
                                <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl">
                                    <p className="text-accent text-xs leading-relaxed">
                                        Para alterar senhas ou gerenciar acessos de corretores, utilize o menu de <strong>Equipe</strong> na barra lateral. As configurações abaixo são exclusivas para a segurança global do site.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900">
                                    <div className="space-y-1">
                                        <h3 className="text-white font-medium">Autenticação de Dois Fatores (2FA)</h3>
                                        <p className="text-zinc-500 text-xs">Exigir código via app de autenticação para todos os admins.</p>
                                    </div>
                                    <Switch checked={false} disabled />
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Save, Globe, MessageSquare, Shield, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ConfigPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("geral");
    const supabase = createClient();

    useEffect(() => {
        fetchConfig();
    }, []);

    async function fetchConfig() {
        setLoading(true);
        const { data, error } = await supabase
            .from("configuracoes")
            .select("*")
            .single();

        if (!error && data) {
            setConfig(data);
        }
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        const { error } = await supabase
            .from("configuracoes")
            .update({
                ...config,
                updated_at: new Date().toISOString()
            })
            .eq("id", 1);

        if (error) {
            toast.error("Erro ao salvar configurações");
        } else {
            toast.success("Configurações atualizadas com sucesso!");
        }
        setSaving(false);
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
                    <p className="text-zinc-500 text-sm">Gerencie a identidade visual, SEO e segurança da plataforma.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-accent text-primary font-bold tracking-widest uppercase text-xs h-12 px-8 rounded-xl hover:bg-white transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Salvar Mudanças
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
                    {activeTab === "geral" && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <section className="space-y-6">
                                <h2 className="text-lg font-serif text-white flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-accent" /> Identidade & Contato
                                </h2>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Nome da Imobiliária</Label>
                                        <Input
                                            className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                            value={config?.nome_imobiliaria || ""}
                                            onChange={e => setConfig({ ...config, nome_imobiliaria: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">WhatsApp Principal</Label>
                                            <Input
                                                className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                                value={config?.whatsapp_principal || ""}
                                                placeholder="(00) 00000-0000"
                                                onChange={e => setConfig({ ...config, whatsapp_principal: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">E-mail de Contato</Label>
                                            <Input
                                                className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                                value={config?.email_contato || ""}
                                                placeholder="contato@exemplo.com"
                                                onChange={e => setConfig({ ...config, email_contato: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Endereço Completo</Label>
                                        <Input
                                            className="bg-zinc-950/50 border-zinc-900 text-white h-12 rounded-xl focus:ring-accent"
                                            value={config?.endereco_completo || ""}
                                            onChange={e => setConfig({ ...config, endereco_completo: e.target.value })}
                                        />
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
                                            value={config?.seo_title || ""}
                                            onChange={e => setConfig({ ...config, seo_title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Descrição do Site (Meta Description)</Label>
                                        <textarea
                                            className="flex min-h-[100px] w-full rounded-xl border border-zinc-900 bg-zinc-950/50 px-3 py-2 text-sm text-white focus:ring-accent ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            value={config?.seo_description || ""}
                                            onChange={e => setConfig({ ...config, seo_description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

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
                                        checked={config?.notificacoes_whatsapp_ativa}
                                        onCheckedChange={checked => setConfig({ ...config, notificacoes_whatsapp_ativa: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900">
                                    <div className="space-y-1">
                                        <h3 className="text-white font-medium flex items-center gap-2">
                                            <Bell className="w-4 h-4 text-accent" /> Relatórios Semanais
                                        </h3>
                                        <p className="text-zinc-500 text-xs">Enviar resumo de performance da semana por e-mail.</p>
                                    </div>
                                    <Switch
                                        checked={false}
                                        disabled
                                    />
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === "seguranca" && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <section className="space-y-6">
                                <h2 className="text-lg font-serif text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-accent" /> Acesso & Permissões
                                </h2>
                                <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                                    <p className="text-amber-500 text-xs leading-relaxed">
                                        Para alterar senhas ou gerenciar acessos de corretores, utilize o menu de <strong>Usuários</strong> na barra lateral (em breve). As configurações abaixo são exclusivas para a segurança global do site.
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

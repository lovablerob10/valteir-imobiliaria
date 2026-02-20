"use client";

import PropertyForm from "@/components/admin/PropertyForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Imovel } from "@/types/database";
import { toast } from "sonner";

export default function EditPropertyPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [property, setProperty] = useState<Imovel | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchProperty() {
            const { data, error } = await supabase
                .from("imoveis")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                toast.error("Erro ao carregar imóvel");
                router.push("/admin/imoveis");
                return;
            }

            setProperty(data as Imovel);
            setLoading(false);
        }
        fetchProperty();
    }, [id, supabase, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
                <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Carregando dados...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin/imoveis" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
                </Link>
                <h1 className="text-3xl font-serif text-white">Editar Imóvel</h1>
            </div>

            {property && <PropertyForm mode="edit" initialData={property} />}
        </div>
    );
}

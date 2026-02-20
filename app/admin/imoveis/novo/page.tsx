"use client";

import PropertyForm from "@/components/admin/PropertyForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPropertyPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/admin/imoveis" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
                </Link>
                <h1 className="text-3xl font-serif text-white">Novo Imóvel de Luxo</h1>
            </div>

            <PropertyForm mode="create" />
        </div>
    );
}

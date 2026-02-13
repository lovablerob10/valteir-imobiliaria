"use client";

import { Imovel } from "@/types/database";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, Square, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
    property: Partial<Imovel>;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
    }).format(property.preco || 0);

    const fallbackImages: Record<string, string> = {
        mansao: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
        cobertura: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200", // Nova imagem de cobertura de luxo
        casa: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200",
        apartamento: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200"
    };

    const imageUrl = property.imagens?.[0] || fallbackImages[property.tipo || "mansao"] || "/images/properties/placeholder.jpg";

    return (
        <Link href={`/imovel/${property.slug}`}>
            <Card className="group overflow-hidden border-none bg-zinc-950 transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-zinc-800/50 hover:ring-accent/40">
                <CardContent className="p-0">
                    <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                            src={imageUrl}
                            alt={property.titulo || "Imóvel"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                                // Fallback se a URL do banco falhar
                                const target = e.target as HTMLImageElement;
                                target.src = fallbackImages[property.tipo || "mansao"];
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />

                        <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-zinc-900/80 text-[10px] font-medium tracking-wider uppercase border-zinc-700 backdrop-blur-md">
                                {property.tipo}
                            </Badge>
                            {property.destaque && (
                                <Badge className="bg-accent/90 text-[10px] font-bold tracking-wider uppercase border-accent backdrop-blur-md text-primary">
                                    Destaque
                                </Badge>
                            )}
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <div className="flex gap-4 text-white text-xs font-medium">
                                <span className="flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5 text-accent" /> {property.quartos}</span>
                                <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5 text-accent" /> {property.suites}</span>
                                <span className="flex items-center gap-1.5"><Square className="w-3.5 h-3.5 text-accent" /> {property.area_util}m²</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-3 h-3 text-accent" />
                        <span className="text-[10px] text-muted-luxury uppercase tracking-[0.2em] font-medium">
                            {property.bairro}, {property.cidade}
                        </span>
                    </div>
                    <h3 className="text-lg font-serif text-white mb-2 group-hover:text-accent transition-colors">
                        {property.titulo}
                    </h3>
                    <p className="text-xl font-medium text-accent">
                        {formattedPrice}
                    </p>
                </CardFooter>
            </Card>
        </Link>
    );
}

import PropertyCard from "./PropertyCard";
import { Imovel } from "@/types/database";

const mockProperties: Partial<Imovel>[] = [
    {
        id: "1",
        titulo: "Mansão Suspensa Itaim",
        slug: "mansao-suspensa-itaim",
        preco: 12500000,
        bairro: "Itaim Bibi",
        cidade: "São Paulo",
        tipo: "mansao",
        quartos: 4,
        suites: 4,
        area_util: 450,
        destaque: true,
        imagens: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"],
    },
    {
        id: "2",
        titulo: "Penthouse Jardins de Luxemburgo",
        slug: "penthouse-jardins-luxemburgo",
        preco: 8900000,
        bairro: "Jardins",
        cidade: "São Paulo",
        tipo: "cobertura",
        quartos: 3,
        suites: 3,
        area_util: 320,
        destaque: true,
        imagens: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"],
    },
    {
        id: "3",
        titulo: "Casa Contemporânea Tamboré",
        slug: "casa-contemporanea-tambore",
        preco: 15700000,
        bairro: "Tamboré",
        cidade: "Barueri",
        tipo: "casa",
        quartos: 5,
        suites: 5,
        area_util: 800,
        destaque: false,
        imagens: ["https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200"],
    },
];

export default function FeaturedSection() {
    return (
        <section className="py-24 px-4 md:px-8 bg-zinc-950">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-accent text-xs font-medium tracking-[0.4em] uppercase mb-4 block">
                            Curadoria Exclusiva
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
                            Onde o luxo encontra <br />
                            <span className="text-accent italic">o seu estilo de vida</span>
                        </h2>
                    </div>
                    <button className="text-accent text-xs font-bold tracking-[0.2em] uppercase border-b border-accent/30 pb-1 hover:border-accent transition-all">
                        Ver todo o portfólio
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </section>
    );
}

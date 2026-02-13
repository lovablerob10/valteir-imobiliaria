import HeroDoorway from "@/components/sections/HeroDoorway";
import FeaturedSection from "@/components/sections/FeaturedSection";
import ContactForm from "@/components/sections/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617]">
      <HeroDoorway />
      <FeaturedSection />

      {/* Seção de Contato Rápido / CTA */}
      <section className="py-24 px-4 bg-zinc-900/30 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
              Deseja uma consultoria <br />
              <span className="text-accent italic">personalizada?</span>
            </h2>
            <p className="text-muted-luxury mb-8 text-lg max-w-md">
              Nossos especialistas em alto padrão estão prontos para encontrar o imóvel que supera suas expectativas em cada detalhe.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <span className="font-bold">01</span>
                </div>
                <p className="text-sm font-medium tracking-wide">Atendimento Exclusivo e Discreto</p>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <span className="font-bold">02</span>
                </div>
                <p className="text-sm font-medium tracking-wide">Curadoria de Imóveis Off-Market</p>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}

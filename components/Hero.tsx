export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{background: "linear-gradient(to bottom, #8FCBC4 0%, #D4EDEA 25%, #F7F4EF 60%, #F7F4EF 100%)"}}>
      <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-32 md:pt-48 pb-20 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <p className="section-subtitle mb-4 md:mb-6">Psychomodulační látky — kamenné pobočky</p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] md:leading-[1.05] tracking-tight text-ink mb-6 md:mb-8">
            Kratom —{" "}
            <span className="text-forest">psychomodulační látka</span>
          </h1>

          <p className="text-ink-soft text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl mx-auto">
            Kratom je psychomodulační látka regulovaná dle vyhlášky č. 448/2025 Sb.
            Prodej výhradně osobám starším 18 let na kamenných pobočkách.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pobocky"
              className="inline-flex items-center justify-center bg-forest text-cream px-8 py-4 rounded-full hover:bg-forest-light transition-colors text-lg font-semibold"
            >
              Najít pobočku
            </a>
            <a
              href="#co-je-kratom"
              className="inline-flex items-center justify-center border-2 border-forest text-forest px-8 py-4 rounded-full hover:bg-forest hover:text-cream transition-colors text-lg font-semibold"
            >
              Co je kratom?
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-24 pt-10 border-t border-border-green flex justify-center text-center">
          <div>
            <p className="text-3xl font-bold text-forest mb-1">Kamenné</p>
            <p className="text-sm text-ink-muted">Prodej pouze na pobočkách</p>
          </div>
        </div>
      </div>
    </section>
  );
}

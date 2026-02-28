export default function Contact() {
  return (
    <section id="kontakt" className="section-padding bg-forest text-cream">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
          {/* Left */}
          <div>
            <p className="text-forest-muted text-sm uppercase tracking-widest font-medium mb-4">
              Kontakt
            </p>
            <div className="w-12 h-px bg-cream/30 mb-8" />
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Navštivte nás
              <br />
              na pobočce
            </h2>
            <p className="text-cream/80 text-base md:text-xl leading-relaxed mb-8 md:mb-12 max-w-md">
              Máte dotazy? Napište nebo zavolejte.
            </p>

            <div className="flex flex-col gap-6">
              {/* Email */}
              <a
                href="mailto:info@ksh-partners.cz"
                className="group flex items-center gap-5"
              >
                <div className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center shrink-0 group-hover:border-cream/60 transition-colors">
                  <svg className="w-5 h-5 text-cream/70 group-hover:text-cream transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-cream/50 text-xs uppercase tracking-widest mb-0.5">E-mail</p>
                  <p className="text-cream text-base md:text-xl font-semibold group-hover:underline">info@ksh-partners.cz</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+420774982675"
                className="group flex items-center gap-5"
              >
                <div className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center shrink-0 group-hover:border-cream/60 transition-colors">
                  <svg className="w-5 h-5 text-cream/70 group-hover:text-cream transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-cream/50 text-xs uppercase tracking-widest mb-0.5">Telefon</p>
                  <p className="text-cream text-base md:text-xl font-semibold group-hover:underline">+420 774 982 675</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right — notice card */}
          <div className="bg-cream/10 border border-cream/15 rounded-2xl p-8 md:p-10">
            <h3 className="text-xl font-light mb-6">Jak to funguje</h3>
            <ol className="flex flex-col gap-5">
              {[
                "Navštivte nás osobně na některé z našich poboček",
                "Poradíme vám s výběrem podle vašich potřeb",
                "Platba hotově nebo kartou přímo na místě",
                "Zboží si odnášíte ihned s sebou",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-forest-muted font-mono text-sm shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-cream/85 text-base md:text-xl leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6 md:mt-10 pt-6 md:pt-8 border-t border-cream/15">
              <p className="text-cream/50 text-xs leading-relaxed">
                Prodej je určen výhradně osobám starším 18 let. Zakoupením produktů
                zákazník stvrzuje, že splňuje tuto podmínku.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

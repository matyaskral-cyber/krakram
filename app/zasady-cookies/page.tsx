export default function ZasadyCookies() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-32 text-ink">
      <h1 className="text-4xl font-bold mb-2">Zásady cookies</h1>
      <p className="text-ink-muted text-sm mb-10">Platné od 1. 3. 2026 · KH Partners s.r.o.</p>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Co jsou cookies?</h2>
        <p className="text-ink-soft leading-relaxed">
          Cookies jsou malé textové soubory ukládané do vašeho zařízení při návštěvě
          webových stránek. Slouží k zapamatování vašich preferencí a ke sběru
          statistických dat o návštěvnosti.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Jaké cookies používáme?</h2>
        <div className="flex flex-col gap-4">
          <div className="border border-border-green rounded-xl p-5">
            <p className="font-bold text-ink mb-1">Nezbytné cookies <span className="text-xs text-forest font-semibold ml-2">Vždy aktivní</span></p>
            <p className="text-ink-soft text-sm leading-relaxed">
              Zajišťují základní funkce webu — věkovou bránu (AgeGate), uložení vašeho
              souhlasu s cookies a správné fungování formulářů.
              Bez těchto cookies web nelze provozovat.
            </p>
            <p className="text-ink-muted text-xs mt-2">Doba uchování: relace / 1 rok</p>
          </div>
          <div className="border border-border-green rounded-xl p-5">
            <p className="font-bold text-ink mb-1">Analytické cookies <span className="text-xs text-ink-muted font-normal ml-2">Vyžadují souhlas</span></p>
            <p className="text-ink-soft text-sm leading-relaxed">
              Umožňují nám sledovat návštěvnost a chování uživatelů na webu
              (Google Analytics 4). Data jsou anonymizována a neslouží k identifikaci osob.
            </p>
            <p className="text-ink-muted text-xs mt-2">Poskytovatel: Google LLC · Doba uchování: 2 roky</p>
          </div>
          <div className="border border-border-green rounded-xl p-5">
            <p className="font-bold text-ink mb-1">Marketingové cookies <span className="text-xs text-ink-muted font-normal ml-2">Vyžadují souhlas</span></p>
            <p className="text-ink-soft text-sm leading-relaxed">
              Slouží k zobrazování relevantní reklamy na základě vašich zájmů
              (Meta Pixel, Google Ads). Sdílíme anonymizovaná data s reklamními platformami.
            </p>
            <p className="text-ink-muted text-xs mt-2">Poskytovatel: Meta Platforms, Google LLC · Doba uchování: 90 dní</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Správa souhlasu</h2>
        <p className="text-ink-soft leading-relaxed">
          Svůj souhlas s cookies můžete kdykoliv odvolat nebo změnit smazáním dat
          webové stránky v nastavení vašeho prohlížeče, nebo kontaktováním
          správce webu na <a href="mailto:info@ksh-partners.cz" className="underline text-forest">info@ksh-partners.cz</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Správce webu</h2>
        <p className="text-ink-soft leading-relaxed">
          KH Partners s.r.o., IČO: 19985681<br />
          Chudenická 1059/30, 102 00 Praha 10 – Hostivař<br />
          E-mail: <a href="mailto:info@ksh-partners.cz" className="underline text-forest">info@ksh-partners.cz</a>
        </p>
      </section>

      <a href="/" className="inline-flex items-center gap-2 text-forest font-semibold hover:underline">
        ← Zpět na hlavní stránku
      </a>
    </main>
  );
}

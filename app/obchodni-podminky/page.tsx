import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Obchodní podmínky | KraKrám",
  description: "Obchodní podmínky kamenných prodejen KraKrám pro prodej psychomodulačních látek. Platné od 1. 3. 2026.",
};

export default function ObchodniPodminky() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-32 text-ink">
      <h1 className="text-4xl font-bold mb-2">Obchodní podmínky</h1>
      <p className="text-ink-muted text-sm mb-10">Platné od 1. 3. 2026 · KSH Partners s.r.o.</p>

      <div className="border border-border-green rounded-xl p-5 mb-10 text-ink-soft text-sm leading-relaxed">
        Tyto obchodní podmínky upravují prodej zboží v kamenných prodejnách KraKrám.
        Nákupem zboží zákazník potvrzuje, že se s těmito podmínkami seznámil a souhlasí s nimi.
        Prodej je určen výhradně osobám starším 18 let.
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">1. Provozovatel a kontakt</h2>
        <p className="text-ink-soft leading-relaxed">
          <strong>KSH Partners s.r.o.</strong><br />
          IČO: 19985681<br />
          Sídlo: Chudenická 1059/30, 102 00 Praha 10 – Hostivař<br />
          E-mail: <a href="mailto:info@ksh-partners.cz" className="underline text-forest">info@ksh-partners.cz</a><br />
          Telefon: <a href="tel:+420774982675" className="underline text-forest">+420 774 982 675</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">2. Věkové omezení</h2>
        <p className="text-ink-soft leading-relaxed">
          Prodej veškerého zboží je podmíněn dovršením věku 18 let. Zákazník je povinen prokázat věk
          platným dokladem totožnosti na vyžádání obsluhy. Prodejce je oprávněn odmítnout prodej
          při důvodném podezření, že zákazník nedosáhl 18 let.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">3. Zboží a jeho vlastnosti</h2>
        <p className="text-ink-soft leading-relaxed mb-3">
          Prodávané psychomodulační látky jsou legální produkty dle platné legislativy ČR
          (vyhl. č. 448/2025 Sb. a navazujících předpisů). Prodejce poskytuje informace
          o složení a doporučeném použití každého produktu.
        </p>
        <p className="text-ink-soft leading-relaxed">
          Zákazník bere na vědomí, že produkty jsou určeny k legálnímu použití v souladu
          s platným právem. Prodejce nenese odpovědnost za újmu vzniklou nevhodným nebo
          protiprávním použitím zboží.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">4. Cena a platba</h2>
        <ul className="list-disc pl-5 flex flex-col gap-2 text-ink-soft">
          <li>Ceny jsou uváděny včetně DPH v českých korunách.</li>
          <li>Platba je možná hotově nebo kartou v místě prodeje.</li>
          <li>Prodejce si vyhrazuje právo změnit ceny zboží bez předchozího upozornění.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">5. Reklamace a vrácení zboží</h2>
        <ul className="list-disc pl-5 flex flex-col gap-2 text-ink-soft">
          <li>Záruční doba na zboží je 24 měsíců od zakoupení (s účtenkou).</li>
          <li>Reklamaci lze uplatnit osobně na prodejně nebo e-mailem na <a href="mailto:info@ksh-partners.cz" className="underline text-forest">info@ksh-partners.cz</a>.</li>
          <li>Neotevřené zboží lze vrátit do 14 dnů od zakoupení s účtenkou v původním obalu.</li>
          <li>Vrácení otevřeného nebo poškozeného zboží není možné z hygienických důvodů, pokud vada není způsobena výrobcem.</li>
          <li>Reklamace jsou vyřizovány do 30 dnů od uplatnění.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">6. Ochrana osobních údajů</h2>
        <p className="text-ink-soft leading-relaxed">
          Při nákupu v kamenné prodejně nezpracováváme osobní údaje zákazníků.
          Při komunikaci e-mailem nebo prostřednictvím kontaktního formuláře se uplatňují
          {" "}<Link href="/zasady-cookies" className="underline text-forest">Zásady cookies a ochrany osobních údajů</Link>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">7. Odpovědnost a omezení</h2>
        <p className="text-ink-soft leading-relaxed">
          Provozovatel nenese odpovědnost za škody vzniklé nesprávným nebo protiprávním
          použitím zakoupeného zboží. Veškerý prodej se řídí platným právem České republiky.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">8. Rozhodné právo a spory</h2>
        <p className="text-ink-soft leading-relaxed">
          Právní vztahy se řídí právem České republiky. Spotřebitelské spory lze řešit
          mimosoudně prostřednictvím České obchodní inspekce (<a href="https://www.coi.cz" target="_blank" rel="noopener" className="underline text-forest">coi.cz</a>).
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">9. Změny podmínek</h2>
        <p className="text-ink-soft leading-relaxed">
          Provozovatel je oprávněn tyto podmínky měnit. Aktuální verze je vždy dostupná
          na webových stránkách krakram.com.
        </p>
        <p className="text-ink-muted text-sm mt-3">Poslední aktualizace: březen 2026</p>
      </section>

      <Link href="/" className="inline-flex items-center gap-2 text-forest font-semibold hover:underline">
        ← Zpět na hlavní stránku
      </Link>
    </main>
  );
}

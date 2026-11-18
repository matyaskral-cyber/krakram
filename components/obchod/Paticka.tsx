import Link from "next/link";
import { kategorie } from "@/lib/obchod/produkty";
import { branches } from "@/lib/pobocky";
import { Logo } from "./Hlavicka";

export default function Paticka() {
  return (
    <footer className="bg-pine text-cream">
      <div className="mx-auto max-w-[86rem] px-4 pb-10 pt-16 md:px-8 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="h-24 text-lime" />
            <p className="mt-6 max-w-xs text-base leading-relaxed text-cream/70">
              Pět kamenných prodejen a{"\u00a0"}e-shop se{"\u00a0"}zbožím, které
              se smí posílat.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-lime">
              Sortiment
            </h3>
            <ul className="mt-4 space-y-2 text-base">
              {kategorie.map((k) => (
                <li key={k.id}>
                  <Link
                    href={`/obchod/sortiment?k=${k.id}`}
                    className="text-cream/80 hover:text-cream"
                  >
                    {k.nazev}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-lime">
              Nákup
            </h3>
            <ul className="mt-4 space-y-2 text-base text-cream/80">
              <li>Doprava a platba</li>
              <li>Ověření věku</li>
              <li>Vrácení zboží</li>
              <li>
                <Link href="/obchodni-podminky" className="hover:text-cream">
                  Obchodní podmínky
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-lime">
              Prodejny
            </h3>
            <ul className="mt-4 space-y-2 text-base text-cream/80">
              {branches.map((b) => (
                <li key={b.slug}>{b.city}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-cream/15 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-cream text-base font-extrabold">
              18+
            </span>
            <p className="max-w-xl text-sm leading-relaxed text-cream/70">
              Prodáváme jen dospělým. Věk potvrzujete v{"\u00a0"}pokladně a
              {"\u00a0"}dopravce ho zkontroluje při předání. Kratom v{"\u00a0"}
              e-shopu není, ten je jen na prodejnách.
            </p>
          </div>
          <p className="text-sm text-cream/60">
            KSH Partners s.r.o. · IČO 23990368
            <br />© {new Date().getFullYear()} KraKrám
          </p>
        </div>
      </div>
    </footer>
  );
}

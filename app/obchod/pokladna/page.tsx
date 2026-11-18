"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { radky, useKosik } from "@/components/obchod/Kosik";
import { DOPRAVA_ZDARMA_OD, kc } from "@/lib/obchod/produkty";
import { branches } from "@/lib/pobocky";

const DOPRAVY = [
  {
    id: "vydejna",
    nazev: "Výdejní místo",
    popis: "S ověřením věku při výdeji",
    cena: 79,
  },
  {
    id: "kuryr",
    nazev: "Kurýr na adresu",
    popis: "Předá jen osobě starší 18 let",
    cena: 129,
  },
  { id: "odber", nazev: "Osobní odběr", popis: "Na prodejně KraKrám", cena: 0 },
];

const PLATBY = [
  { id: "karta", nazev: "Kartou online", cena: 0 },
  { id: "prevod", nazev: "Bankovním převodem", cena: 0 },
  { id: "prevzeti", nazev: "Při převzetí", cena: 39 },
];

const pole =
  "w-full rounded-2xl border border-ink/15 bg-white/70 px-4 py-3.5 text-base outline-none transition-colors placeholder:text-ink-muted/60 focus:border-pine focus:bg-white";

function Volba({
  aktivni,
  vyber,
  nazev,
  popis,
  cena,
}: {
  aktivni: boolean;
  vyber: () => void;
  nazev: string;
  popis?: string;
  cena: number;
}) {
  return (
    <button
      type="button"
      onClick={vyber}
      aria-pressed={aktivni}
      className={`flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors ${
        aktivni
          ? "border-pine bg-white"
          : "border-ink/10 bg-white/50 hover:border-ink/30"
      }`}
    >
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
          aktivni ? "border-pine" : "border-ink/30"
        }`}
      >
        {aktivni && <span className="h-2.5 w-2.5 rounded-full bg-pine" />}
      </span>
      <span className="flex-1">
        <span className="block text-base font-bold">{nazev}</span>
        {popis && <span className="block text-sm text-ink-muted">{popis}</span>}
      </span>
      <span className="text-base font-bold tabular-nums">
        {cena ? kc(cena) : "Zdarma"}
      </span>
    </button>
  );
}

function Krok({
  n,
  nadpis,
  children,
}: {
  n: string;
  nadpis: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink/10 py-8 first:border-0 first:pt-0">
      <h2 className="flex items-center gap-3 text-2xl font-extrabold uppercase tracking-tight">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-pine text-sm tabular-nums text-lime">
          {n}
        </span>
        {nadpis}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function Pokladna() {
  const k = useKosik();
  const r = radky(k.polozky);
  const [doprava, setDoprava] = useState("vydejna");
  const [platba, setPlatba] = useState("karta");
  const [pobocka, setPobocka] = useState(branches[0].slug);
  const [odeslano, setOdeslano] = useState(false);

  const d = DOPRAVY.find((x) => x.id === doprava)!;
  const p = PLATBY.find((x) => x.id === platba)!;
  const cenaDopravy = k.soucet >= DOPRAVA_ZDARMA_OD ? 0 : d.cena;
  const celkem = k.soucet + cenaDopravy + p.cena;

  if (odeslano) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-20 text-center">
        <div>
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-lime text-4xl text-pine">
            ✓
          </span>
          <h1 className="mt-8 text-5xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
            Tady by to cinklo
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Tohle je návrh e-shopu, objednávka se nikam neodeslala a nic jste
            neplatili.
          </p>
          <Link
            href="/obchod"
            className="mt-8 inline-block rounded-full bg-pine px-8 py-4 text-lg font-bold text-cream"
          >
            Zpět do obchodu
          </Link>
        </div>
      </div>
    );
  }

  if (r.length === 0) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-20 text-center">
        <div>
          <h1 className="text-5xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
            Košík je prázdný
          </h1>
          <Link
            href="/obchod/sortiment"
            className="mt-8 inline-block rounded-full bg-pine px-8 py-4 text-lg font-bold text-cream"
          >
            Do sortimentu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[86rem] px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16">
      <h1 className="text-5xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-8xl">
        Pokladna
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setOdeslano(true);
          window.scrollTo({ top: 0 });
        }}
        className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16"
      >
        <div>
          <Krok n="1" nadpis="Kontakt">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className={pole}
                placeholder="Jméno"
                autoComplete="given-name"
                required
              />
              <input
                className={pole}
                placeholder="Příjmení"
                autoComplete="family-name"
                required
              />
              <input
                className={pole}
                type="email"
                placeholder="E-mail"
                autoComplete="email"
                required
              />
              <input
                className={pole}
                type="tel"
                placeholder="Telefon"
                autoComplete="tel"
                required
              />
            </div>
          </Krok>

          <Krok n="2" nadpis="Doprava">
            <div className="grid gap-2">
              {DOPRAVY.map((x) => (
                <Volba
                  key={x.id}
                  aktivni={x.id === doprava}
                  vyber={() => setDoprava(x.id)}
                  nazev={x.nazev}
                  popis={x.popis}
                  cena={k.soucet >= DOPRAVA_ZDARMA_OD ? 0 : x.cena}
                />
              ))}
            </div>
            {doprava === "kuryr" && (
              <div className="mt-3 grid gap-3 sm:grid-cols-[2fr_1fr]">
                <input
                  className={`${pole} sm:col-span-2`}
                  placeholder="Ulice a číslo"
                  autoComplete="street-address"
                  required
                />
                <input
                  className={pole}
                  placeholder="Město"
                  autoComplete="address-level2"
                  required
                />
                <input
                  className={pole}
                  placeholder="PSČ"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  required
                />
              </div>
            )}
            {doprava === "vydejna" && (
              <button
                type="button"
                className="mt-3 w-full rounded-2xl border-2 border-dashed border-ink/20 py-4 text-base font-bold text-ink-soft hover:border-pine hover:text-pine"
              >
                Vybrat výdejní místo na mapě
              </button>
            )}
            {doprava === "odber" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {branches.map((b) => (
                  <button
                    key={b.slug}
                    type="button"
                    onClick={() => setPobocka(b.slug)}
                    aria-pressed={b.slug === pobocka}
                    className={`rounded-full px-5 py-2.5 text-base font-bold transition-colors ${
                      b.slug === pobocka
                        ? "bg-pine text-cream"
                        : "bg-ink/5 hover:bg-ink/10"
                    }`}
                  >
                    {b.city}
                  </button>
                ))}
              </div>
            )}
          </Krok>

          <Krok n="3" nadpis="Platba">
            <div className="grid gap-2">
              {PLATBY.map((x) => (
                <Volba
                  key={x.id}
                  aktivni={x.id === platba}
                  vyber={() => setPlatba(x.id)}
                  nazev={x.nazev}
                  cena={x.cena}
                />
              ))}
            </div>
          </Krok>
        </div>

        <aside className="h-fit rounded-[2rem] bg-pine p-6 text-cream lg:sticky lg:top-24 md:p-8">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight">
            Vaše objednávka
          </h2>
          <ul className="mt-5 space-y-4">
            {r.map((x) => (
              <li key={x.slug + x.varianta} className="flex items-center gap-4">
                <div
                  className="relative h-16 w-16 shrink-0 rounded-xl"
                  style={{
                    background: `color-mix(in srgb, ${x.produkt.barva} 75%, #F7F4EF)`,
                  }}
                >
                  {x.produkt.foto && (
                    <Image
                      unoptimized
                      src={x.produkt.foto}
                      alt=""
                      fill
                      sizes="64px"
                      className={`object-contain ${x.produkt.splyvat ? "rounded-xl mix-blend-multiply" : "p-1"}`}
                    />
                  )}
                  <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-lime px-1 text-xs font-extrabold tabular-nums text-pine">
                    {x.ks}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold leading-snug">
                    {x.produkt.nazev}
                  </p>
                  <p className="text-sm text-cream/60">{x.v.nazev}</p>
                </div>
                <span className="text-base font-bold tabular-nums">
                  {kc(x.ks * x.v.cena)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-cream/15 pt-5 text-base">
            <div className="flex justify-between">
              <dt className="text-cream/70">Zboží</dt>
              <dd className="font-semibold tabular-nums">{kc(k.soucet)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cream/70">{d.nazev}</dt>
              <dd className="font-semibold tabular-nums">
                {cenaDopravy ? kc(cenaDopravy) : "Zdarma"}
              </dd>
            </div>
            {p.cena > 0 && (
              <div className="flex justify-between">
                <dt className="text-cream/70">{p.nazev}</dt>
                <dd className="font-semibold tabular-nums">{kc(p.cena)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-cream/15 pt-4">
              <dt className="text-lg font-bold">Celkem s DPH</dt>
              <dd className="text-4xl font-extrabold tabular-nums text-lime">
                {kc(celkem)}
              </dd>
            </div>
          </dl>

          <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-snug text-cream/80">
            <input
              type="checkbox"
              required
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#B4D777]"
            />
            Potvrzuji, že je mi 18 let nebo více, a souhlasím s obchodními
            podmínkami. Beru na vědomí, že zásilku převezme jen dospělá osoba po
            ověření věku.
          </label>

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-lime py-4 text-lg font-bold text-pine transition-transform hover:scale-[1.02]"
          >
            Objednat a zaplatit
          </button>
        </aside>
      </form>
    </div>
  );
}

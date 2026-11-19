import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CekaNaPrevod from "@/components/obchod/CekaNaPrevod";
import Navrh from "@/components/obchod/Navrh";
import QrKod from "@/components/obchod/QrKod";
import { DOPRAVY, PLATBY, radky, type Objednavka } from "@/lib/obchod/objednavka";
import { kc } from "@/lib/obchod/produkty";
import { spayd, ucetCesky } from "@/lib/obchod/qr";
import { nastaveni } from "@/lib/obchod/server/nastaveni";
import { nacti } from "@/lib/obchod/server/uloziste";
import { cz } from "@/lib/obchod/typo";
import { branches } from "@/lib/pobocky";

export const metadata: Metadata = { title: "Stav objednávky" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ cislo: string }> };

// Účet, který žádná banka nepřijme (neplatný kontrolní součet). Používá se
// jen v návrhu, dokud není nastavený skutečný — aby ukázkový QR kód nikdy
// neposlal peníze na cizí účet.
const UKAZKOVY_IBAN = "CZ0000000000000000000000";

function hlava(o: Objednavka): { nadpis: string; text: string; dobre: boolean } {
  const { id, stav } = o.platba;
  if (id === "karta" && stav === "zaplaceno")
    return {
      nadpis: "Zaplaceno, jdeme balit",
      text: "Díky. Objednávku předáme dopravci nejpozději další pracovní den.",
      dobre: true,
    };
  if (id === "karta" && stav === "zruseno")
    return {
      nadpis: "Platba neprošla",
      text: "Nic se nestrhlo. Objednávku držíme, stačí to zkusit znovu.",
      dobre: false,
    };
  if (id === "karta")
    return {
      nadpis: "Čekáme na platbu",
      text: "Objednávku máme, jen ještě není zaplacená.",
      dobre: false,
    };
  if (id === "prevod" && stav === "zaplaceno")
    return {
      nadpis: "Platba dorazila, jdeme balit",
      text: "Díky. Objednávku předáme dopravci nejpozději další pracovní den.",
      dobre: true,
    };
  if (id === "prevod")
    return {
      nadpis: "Máme to, zbývá zaplatit",
      text: "Naskenujte kód v bankovní aplikaci. Jak platba dorazí, začneme balit.",
      dobre: true,
    };
  if (id === "prodejna")
    return {
      nadpis: "Rezervováno",
      text: "Zboží odložíme stranou. Zaplatíte až u pultu.",
      dobre: true,
    };
  return {
    nadpis: "Máme to, jdeme balit",
    text: "Zaplatíte při převzetí. Objednávku předáme dopravci nejpozději další pracovní den.",
    dobre: true,
  };
}

function kroky(o: Objednavka) {
  const prodejna = branches.find((b) => b.slug === o.doprava.misto);
  const platba =
    o.platba.id === "karta"
      ? o.platba.stav === "zaplaceno"
        ? { hotovo: true, nadpis: "Zaplaceno kartou", text: "Doklad o platbě přijde e-mailem." }
        : { hotovo: false, nadpis: "Čeká na platbu kartou", text: "Dokud není zaplaceno, zboží neodchází." }
      : o.platba.id === "prevod" && o.platba.stav === "zaplaceno"
        ? { hotovo: true, nadpis: "Zaplaceno převodem", text: "Platbu jsme na účtu našli a přiřadili k objednávce." }
      : o.platba.id === "prevod"
        ? { hotovo: false, nadpis: "Čeká na převod", text: "Okamžitá platba dorazí hned, běžný převod do druhého dne." }
        : o.platba.id === "prodejna"
          ? { hotovo: false, nadpis: "Platba až na prodejně", text: `${kc(o.ceny.celkem)} hotově nebo kartou.` }
          : { hotovo: false, nadpis: "Platba při převzetí", text: `${kc(o.ceny.celkem)} hotově nebo kartou u dopravce.` };

  const vek =
    o.vek.zpusob === "online"
      ? { hotovo: true, nadpis: "Věk ověřen", text: `V pokladně, ${o.vek.metoda}. Doklad si k převzetí vezměte i tak.` }
      : o.vek.zpusob === "prodejna"
        ? { hotovo: false, nadpis: "Věk ověří obsluha", text: "Vezměte si občanku nebo jiný doklad s fotkou." }
        : { hotovo: false, nadpis: "Doklad při převzetí", text: "Zásilku vydají jen dospělému, který ukáže doklad." };

  const doprava =
    o.doprava.id === "odber"
      ? {
          hotovo: false,
          nadpis: `Vyzvednutí: ${prodejna?.city ?? "prodejna"}`,
          text: `${prodejna?.address ?? ""} · ${prodejna?.hours ?? ""}. Až bude nachystáno, napíšeme.`,
        }
      : o.doprava.id === "kuryr"
        ? {
            hotovo: false,
            nadpis: "Kurýr na adresu",
            text: `${o.doprava.adresa?.ulice}, ${o.doprava.adresa?.psc.replace(/^(\d{3})(\d{2})$/, "$1 $2")} ${o.doprava.adresa?.mesto}. O doručení dá vědět dopravce.`,
          }
        : {
            hotovo: false,
            nadpis: "Výdejní místo Zásilkovny",
            text: `${o.doprava.misto}. Až tam balík bude, přijde vám zpráva.`,
          };

  return [platba, vek, doprava];
}

function Nenalezeno() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-20 text-center">
      <div>
        <h1 className="text-5xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
          Tuhle objednávku tu nevidíme
        </h1>
        <p className="vyrovnat mt-5 text-lg text-ink-soft">
          Stav objednávky se ukáže jen v prohlížeči, ve kterém jste nakupovali.
          Všechno podstatné máte i v potvrzovacím e-mailu.
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

export default async function StavObjednavky({ params }: Props) {
  const o = await nacti((await params).cislo);
  if (!o) return <Nenalezeno />;

  const h = hlava(o);
  const r = radky(o.polozky);
  const doprava = DOPRAVY.find((d) => d.id === o.doprava.id)!;
  const platba = PLATBY.find((p) => p.id === o.platba.id)!;
  const kZaplaceni = o.platba.id === "karta" && o.platba.stav !== "zaplaceno";
  const iban = nastaveni.iban;

  return (
    <div className="mx-auto max-w-[86rem] px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div>
          <span
            className={`grid h-16 w-16 place-items-center rounded-full text-3xl font-extrabold ${
              h.dobre ? "bg-lime text-pine" : "bg-[#F4C7B8] text-[#5A1A0A]"
            }`}
            aria-hidden
          >
            {h.dobre ? "✓" : "!"}
          </span>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-forest">
            Objednávka č.&nbsp;{o.cislo}
          </p>
          <h1 className="mt-3 text-5xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-7xl">
            {h.nadpis}
          </h1>
          <p className="vyrovnat mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            {cz(h.text)}
          </p>

          {kZaplaceni && (
            <form action="/api/obchod/platba/znovu" method="post" className="mt-7">
              <input type="hidden" name="c" value={o.cislo} />
              <button className="rounded-full bg-pine px-8 py-4 text-lg font-bold text-cream transition-colors hover:bg-forest-dark">
                Zaplatit kartou · {kc(o.ceny.celkem)}
              </button>
            </form>
          )}

          {o.platba.id === "prevod" && o.platba.stav !== "zaplaceno" && (
            <section className="mt-8 grid gap-6 rounded-[2rem] bg-cream-dark p-6 sm:grid-cols-[auto_1fr] sm:items-center md:p-8">
              <div className="relative mx-auto w-52 overflow-hidden rounded-2xl sm:mx-0">
                <QrKod
                  text={spayd({
                    iban: iban ?? UKAZKOVY_IBAN,
                    castka: o.ceny.celkem,
                    vs: o.cislo,
                    zprava: `Objednavka ${o.cislo}`,
                  })}
                  popis="QR kód s platbou"
                  className="block h-52 w-52"
                />
                {!iban && (
                  <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-ink py-1.5 text-center text-sm font-extrabold uppercase tracking-widest text-lime">
                    Ukázka
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                  QR platba
                </h2>
                <dl className="mt-3 space-y-1.5 text-base">
                  {[
                    ["Účet", iban ? ucetCesky(iban) : "doplníme před spuštěním"],
                    ["Částka", kc(o.ceny.celkem)],
                    ["Variabilní symbol", o.cislo],
                  ].map(([a, b]) => (
                    <div key={a} className="flex justify-between gap-6">
                      <dt className="text-ink-muted">{a}</dt>
                      <dd className="text-right font-bold tabular-nums">{b}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 !text-sm !leading-snug text-ink-muted">
                  Bez variabilního symbolu platbu k objednávce nepřiřadíme.
                </p>
                <CekaNaPrevod cislo={o.cislo} />
                {!iban && (
                  <Navrh className="mt-3">
                    kód je jen na ukázku, banka ho odmítne. Ostrý se objeví po
                    doplnění čísla účtu.
                  </Navrh>
                )}
              </div>
            </section>
          )}

          <ol className="mt-10 border-t border-ink/10">
            {kroky(o).map((k) => (
              <li
                key={k.nadpis}
                className="flex gap-4 border-b border-ink/10 py-5"
              >
                <span
                  aria-hidden
                  className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold ${
                    k.hotovo
                      ? "bg-pine text-lime"
                      : "border-2 border-ink/20 text-ink-muted"
                  }`}
                >
                  {k.hotovo ? "✓" : "…"}
                </span>
                <div>
                  <h2 className="text-xl font-bold">{k.nadpis}</h2>
                  <p className="mt-0.5 !text-base text-ink-soft">{cz(k.text)}</p>
                </div>
              </li>
            ))}
          </ol>

          <Navrh className="mt-6">
            potvrzovací e-maily se zatím neposílají a objednávka se drží jen
            v tomhle prohlížeči.
          </Navrh>
        </div>

        <aside className="h-fit rounded-[2rem] bg-pine p-6 text-cream md:p-8 lg:sticky lg:top-24">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight">
            Co jste objednali
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
                      className="object-contain p-1"
                    />
                  )}
                  <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-lime px-1 text-xs font-extrabold tabular-nums text-pine">
                    {x.ks}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="!text-base font-bold !leading-snug">
                    {x.produkt.nazev}
                  </p>
                  <p className="!text-sm text-cream/60">{x.v.nazev}</p>
                </div>
                <span className="text-base font-bold tabular-nums">
                  {kc(x.ks * x.v.cena)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-cream/15 pt-5 text-base">
            <div className="flex justify-between gap-4">
              <dt className="text-cream/70">Zboží</dt>
              <dd className="font-semibold tabular-nums">{kc(o.ceny.zbozi)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-cream/70">{doprava.nazev}</dt>
              <dd className="font-semibold tabular-nums">
                {o.ceny.doprava ? kc(o.ceny.doprava) : "Zdarma"}
              </dd>
            </div>
            {o.ceny.platba > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-cream/70">
                  Platba {platba.nazev.toLowerCase()}
                </dt>
                <dd className="font-semibold tabular-nums">
                  {kc(o.ceny.platba)}
                </dd>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-4 border-t border-cream/15 pt-4">
              <dt className="text-lg font-bold">Celkem s DPH</dt>
              <dd className="text-4xl font-extrabold tabular-nums text-lime">
                {kc(o.ceny.celkem)}
              </dd>
            </div>
          </dl>

          <p className="mt-6 border-t border-cream/15 pt-5 !text-base !leading-snug text-cream/75">
            {o.zakaznik.jmeno} {o.zakaznik.prijmeni}
            <br />
            {o.zakaznik.email} · {o.zakaznik.telefon}
          </p>
          <Link
            href="/obchod/sortiment"
            className="mt-6 block rounded-full border border-cream/30 py-3.5 text-center text-base font-bold transition-colors hover:bg-cream hover:text-pine"
          >
            Zpět do obchodu
          </Link>
        </aside>
      </div>
    </div>
  );
}

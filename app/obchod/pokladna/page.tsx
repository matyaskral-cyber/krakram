"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useKosik } from "@/components/obchod/Kosik";
import Navrh from "@/components/obchod/Navrh";
import OvereniVeku, { type StavVeku } from "@/components/obchod/OvereniVeku";
import VyberVydejny from "@/components/obchod/VyberVydejny";
import {
  DOPRAVY,
  platbyPro,
  spocitej,
  type DopravaId,
  type PlatbaId,
  type Pozadavek,
} from "@/lib/obchod/objednavka";
import { DOPRAVA_ZDARMA_OD, kc } from "@/lib/obchod/produkty";
import { branches } from "@/lib/pobocky";

const PRODEJNY = branches.filter((b) => b.status === "open");

type Formular = {
  doprava: DopravaId;
  platba: PlatbaId;
  pobocka: string;
  misto: string;
  jmeno: string;
  prijmeni: string;
  email: string;
  telefon: string;
  ulice: string;
  mesto: string;
  psc: string;
  poznamka: string;
};

const PRAZDNY: Formular = {
  doprava: "vydejna",
  platba: "karta",
  pobocka: PRODEJNY[0]?.slug ?? "",
  misto: "",
  jmeno: "",
  prijmeni: "",
  email: "",
  telefon: "",
  ulice: "",
  mesto: "",
  psc: "",
  poznamka: "",
};

// Rozepsaná pokladna přežije obnovení stránky i odskok na ověření věku.
const KLIC = "krakram-pokladna";

const TLACITKO: Record<PlatbaId, string> = {
  karta: "Objednat a zaplatit",
  prevod: "Objednat a zaplatit převodem",
  dobirka: "Objednat s platbou při převzetí",
  prodejna: "Rezervovat na prodejně",
};

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
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold">{nazev}</span>
        {popis && (
          <span className="block text-sm leading-snug text-ink-muted">
            {popis}
          </span>
        )}
      </span>
      <span className="shrink-0 text-base font-bold tabular-nums">
        {cena ? kc(cena) : "Zdarma"}
      </span>
    </button>
  );
}

function Krok({
  n,
  nadpis,
  id,
  children,
}: {
  n: number;
  nadpis: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-ink/10 py-8 first:border-0 first:pt-0"
    >
      <h2 className="flex items-center gap-3 text-2xl font-extrabold uppercase tracking-tight">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine text-sm tabular-nums text-lime">
          {n}
        </span>
        {nadpis}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Prazdno({ nadpis, text }: { nadpis: string; text?: string }) {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-20 text-center">
      <div>
        <h1 className="text-5xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
          {nadpis}
        </h1>
        {text ? (
          <p className="mt-5 text-lg text-ink-soft">{text}</p>
        ) : (
          <Link
            href="/obchod/sortiment"
            className="mt-8 inline-block rounded-full bg-pine px-8 py-4 text-lg font-bold text-cream"
          >
            Do sortimentu
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Pokladna() {
  const k = useKosik();
  const [f, setF] = useState<Formular>(PRAZDNY);
  const [obnoveno, setObnoveno] = useState(false);
  const [vek, setVek] = useState<StavVeku | null>(null);
  const [souhlas, setSouhlas] = useState(false);
  const [chyba, setChyba] = useState("");
  const [odesila, setOdesila] = useState(false);
  const [hotovo, setHotovo] = useState(false);

  useEffect(() => {
    try {
      const ulozeno = sessionStorage.getItem(KLIC);
      if (ulozeno) setF({ ...PRAZDNY, ...JSON.parse(ulozeno) });
    } catch {}
    setObnoveno(true);
    fetch("/api/obchod/vek")
      .then((r) => r.json())
      .then(setVek)
      .catch(() => setVek({ overeno: false, ukazka: true }));
  }, []);

  useEffect(() => {
    if (!obnoveno) return;
    try {
      sessionStorage.setItem(KLIC, JSON.stringify(f));
    } catch {}
  }, [f, obnoveno]);

  const zmen = (cast: Partial<Formular>) => {
    setChyba("");
    setF((stare) => {
      const nove = { ...stare, ...cast };
      // Platba, kterou nová doprava neumí, se přepne na první dostupnou.
      const mozne = platbyPro(nove.doprava);
      if (!mozne.some((p) => p.id === nove.platba)) nove.platba = mozne[0].id;
      return nove;
    });
  };

  const v = useMemo(
    () => spocitej(k.polozky, f.doprava, f.platba),
    [k.polozky, f.doprava, f.platba],
  );

  if (hotovo) return <Prazdno nadpis="Vteřinku" text="Zakládáme objednávku…" />;
  if (!k.nacteno) return <div className="min-h-[60vh]" />;
  if (v.radky.length === 0) return <Prazdno nadpis="Košík je prázdný" />;

  const vstup = (klic: keyof Formular) => ({
    value: f[klic],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      zmen({ [klic]: e.target.value }),
  });

  const odesli = async (e: React.FormEvent) => {
    e.preventDefault();
    if (v.overitVek && !vek?.overeno) {
      setChyba("Ještě zbývá ověřit věk, je to krok 4.");
      document.getElementById("vek")?.scrollIntoView({ block: "center" });
      return;
    }
    if (f.doprava === "vydejna" && !f.misto.trim()) {
      setChyba("Vyberte prosím výdejní místo.");
      document.getElementById("doprava")?.scrollIntoView({ block: "start" });
      return;
    }
    setOdesila(true);
    setChyba("");
    const pozadavek: Pozadavek = {
      polozky: k.polozky,
      doprava: f.doprava,
      platba: f.platba,
      misto: f.doprava === "odber" ? f.pobocka : f.misto,
      adresa:
        f.doprava === "kuryr"
          ? { ulice: f.ulice, mesto: f.mesto, psc: f.psc }
          : undefined,
      zakaznik: {
        jmeno: f.jmeno,
        prijmeni: f.prijmeni,
        email: f.email,
        telefon: f.telefon,
      },
      poznamka: f.poznamka,
      souhlas,
    };
    try {
      const odpoved = await fetch("/api/obchod/objednavka", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(pozadavek),
      });
      const data = await odpoved.json();
      if (!odpoved.ok) throw new Error(data.chyba ?? "Objednávku se nepodařilo odeslat.");
      setHotovo(true);
      k.vyprazdni();
      sessionStorage.removeItem(KLIC);
      window.location.assign(data.dalsi);
    } catch (err) {
      setChyba(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "Nepodařilo se spojit se serverem. Zkuste to prosím znovu.",
      );
      setOdesila(false);
    }
  };

  return (
    <div className="mx-auto max-w-[86rem] px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16">
      <h1 className="text-5xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-8xl">
        Pokladna
      </h1>

      <form
        onSubmit={odesli}
        className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16"
      >
        <div>
          <Krok n={1} nadpis="Doprava" id="doprava">
            <div className="grid gap-2">
              {DOPRAVY.map((x) => (
                <Volba
                  key={x.id}
                  aktivni={x.id === f.doprava}
                  vyber={() => zmen({ doprava: x.id })}
                  nazev={x.nazev}
                  popis={x.popis}
                  cena={v.zbozi >= DOPRAVA_ZDARMA_OD ? 0 : x.cena}
                />
              ))}
            </div>

            {f.doprava === "vydejna" && (
              <VyberVydejny
                misto={f.misto}
                zmen={(misto) => zmen({ misto })}
                trida={pole}
              />
            )}

            {f.doprava === "kuryr" && (
              <div className="mt-3 grid gap-3 sm:grid-cols-[2fr_1fr]">
                <input
                  className={`${pole} sm:col-span-2`}
                  placeholder="Ulice a číslo"
                  autoComplete="street-address"
                  required
                  maxLength={80}
                  {...vstup("ulice")}
                />
                <input
                  className={pole}
                  placeholder="Město"
                  autoComplete="address-level2"
                  required
                  maxLength={60}
                  {...vstup("mesto")}
                />
                <input
                  className={pole}
                  placeholder="PSČ"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  pattern="\d{3} ?\d{2}"
                  title="PSČ má pět číslic"
                  required
                  {...vstup("psc")}
                />
              </div>
            )}

            {f.doprava === "odber" && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {PRODEJNY.map((b) => (
                  <button
                    key={b.slug}
                    type="button"
                    onClick={() => zmen({ pobocka: b.slug })}
                    aria-pressed={b.slug === f.pobocka}
                    className={`rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
                      b.slug === f.pobocka
                        ? "border-pine bg-pine text-cream"
                        : "border-ink/10 bg-white/50 hover:border-ink/30"
                    }`}
                  >
                    <span className="block text-base font-bold">{b.city}</span>
                    <span className="block text-sm leading-snug opacity-70">
                      {b.address}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </Krok>

          <Krok n={2} nadpis="Kontakt">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className={pole}
                placeholder="Jméno"
                autoComplete="given-name"
                required
                maxLength={40}
                {...vstup("jmeno")}
              />
              <input
                className={pole}
                placeholder="Příjmení"
                autoComplete="family-name"
                required
                maxLength={40}
                {...vstup("prijmeni")}
              />
              <input
                className={pole}
                type="email"
                placeholder="E-mail"
                autoComplete="email"
                required
                maxLength={80}
                {...vstup("email")}
              />
              <input
                className={pole}
                type="tel"
                placeholder="Telefon"
                autoComplete="tel"
                required
                maxLength={20}
                {...vstup("telefon")}
              />
            </div>
            <p className="mt-3 !text-sm text-ink-muted">
              Na e-mail pošleme potvrzení, na telefon zprávu od dopravce.
            </p>
          </Krok>

          <Krok n={3} nadpis="Platba">
            <div className="grid gap-2">
              {platbyPro(f.doprava).map((x) => (
                <Volba
                  key={x.id}
                  aktivni={x.id === v.p.id}
                  vyber={() => zmen({ platba: x.id })}
                  nazev={x.nazev}
                  popis={x.popis}
                  cena={x.cena}
                />
              ))}
            </div>
          </Krok>

          <Krok n={4} nadpis="Ověření věku" id="vek">
            <OvereniVeku
              stav={vek}
              zmen={(novy) => {
                setVek(novy);
                setChyba("");
              }}
              zbozi={v.vekZbozi.map((x) => x.produkt.nazev)}
              // zboží s ověřením v košíku je, ale platí se až u pultu
              naProdejne={v.vekZbozi.length > 0 && !v.overitVek}
            />
          </Krok>
        </div>

        <aside className="h-fit rounded-[2rem] bg-pine p-6 text-cream md:p-8 lg:sticky lg:top-24">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight">
            Vaše objednávka
          </h2>
          <ul className="mt-5 space-y-4">
            {v.radky.map((x) => (
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
              <dd className="font-semibold tabular-nums">{kc(v.zbozi)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-cream/70">{v.d.nazev}</dt>
              <dd className="font-semibold tabular-nums">
                {v.doprava ? kc(v.doprava) : "Zdarma"}
              </dd>
            </div>
            {v.platba > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-cream/70">Platba {v.p.nazev.toLowerCase()}</dt>
                <dd className="font-semibold tabular-nums">{kc(v.platba)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-4 border-t border-cream/15 pt-4">
              <dt className="text-lg font-bold">Celkem s DPH</dt>
              <dd className="text-4xl font-extrabold tabular-nums text-lime">
                {kc(v.celkem)}
              </dd>
            </div>
          </dl>

          <textarea
            value={f.poznamka}
            onChange={(e) => zmen({ poznamka: e.target.value })}
            placeholder="Poznámka k objednávce (nepovinné)"
            maxLength={300}
            rows={2}
            className="mt-6 w-full resize-none rounded-2xl border border-cream/20 bg-cream/10 px-4 py-3 text-base text-cream outline-none placeholder:text-cream/50 focus:border-lime"
          />

          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-snug text-cream/80">
            <input
              type="checkbox"
              required
              checked={souhlas}
              onChange={(e) => setSouhlas(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#B4D777]"
            />
            <span>
              Je mi 18 nebo víc a souhlasím s{" "}
              <Link
                href="/obchodni-podminky"
                target="_blank"
                className="font-bold text-cream underline underline-offset-2"
              >
                obchodními podmínkami
              </Link>
              . Zásilku převezme jen dospělý, který ukáže doklad.
            </span>
          </label>

          {chyba && (
            <p
              role="alert"
              className="mt-4 rounded-2xl bg-[#F4C7B8] px-4 py-3 !text-base font-semibold !leading-snug text-[#5A1A0A]"
            >
              {chyba}
            </p>
          )}

          <button
            type="submit"
            disabled={odesila}
            className="mt-5 w-full rounded-full bg-lime px-4 py-4 text-lg font-bold text-pine transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            {odesila ? "Odesíláme…" : TLACITKO[v.p.id]}
          </button>
          <p className="mt-3 text-center !text-sm text-cream/60">
            {v.p.id === "prodejna"
              ? "Zboží vám podržíme tři pracovní dny."
              : "Odesláním vzniká objednávka zavazující k platbě."}
          </p>
          <Navrh tmavy className="mt-4">
            objednávka se zatím neukládá do skladu ani nikomu nepřijde e-mailem.
          </Navrh>
        </aside>
      </form>
    </div>
  );
}

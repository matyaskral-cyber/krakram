"use client";

import { useEffect, useRef, useState } from "react";
import Navrh from "./Navrh";

export type StavVeku = {
  overeno: boolean;
  kdy?: string;
  metoda?: string;
  // true = ostrá služba není zapnutá, ověření se jen předvádí
  ukazka: boolean;
  // veřejný klíč widgetu ostré služby
  klic?: string;
};

const datum = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("cs-CZ", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    : "";

const ZPUSOBY = [
  {
    id: "banka",
    nazev: "Bankovní identita",
    kratce: "Banka",
    popis:
      "Přihlásíte se do své banky stejně jako do bankovnictví a potvrdíte, že nám smí sdělit, jestli jste plnoletí. Je to stejná identita, kterou se hlásíte na úřady.",
    tlacitko: "Pokračovat do banky",
  },
  {
    id: "mojeid",
    nazev: "MojeID",
    kratce: "MojeID",
    popis:
      "Máte ověřený účet MojeID, kterým se hlásíte třeba na Portál občana? Přihlásíte se jím a je hotovo.",
    tlacitko: "Přihlásit se přes MojeID",
  },
  {
    id: "doklad",
    nazev: "Doklad totožnosti",
    kratce: "Doklad",
    popis:
      "Nahrajete fotku občanky nebo pasu. Služba z ní přečte datum narození, fotku hned smaže a nám pošle jen ano, nebo ne.",
    tlacitko: "Vybrat fotku dokladu",
  },
];

// Ostrý widget služby Ověř18 vložený přímo do stránky. Widget po ověření
// zapíše kód do skrytého pole „over18-response“; ten pošleme na server.
function Over18({
  klic,
  hotovo,
}: {
  klic: string;
  hotovo: (s: StavVeku) => void;
}) {
  const obal = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const skript = document.createElement("script");
    skript.src = "https://api.over18.cz/clientApi.js";
    skript.async = true;
    document.body.appendChild(skript);
    let odeslano = "";
    const hlidac = window.setInterval(async () => {
      const kod =
        document.querySelector<HTMLInputElement>('[name="over18-response"]')
          ?.value ?? "";
      if (!kod || kod === odeslano) return;
      odeslano = kod;
      const odpoved = await fetch("/api/obchod/vek/over18", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kod }),
      });
      const novy = await odpoved.json();
      if (novy.overeno) hotovo(novy);
    }, 1000);
    return () => {
      window.clearInterval(hlidac);
      skript.remove();
    };
  }, [hotovo]);
  return (
    <div ref={obal} className="mt-4">
      <div className="over18" data-apikey={klic} />
    </div>
  );
}

// Krok „Ověření věku“ v pokladně. Všechno se odehraje přímo tady ve stránce.
export default function OvereniVeku({
  stav,
  zmen,
  zbozi,
  naProdejne,
}: {
  stav: StavVeku | null;
  zmen: (s: StavVeku) => void;
  // názvy zboží v košíku, u kterého se věk ověřuje předem
  zbozi: string[];
  naProdejne: boolean;
}) {
  const [zpusob, setZpusob] = useState("banka");
  const [beh, setBeh] = useState(false);
  const [neproslo, setNeproslo] = useState(false);
  const [soubor, setSoubor] = useState("");

  if (zbozi.length === 0) return null;

  if (naProdejne)
    return (
      <p className="!text-base text-ink-soft">
        {zbozi.length === 1 ? zbozi[0] : "Část košíku"} vydáme jen tomu, komu
        už bylo 18. Platíte až u pultu, takže věk ověří obsluha. Vezměte si
        občanku nebo jiný doklad s fotkou.
      </p>
    );

  if (!stav) return <div className="h-24 animate-pulse rounded-2xl bg-ink/5" />;

  if (stav.overeno)
    return (
      <div className="flex items-start gap-4 rounded-2xl border-2 border-pine bg-white px-4 py-4">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine font-extrabold text-lime"
        >
          ✓
        </span>
        <div>
          <p className="!text-base font-bold">Věk máte ověřený</p>
          <p className="!text-sm !leading-snug text-ink-muted">
            {stav.metoda}, {datum(stav.kdy)}. Při dalším nákupu z tohohle
            zařízení už se ptát nebudeme.
          </p>
        </div>
      </div>
    );

  const over = async (vysledek: "ano" | "ne") => {
    setBeh(true);
    try {
      const odpoved = await fetch("/api/obchod/vek/test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ vysledek, metoda: zpusob }),
      });
      const novy: StavVeku = await odpoved.json();
      setNeproslo(!novy.overeno);
      zmen(novy);
    } finally {
      setBeh(false);
    }
  };

  const z = ZPUSOBY.find((x) => x.id === zpusob)!;

  return (
    <div className="rounded-2xl border-2 border-ink/10 bg-white/50 p-4 md:p-5">
      <p className="!text-base font-bold">
        {zbozi.length === 1
          ? `${zbozi[0]} prodáme jen tomu, komu už bylo 18.`
          : "Část košíku prodáme jen tomu, komu už bylo 18."}
      </p>
      <p className="mt-1 !text-base !leading-snug text-ink-soft">
        Ověříte to tady, zabere to asi minutu a stačí to jednou. Nechcete
        nic ověřovat online? Zvolte vyzvednutí a platbu na prodejně, tam
        stačí ukázat doklad u pultu.
      </p>

      {stav.klic ? (
        <Over18 klic={stav.klic} hotovo={zmen} />
      ) : (
        <>
          <div
            role="tablist"
            aria-label="Způsob ověření"
            className="mt-4 grid grid-cols-3 gap-1 rounded-full bg-ink/5 p-1"
          >
            {ZPUSOBY.map((x) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={x.id === zpusob}
                onClick={() => {
                  setZpusob(x.id);
                  setNeproslo(false);
                }}
                className={`rounded-full px-2 py-2.5 text-sm font-bold transition-colors sm:text-base ${
                  x.id === zpusob ? "bg-pine text-cream" : "hover:bg-ink/5"
                }`}
              >
                <span className="sm:hidden">{x.kratce}</span>
                <span className="hidden sm:inline">{x.nazev}</span>
              </button>
            ))}
          </div>

          <div role="tabpanel" className="mt-4">
            <p className="!text-base !leading-snug text-ink-soft">{z.popis}</p>

            {zpusob === "doklad" ? (
              <label className="mt-4 flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-ink/25 px-4 py-6 text-center transition-colors hover:border-pine">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  disabled={beh}
                  onChange={(e) => {
                    // V návrhu fotka neopouští prohlížeč, bere se jen její název.
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setSoubor(f.name);
                    over("ano");
                  }}
                />
                <span className="text-base font-bold">
                  {beh ? "Čteme doklad…" : soubor || z.tlacitko}
                </span>
                <span className="text-sm text-ink-muted">
                  Přední strana, celá a ostrá. Na mobilu ji rovnou vyfotíte.
                </span>
              </label>
            ) : (
              <button
                type="button"
                disabled={beh}
                onClick={() => over("ano")}
                className="mt-4 rounded-full bg-pine px-7 py-3.5 text-base font-bold text-cream transition-colors hover:bg-forest-dark disabled:opacity-60"
              >
                {beh ? "Ověřujeme…" : z.tlacitko}
              </button>
            )}
          </div>

          {neproslo && (
            <p
              role="alert"
              className="mt-4 rounded-2xl bg-[#F4C7B8] px-4 py-3 !text-base font-semibold !leading-snug text-[#5A1A0A]"
            >
              Ověření neprošlo. Zkuste jiný způsob, nebo se stavte na prodejně.
            </p>
          )}

          <Navrh className="mt-4">
            ukázka. Všechny tři způsoby rovnou projdou a fotka dokladu se
            nikam neposílá.{" "}
            <button
              type="button"
              disabled={beh}
              onClick={() => over("ne")}
              className="font-bold underline underline-offset-2"
            >
              Vyzkoušet neúspěch
            </button>
          </Navrh>
        </>
      )}

      <p className="mt-4 !text-sm !leading-snug text-ink-muted">
        Dozvíme se jen to, že jste plnoletí. Jméno, datum narození ani číslo
        dokladu si neukládáme.
      </p>
    </div>
  );
}

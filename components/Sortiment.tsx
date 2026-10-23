"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { hezkyNazev, type Produkt } from "@/lib/sklad";

const VSE = "Vše";

export default function Sortiment({ produkty }: { produkty: Produkt[] }) {
  const kategorie = useMemo(
    () => [VSE, ...Array.from(new Set(produkty.map((p) => p.kategorie)))],
    [produkty]
  );
  const [vybrana, setVybrana] = useState(VSE);
  const [jenSkladem, setJenSkladem] = useState(false);

  const viditelne = produkty.filter(
    (p) => (vybrana === VSE || p.kategorie === vybrana) && (!jenSkladem || p.skladem)
  );
  const serazene = [...viditelne].sort((a, b) => Number(b.skladem) - Number(a.skladem));
  const skupiny = Array.from(
    serazene.reduce((m, p) => {
      const klic = p.skupina ? `${p.kategorie} · ${p.skupina}` : p.kategorie;
      m.set(klic, [...(m.get(klic) ?? []), p]);
      return m;
    }, new Map<string, Produkt[]>())
  );

  if (produkty.length === 0) {
    return <p className="text-ink-muted">Na pobočce teď nemáme nic k zobrazení.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-10">
        {kategorie.map((k) => (
          <button
            key={k}
            onClick={() => setVybrana(k)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
              vybrana === k
                ? "bg-forest border-forest text-cream"
                : "border-border-green text-ink-soft hover:border-forest hover:text-forest"
            }`}
          >
            {k}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm font-semibold text-ink-soft cursor-pointer select-none">
          <input
            type="checkbox"
            checked={jenSkladem}
            onChange={(e) => setJenSkladem(e.target.checked)}
            className="w-4 h-4 accent-forest"
          />
          Jen skladem
        </label>
      </div>

      {skupiny.length === 0 && (
        <p className="text-ink-muted">V téhle kategorii teď nic skladem nemáme.</p>
      )}

      {skupiny.map(([nazev, polozky]) => (
        <section key={nazev} className="mb-12">
          <h2 className="text-lg font-bold text-ink mb-5">{nazev}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {polozky.map((p) => (
              <Karta key={p.id} p={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Karta({ p }: { p: Produkt }) {
  const nazev = hezkyNazev(p.nazev);
  const [fotkaChybi, setFotkaChybi] = useState(false);
  return (
    <article
      className="group flex flex-col"
    >
      <div
        className={`relative aspect-square transition-transform duration-300 group-hover:-translate-y-1 ${
          p.skladem ? "" : "grayscale opacity-40"
        }`}
      >
        {p.obrazek && !fotkaChybi ? (
          <Image
            src={p.obrazek}
            alt={nazev}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-1"
            onError={() => setFotkaChybi(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src="/logo.png" alt="" width={120} height={120} className="w-1/2 h-auto opacity-20" />
          </div>
        )}
      </div>
      <div className="px-1 pt-2 flex flex-col gap-2 grow">
        <h3 className={`text-sm md:text-base font-semibold leading-snug ${p.skladem ? "text-ink" : "text-ink-muted"}`}>
          {nazev}
        </h3>
        <span className="text-ink-muted text-sm">{p.gramaz ?? ""}</span>
        {p.skladem ? (
          <span className="mt-auto inline-flex items-center justify-center gap-1.5 text-sm font-bold text-cream bg-forest px-3 py-2 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Skladem
          </span>
        ) : (
          <span className="mt-auto inline-flex items-center justify-center gap-1.5 text-sm font-bold text-ink-muted border-2 border-dashed border-ink-muted/40 px-3 py-1.5 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
            Vyprodáno
          </span>
        )}
      </div>
    </article>
  );
}

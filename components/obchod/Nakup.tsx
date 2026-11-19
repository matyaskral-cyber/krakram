"use client";

import { useState } from "react";
import { kc, type Produkt } from "@/lib/obchod/produkty";
import { Pocitadlo, useKosik } from "./Kosik";

// Výběr varianty, počet kusů a tlačítko do košíku na detailu produktu.
export default function Nakup({ produkt }: { produkt: Produkt }) {
  const { pridej } = useKosik();
  const [varianta, setVarianta] = useState(produkt.varianty[0].id);
  const [ks, setKs] = useState(1);
  const v = produkt.varianty.find((x) => x.id === varianta)!;

  return (
    <div>
      <p className="text-4xl font-extrabold tabular-nums md:text-5xl">
        {kc(v.cena)}
        <span className="ml-3 text-base font-medium text-ink-muted">s DPH</span>
      </p>

      {produkt.varianty.length > 1 && (
        <div className="mt-6">
          <p className="text-sm font-bold uppercase tracking-widest text-ink-muted">
            Balení
          </p>
          <div className="mt-2 flex gap-2">
            {produkt.varianty.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setVarianta(x.id)}
                aria-pressed={x.id === varianta}
                className={`rounded-2xl border-2 px-6 py-3 text-left transition-colors ${
                  x.id === varianta
                    ? "border-pine bg-pine text-cream"
                    : "border-ink/15 hover:border-ink/40"
                }`}
              >
                <span className="block text-lg font-extrabold">{x.nazev}</span>
                <span className="block text-sm tabular-nums opacity-70">
                  {kc(x.cena)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Pocitadlo ks={ks} zmen={(n) => setKs(Math.max(1, Math.min(20, n)))} />
        <button
          type="button"
          onClick={() => pridej(produkt.slug, varianta, ks)}
          className="flex-1 whitespace-nowrap rounded-full bg-lime px-4 text-base font-bold text-pine sm:px-6 sm:text-lg transition-transform hover:scale-[1.02] active:scale-100"
        >
          Do košíku · <span className="tabular-nums">{kc(v.cena * ks)}</span>
        </button>
      </div>
    </div>
  );
}

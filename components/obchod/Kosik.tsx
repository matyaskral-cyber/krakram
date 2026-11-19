"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { MAX_KS, radky, type Polozka } from "@/lib/obchod/objednavka";
import { DOPRAVA_ZDARMA_OD, kc } from "@/lib/obchod/produkty";

export { radky };

type Stav = {
  polozky: Polozka[];
  // košík už je načtený z prohlížeče (do té doby je prázdný jen naoko)
  nacteno: boolean;
  pocet: number;
  soucet: number;
  otevreno: boolean;
  otevri: () => void;
  zavri: () => void;
  pridej: (slug: string, varianta: string, ks?: number) => void;
  nastav: (slug: string, varianta: string, ks: number) => void;
  vyprazdni: () => void;
};

const Ctx = createContext<Stav | null>(null);
const KLIC = "krakram-kosik";

export function useKosik() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useKosik mimo KosikProvider");
  return s;
}

export function KosikProvider({ children }: { children: React.ReactNode }) {
  const [polozky, setPolozky] = useState<Polozka[]>([]);
  const [nacteno, setNacteno] = useState(false);
  const [otevreno, setOtevreno] = useState(false);

  useEffect(() => {
    try {
      const ulozeno = localStorage.getItem(KLIC);
      if (ulozeno) setPolozky(JSON.parse(ulozeno));
    } catch {}
    setNacteno(true);
  }, []);

  useEffect(() => {
    if (!nacteno) return;
    try {
      localStorage.setItem(KLIC, JSON.stringify(polozky));
    } catch {}
  }, [polozky, nacteno]);

  const stav = useMemo<Stav>(() => {
    const r = radky(polozky);
    return {
      polozky,
      nacteno,
      pocet: r.reduce((a, x) => a + x.ks, 0),
      soucet: r.reduce((a, x) => a + x.ks * x.v.cena, 0),
      otevreno,
      otevri: () => setOtevreno(true),
      zavri: () => setOtevreno(false),
      pridej: (slug, varianta, ks = 1) => {
        setPolozky((stare) => {
          const je = stare.find(
            (p) => p.slug === slug && p.varianta === varianta,
          );
          return je
            ? stare.map((p) =>
                p === je ? { ...p, ks: Math.min(p.ks + ks, MAX_KS) } : p,
              )
            : [...stare, { slug, varianta, ks }];
        });
        setOtevreno(true);
      },
      nastav: (slug, varianta, ks) =>
        setPolozky((stare) =>
          ks <= 0
            ? stare.filter((p) => !(p.slug === slug && p.varianta === varianta))
            : stare.map((p) =>
                p.slug === slug && p.varianta === varianta
                  ? { ...p, ks: Math.min(ks, MAX_KS) }
                  : p,
              ),
        ),
      vyprazdni: () => setPolozky([]),
    };
  }, [polozky, otevreno, nacteno]);

  return (
    <Ctx.Provider value={stav}>
      {children}
      <Supl />
    </Ctx.Provider>
  );
}

export function Pocitadlo({
  ks,
  zmen,
  maly,
}: {
  ks: number;
  zmen: (ks: number) => void;
  maly?: boolean;
}) {
  const t = maly ? "h-8 w-8 text-base" : "h-12 w-12 text-xl";
  return (
    <div className="inline-flex items-center rounded-full border border-ink/15 bg-white/60">
      <button
        type="button"
        aria-label="Ubrat kus"
        onClick={() => zmen(ks - 1)}
        className={`${t} rounded-full font-medium hover:bg-ink/5`}
      >
        −
      </button>
      <span
        className={`${maly ? "w-6 text-sm" : "w-8"} text-center font-semibold tabular-nums`}
      >
        {ks}
      </span>
      <button
        type="button"
        aria-label="Přidat kus"
        onClick={() => zmen(ks + 1)}
        className={`${t} rounded-full font-medium hover:bg-ink/5`}
      >
        +
      </button>
    </div>
  );
}

function Supl() {
  const k = useKosik();
  const r = radky(k.polozky);
  const zbyva = Math.max(0, DOPRAVA_ZDARMA_OD - k.soucet);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && k.zavri();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = k.otevreno ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [k]);

  return (
    <div
      className={`fixed inset-0 z-[90] ${k.otevreno ? "" : "pointer-events-none"}`}
      aria-hidden={!k.otevreno}
    >
      <div
        onClick={k.zavri}
        className={`absolute inset-0 bg-pine/50 backdrop-blur-sm transition-opacity duration-300 ${
          k.otevreno ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Košík"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[26rem] flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out sm:rounded-l-[2rem] ${
          k.otevreno ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Košík{" "}
            <span className="text-ink-muted font-medium tabular-nums">
              ({k.pocet})
            </span>
          </h2>
          <button
            type="button"
            onClick={k.zavri}
            aria-label="Zavřít košík"
            className="grid h-10 w-10 place-items-center rounded-full bg-ink/5 text-xl hover:bg-ink/10"
          >
            ×
          </button>
        </div>

        {r.length > 0 && (
          <div className="px-6 pb-4">
            <p className="mb-2 text-sm font-medium text-ink-soft">
              {zbyva > 0 ? (
                <>
                  Do dopravy zdarma zbývá{" "}
                  <strong className="tabular-nums">{kc(zbyva)}</strong>
                </>
              ) : (
                "Dopravu máte zdarma."
              )}
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-forest transition-all duration-500"
                style={{
                  width: `${Math.min(100, (k.soucet / DOPRAVA_ZDARMA_OD) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {r.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center pb-20 text-center">
              <p className="text-xl font-bold">Zatím tu nic není</p>
              <p className="mt-2 text-base text-ink-muted">
                Vyberte si v sortimentu.
              </p>
              <Link
                href="/obchod/sortiment"
                onClick={k.zavri}
                className="mt-6 rounded-full bg-pine px-6 py-3 text-base font-semibold text-cream hover:bg-forest-dark"
              >
                Do sortimentu
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {r.map((x) => (
                <li key={x.slug + x.varianta} className="flex gap-4 py-4">
                  <div
                    className="relative h-20 w-20 shrink-0 rounded-2xl"
                    style={{
                      background: `color-mix(in srgb, ${x.produkt.barva} 22%, #F7F4EF)`,
                    }}
                  >
                    {x.produkt.foto && (
                      <Image
                        unoptimized
                        src={x.produkt.foto}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-contain p-1.5"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold leading-snug">
                      {x.produkt.nazev}
                    </p>
                    <p className="text-sm text-ink-muted">
                      {x.produkt.znacka} · {x.v.nazev}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <Pocitadlo
                        maly
                        ks={x.ks}
                        zmen={(n) => k.nastav(x.slug, x.varianta, n)}
                      />
                      <span className="text-base font-bold tabular-nums">
                        {kc(x.ks * x.v.cena)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {r.length > 0 && (
          <div className="border-t border-ink/10 px-6 pb-6 pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-base text-ink-soft">Mezisoučet</span>
              <span className="text-2xl font-extrabold tabular-nums">
                {kc(k.soucet)}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-muted">
              Dopravu vyberete v dalším kroku. Zásilku předáme jen osobě starší
              18 let.
            </p>
            <Link
              href="/obchod/pokladna"
              onClick={k.zavri}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-pine py-4 text-lg font-bold text-cream transition-colors hover:bg-forest-dark"
            >
              K pokladně <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

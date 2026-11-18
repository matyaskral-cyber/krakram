"use client";

import Image from "next/image";
import Link from "next/link";
import { cenaOd, kc, type Produkt } from "@/lib/obchod/produkty";
import { useKosik } from "./Kosik";

// Dlaždice bez fotky — typografická „etiketa“.
export function Etiketa({ produkt, velka }: { produkt: Produkt; velka?: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div
        className={`grid aspect-[3/4] place-items-center rounded-[1.25rem] bg-pine text-center text-cream shadow-xl ${
          velka ? "w-1/2" : "w-[55%]"
        }`}
      >
        <div>
          <span
            aria-hidden
            className="mx-auto block h-10 w-12 bg-lime"
            style={{
              mask: "url(/obchod/logo.svg) center/contain no-repeat",
              WebkitMask: "url(/obchod/logo.svg) center/contain no-repeat",
            }}
          />
          <p className={`mt-3 font-extrabold uppercase leading-none ${velka ? "text-3xl" : "text-xl"}`}>
            {produkt.nazev}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-lime">
            {produkt.varianty.map((v) => v.nazev).join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Karta({ produkt, priorita }: { produkt: Produkt; priorita?: boolean }) {
  const { pridej } = useKosik();
  const vice = produkt.varianty.length > 1;

  return (
    <article className="group relative" style={{ "--c": produkt.barva } as React.CSSProperties}>
      <Link href={`/obchod/produkt/${produkt.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[color-mix(in_srgb,var(--c)_20%,#F7F4EF)] transition-colors duration-500 group-hover:bg-[color-mix(in_srgb,var(--c)_82%,#F7F4EF)]">
          {produkt.stitek && (
            <span className="absolute bottom-3 left-3 z-10 whitespace-nowrap rounded-full bg-cream px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wide text-pine sm:text-xs">
              {produkt.stitek}
            </span>
          )}
          {produkt.foto ? (
            <Image
              src={produkt.foto}
              alt={`${produkt.nazev} – ${produkt.znacka}`}
              fill
              priority={priorita}
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
              className={`object-contain transition-transform duration-500 ease-out group-hover:-rotate-3 group-hover:scale-110 ${
                produkt.splyvat
                  ? "mix-blend-multiply"
                  : "p-5 drop-shadow-[0_18px_18px_rgba(0,0,0,0.22)] md:p-7"
              }`}
            />
          ) : (
            <Etiketa produkt={produkt} />
          )}
        </div>
        <div className="mt-3 flex flex-col gap-1 px-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-forest">
              {produkt.znacka}
            </p>
            <h3 className="mt-0.5 text-base font-bold leading-snug text-ink md:text-lg">
              {produkt.nazev}
            </h3>
            <p className="text-sm text-ink-muted">
              {produkt.varianty.map((v) => v.nazev).join(" · ")}
            </p>
          </div>
          <p className="shrink-0 text-base font-extrabold tabular-nums sm:pt-4 md:text-lg">
            {vice && <span className="text-sm font-medium text-ink-muted">od </span>}
            {kc(cenaOd(produkt))}
          </p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => pridej(produkt.slug, produkt.varianty[0].id)}
        aria-label={`Přidat ${produkt.nazev} do košíku`}
        className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-pine text-2xl font-medium leading-none text-cream shadow-lg transition-all duration-300 hover:scale-110 hover:bg-ink md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
      >
        +
      </button>
    </article>
  );
}

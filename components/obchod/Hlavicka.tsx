"use client";

import Link from "next/link";
import { kategorie } from "@/lib/obchod/produkty";
import { useKosik } from "./Kosik";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="KraKrám"
      className={`block aspect-[1.177] bg-current ${className}`}
      style={{
        mask: "url(/obchod/logo.svg) center/contain no-repeat",
        WebkitMask: "url(/obchod/logo.svg) center/contain no-repeat",
      }}
    />
  );
}

const PAS = [
  "Předání jen osobám 18+",
  "Osobní odběr na 5 prodejnách",
  "Doprava zdarma od 1 500 Kč",
  "Diskrétní balení",
  "Skladem v Česku",
];

export function Pas({ tmavy }: { tmavy?: boolean }) {
  const rada = [...PAS, ...PAS, ...PAS, ...PAS];
  return (
    <div
      className={`overflow-hidden py-3 text-sm font-bold uppercase tracking-widest ${
        tmavy ? "bg-pine text-lime" : "bg-lime text-pine"
      }`}
    >
      <div className="flex w-max animate-pas motion-reduce:animate-none">
        {rada.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="px-6">{t}</span>
            <span aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hlavicka() {
  const { pocet, otevri } = useKosik();
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-[86rem] items-center gap-6 px-4 md:px-8">
        <Link
          href="/obchod"
          className="flex items-center gap-3 text-forest-dark"
          aria-label="KraKrám – e-shop"
        >
          <Logo className="h-12" />
          <span className="hidden rounded-full bg-pine px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-lime sm:block">
            e-shop
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          <Link
            href="/obchod/sortiment"
            className="rounded-full px-4 py-2 text-base font-semibold text-ink hover:bg-ink/5"
          >
            Vše
          </Link>
          {kategorie.map((k) => (
            <Link
              key={k.id}
              href={`/obchod/sortiment?k=${k.id}`}
              className="rounded-full px-4 py-2 text-base font-semibold text-ink hover:bg-ink/5"
            >
              {k.kratce}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/#pobocky"
            className="hidden rounded-full px-4 py-2 text-base font-semibold text-ink-soft hover:bg-ink/5 sm:block"
          >
            Prodejny
          </Link>
          <button
            type="button"
            onClick={otevri}
            className="flex items-center gap-2 rounded-full bg-pine py-2.5 pl-5 pr-3 text-base font-bold text-cream transition-colors hover:bg-forest-dark"
          >
            Košík
            <span className="grid h-7 min-w-7 place-items-center rounded-full bg-lime px-1.5 text-sm font-extrabold tabular-nums text-pine">
              {pocet}
            </span>
          </button>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden [scrollbar-width:none]">
        <Link
          href="/obchod/sortiment"
          className="shrink-0 rounded-full bg-ink/5 px-4 py-1.5 text-sm font-semibold"
        >
          Vše
        </Link>
        {kategorie.map((k) => (
          <Link
            key={k.id}
            href={`/obchod/sortiment?k=${k.id}`}
            className="shrink-0 rounded-full bg-ink/5 px-4 py-1.5 text-sm font-semibold"
          >
            {k.kratce}
          </Link>
        ))}
      </nav>
    </header>
  );
}

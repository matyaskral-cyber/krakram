"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Pruh nad hlavičkou: upozornění, že jde o návrh, a přepínač dvou verzí úvodu.
export default function PruhNavrhu() {
  const cesta = usePathname();
  const b = cesta === "/obchod/b";
  const odkaz = (aktivni: boolean) =>
    `rounded-full px-2.5 py-0.5 font-bold transition-colors ${
      aktivni ? "bg-lime text-pine" : "text-cream/80 hover:text-cream"
    }`;
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-ink px-4 py-1.5 text-xs font-semibold text-cream/80">
      <span>Návrh e-shopu · ceny a texty jsou ukázkové</span>
      <span className="flex items-center gap-1">
        Úvod:
        <Link href="/obchod" className={odkaz(!b)}>
          A · živý pult
        </Link>
        <Link href="/obchod/b" className={odkaz(b)}>
          B · fotka
        </Link>
      </span>
    </div>
  );
}

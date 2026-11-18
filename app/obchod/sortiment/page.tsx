import type { Metadata } from "next";
import Link from "next/link";
import { cz } from "@/lib/obchod/typo";
import Karta from "@/components/obchod/Karta";
import { cenaOd, kategorie, najdiKategorii, produkty } from "@/lib/obchod/produkty";

export const metadata: Metadata = { title: "Sortiment" };

const RAZENI = [
  { id: "", nazev: "Doporučené" },
  { id: "levne", nazev: "Od nejlevnějšího" },
  { id: "drahe", nazev: "Od nejdražšího" },
];

export default async function Sortiment({
  searchParams,
}: {
  searchParams: Promise<{ k?: string; r?: string }>;
}) {
  const { k, r } = await searchParams;
  const vybrana = k ? najdiKategorii(k) : undefined;
  const seznam = produkty.filter((p) => !vybrana || p.kategorie === vybrana.id);
  if (r === "levne") seznam.sort((a, b) => cenaOd(a) - cenaOd(b));
  if (r === "drahe") seznam.sort((a, b) => cenaOd(b) - cenaOd(a));

  const odkaz = (kat?: string, raz?: string) => {
    const q = new URLSearchParams();
    if (kat) q.set("k", kat);
    if (raz) q.set("r", raz);
    const s = q.toString();
    return `/obchod/sortiment${s ? `?${s}` : ""}`;
  };

  const stitek = (aktivni: boolean) =>
    `shrink-0 rounded-full px-5 py-2.5 text-base font-bold transition-colors ${
      aktivni ? "bg-pine text-cream" : "bg-ink/5 text-ink hover:bg-ink/10"
    }`;

  return (
    <div className="mx-auto max-w-[86rem] px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-forest">
        <Link href="/obchod" className="hover:underline">
          E-shop
        </Link>{" "}
        / Sortiment
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <h1 className="text-5xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-8xl">
          {vybrana ? vybrana.nazev : "Celý sortiment"}
        </h1>
        <p className="vyrovnat max-w-sm pb-2 text-lg leading-snug text-ink-soft">
          {cz(vybrana ? vybrana.popis : "Všechno, co se smí posílat. Pro kratom se stavte na prodejně.")}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-ink/10 py-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
          <Link href={odkaz(undefined, r)} className={stitek(!vybrana)}>
            Vše <span className="font-medium opacity-60">{produkty.length}</span>
          </Link>
          {kategorie.map((kat) => (
            <Link key={kat.id} href={odkaz(kat.id, r)} className={stitek(vybrana?.id === kat.id)}>
              {kat.kratce}{" "}
              <span className="font-medium opacity-60">
                {produkty.filter((p) => p.kategorie === kat.id).length}
              </span>
            </Link>
          ))}
        </div>
        <div className="-mx-4 flex max-w-[100vw] items-center gap-1 overflow-x-auto whitespace-nowrap px-4 text-sm [scrollbar-width:none] md:mx-0 md:px-0">
          <span className="mr-1 text-ink-muted">Řadit:</span>
          {RAZENI.map((x) => (
            <Link
              key={x.id}
              href={odkaz(vybrana?.id, x.id)}
              className={`rounded-full px-2.5 py-1.5 font-semibold sm:px-3 ${
                (r ?? "") === x.id ? "bg-lime text-pine" : "text-ink-soft hover:bg-ink/5"
              }`}
            >
              {x.nazev}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
        {seznam.map((p, i) => (
          <Karta key={p.slug} produkt={p} priorita={i < 4} />
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Karta, { Etiketa } from "@/components/obchod/Karta";
import { cz } from "@/lib/obchod/typo";
import Nakup from "@/components/obchod/Nakup";
import { najdiKategorii, najdiProdukt, produkty } from "@/lib/obchod/produkty";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return produkty.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = najdiProdukt((await params).slug);
  return p ? { title: `${p.nazev} – ${p.znacka}`, description: p.popis } : {};
}

const JISTOTY = [
  ["Skladem", "odchází nejpozději další pracovní den"],
  ["18+", "při předání ukážete doklad"],
  ["Odběr zdarma", "na všech pěti prodejnách"],
];

export default async function Detail({ params }: Props) {
  const p = najdiProdukt((await params).slug);
  if (!p) notFound();
  const kat = najdiKategorii(p.kategorie)!;
  const dalsi = [
    ...produkty.filter((x) => x.kategorie === p.kategorie && x.slug !== p.slug),
    ...produkty.filter((x) => x.kategorie !== p.kategorie),
  ].slice(0, 4);

  return (
    <div className="mx-auto max-w-[86rem] px-4 pb-20 pt-4 md:px-8 md:pb-28 md:pt-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div
          className="relative aspect-square overflow-hidden rounded-[2rem] lg:sticky lg:top-24 lg:aspect-auto lg:h-[calc(100vh-7.5rem)] lg:max-h-[46rem] md:rounded-[2.75rem]"
          style={{ background: `color-mix(in srgb, ${p.barva} 72%, #F7F4EF)` }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -left-4 bottom-0 select-none whitespace-nowrap text-[9rem] font-extrabold uppercase leading-[1.05] tracking-tighter text-ink/10 md:text-[14rem]"
          >
            {p.znacka}
          </span>
          {p.foto ? (
            <Image
              unoptimized
              src={p.foto}
              alt={`${p.nazev} – ${p.znacka}`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={
                p.splyvat
                  ? "object-contain mix-blend-multiply"
                  : "animate-vznaset object-contain p-10 drop-shadow-[0_40px_35px_rgba(0,0,0,0.35)] motion-reduce:animate-none md:p-16"
              }
            />
          ) : (
            <Etiketa produkt={p} velka />
          )}
        </div>

        <div className="lg:py-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-forest">
            <Link href="/obchod/sortiment" className="hover:underline">
              Sortiment
            </Link>{" "}
            /{" "}
            <Link
              href={`/obchod/sortiment?k=${kat.id}`}
              className="hover:underline"
            >
              {kat.nazev}
            </Link>
          </p>
          <h1 className="mt-4 text-5xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-7xl">
            {p.nazev}
          </h1>
          <p className="mt-3 text-lg font-semibold text-ink-muted">
            {p.znacka}
          </p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            {cz(p.popis)}
          </p>

          <div className="mt-8">
            <Nakup produkt={p} />
          </div>

          <ul className="mt-8 grid gap-2 sm:grid-cols-3">
            {JISTOTY.map(([a, b]) => (
              <li key={a} className="rounded-2xl bg-cream-dark px-4 py-3">
                <span className="block text-base font-extrabold">{a}</span>
                <span className="block text-sm leading-snug text-ink-muted">
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-ink/10">
            <details open className="group border-b border-ink/10 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-xl font-bold [&::-webkit-details-marker]:hidden">
                Parametry
                <span
                  aria-hidden
                  className="text-2xl transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <dl className="mt-4 divide-y divide-ink/5 text-base">
                {p.parametry.map(([a, b]) => (
                  <div key={a} className="flex justify-between gap-6 py-2">
                    <dt className="text-ink-muted">{a}</dt>
                    <dd className="text-right font-semibold">{b}</dd>
                  </div>
                ))}
              </dl>
            </details>
            <details className="group border-b border-ink/10 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-xl font-bold [&::-webkit-details-marker]:hidden">
                Doprava a platba
                <span
                  aria-hidden
                  className="text-2xl transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                Výdejna, kurýr až ke dveřím, nebo vyzvednutí na prodejně.
                Zaplatíte kartou, převodem nebo při převzetí. Věk se ověřuje
                vždy.
              </p>
            </details>
          </div>

          <p className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-ink px-4 py-3 text-base font-semibold leading-snug">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-xs font-extrabold text-cream">
              18+
            </span>
            {cz(p.upozorneni)}
          </p>
        </div>
      </div>

      <section className="mt-20 md:mt-28">
        <h2 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
          Mohlo by se hodit
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 lg:grid-cols-4">
          {dalsi.map((x) => (
            <Karta key={x.slug} produkt={x} />
          ))}
        </div>
      </section>
    </div>
  );
}

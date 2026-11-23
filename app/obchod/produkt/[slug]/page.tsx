import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Karta, { Etiketa } from "@/components/obchod/Karta";
import Nakup from "@/components/obchod/Nakup";
import { najdiKategorii, najdiProdukt, produkty } from "@/lib/obchod/produkty";
import { cz } from "@/lib/obchod/typo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return produkty.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = najdiProdukt((await params).slug);
  return p ? { title: `${p.nazev} – ${p.znacka}`, description: p.veta } : {};
}

function Rozbalit({
  nadpis,
  otevreno,
  children,
}: {
  nadpis: string;
  otevreno?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={otevreno} className="group border-b border-ink/10 py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-bold [&::-webkit-details-marker]:hidden">
        {nadpis}
        <span
          aria-hidden
          className="text-2xl transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-3 max-w-2xl space-y-3 text-base leading-relaxed text-ink-soft [&_p]:!text-base">
        {children}
      </div>
    </details>
  );
}

export default async function Detail({ params }: Props) {
  const p = najdiProdukt((await params).slug);
  if (!p) notFound();
  const kat = najdiKategorii(p.kategorie)!;
  const dalsi = [
    ...produkty.filter((x) => x.kategorie === p.kategorie && x.slug !== p.slug),
    ...produkty.filter((x) => x.kategorie !== p.kategorie),
  ].slice(0, 4);

  const jistoty = [
    ["Skladem", "odchází nejpozději další pracovní den"],
    p.vek === "online"
      ? ["18+", "věk ověříte v pokladně, nebo na prodejně"]
      : ["Sběratelské", "není určeno ke konzumaci"],
    ["Odběr zdarma", "na všech pěti prodejnách"],
  ];

  return (
    <div
      className="mx-auto max-w-[86rem] px-4 pb-20 pt-4 md:px-8 md:pb-28 md:pt-6"
      style={{ "--c": p.barva } as React.CSSProperties}
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[color-mix(in_srgb,var(--c)_72%,#F7F4EF)] md:rounded-[2.75rem] lg:sticky lg:top-24 lg:aspect-auto lg:h-[calc(100vh-7.5rem)] lg:max-h-[46rem]">
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
              className="animate-vznaset object-contain p-10 drop-shadow-[0_40px_35px_rgba(0,0,0,0.35)] motion-reduce:animate-none md:p-16"
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
          <p className="vyrovnat mt-5 max-w-xl text-xl leading-relaxed text-ink-soft">
            {cz(p.veta)}
          </p>

          {p.tony && (
            <ul
              aria-label={p.tony.nadpis}
              className="mt-5 flex flex-wrap gap-2"
            >
              {p.tony.seznam.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-[color-mix(in_srgb,var(--c)_26%,#F7F4EF)] px-3.5 py-1.5 text-sm font-bold text-ink"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8">
            <Nakup produkt={p} />
          </div>

          <ul className="mt-8 grid gap-2 sm:grid-cols-3">
            {jistoty.map(([a, b]) => (
              <li key={a} className="rounded-2xl bg-cream-dark px-4 py-3">
                <span className="block text-base font-extrabold">{a}</span>
                <span className="block text-sm leading-snug text-ink-muted">
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-ink px-4 py-3 text-base font-semibold leading-snug">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-xs font-extrabold text-cream">
              {p.vek === "online" ? "18+" : "!"}
            </span>
            {cz(p.upozorneni)}
          </p>
        </div>
      </div>

      {/* O produktu a parametry */}
      <section className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <h2 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
            Co přesně kupujete
          </h2>
          <div className="mt-6 max-w-2xl space-y-4">
            {p.popis.map((odstavec) => (
              <p key={odstavec} className="text-lg leading-relaxed text-ink-soft">
                {cz(odstavec)}
              </p>
            ))}
          </div>

          {p.tony && (
            <div className="mt-8 rounded-[1.75rem] bg-[color-mix(in_srgb,var(--c)_22%,#F7F4EF)] p-6 md:p-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-ink/70">
                {p.tony.nadpis}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-3xl font-extrabold uppercase leading-[1.1] tracking-tight md:text-4xl">
                {p.tony.seznam.map((t, i) => (
                  <li key={t} className="flex items-center gap-4">
                    {i > 0 && (
                      <span aria-hidden className="text-xl text-ink/40">
                        ✦
                      </span>
                    )}
                    {t}
                  </li>
                ))}
              </ul>
              {p.tony.pozn && (
                <p className="mt-4 !text-sm !leading-snug text-ink/70">
                  {cz(p.tony.pozn)}
                </p>
              )}
            </div>
          )}

          {p.jmeno && (
            <div className="mt-8 max-w-2xl border-l-4 border-pine pl-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-forest">
                Odkud je to jméno
              </h3>
              <p className="mt-2 !text-base text-ink-soft">{cz(p.jmeno)}</p>
            </div>
          )}
        </div>

        <div className="h-fit rounded-[2rem] bg-cream-dark p-6 md:p-8">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight">
            Parametry
          </h2>
          <dl className="mt-4 divide-y divide-ink/10 text-base">
            {p.parametry.map(([a, b]) => (
              <div key={a} className="flex justify-between gap-6 py-2.5">
                <dt className="text-ink-muted">{a}</dt>
                <dd className="text-right font-semibold">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Dobré vědět */}
      <section className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
        <h2 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
          Dobré vědět
        </h2>
        <div className="border-t border-ink/10">
          <Rozbalit nadpis="Co je v balení" otevreno>
            <ul className="space-y-1.5">
              {p.vBaleni.map((x) => (
                <li key={x} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.6em] h-2 w-2 shrink-0 rounded-full bg-pine"
                  />
                  {cz(x)}
                </li>
              ))}
            </ul>
          </Rozbalit>
          <Rozbalit nadpis="Jak to uchovávat">
            <p>{cz(p.uchovani)}</p>
          </Rozbalit>
          <Rozbalit nadpis="Doprava a platba">
            <p>
              {cz(
                "Výdejní místo, kurýr na adresu, nebo vyzvednutí na prodejně zdarma. Zaplatíte kartou, převodem přes QR kód, nebo až u pultu při vyzvednutí.",
              )}
            </p>
            <p>
              <Link
                href="/obchod/doprava-a-platba"
                className="font-bold text-forest-dark underline underline-offset-4"
              >
                Ceny a lhůty
              </Link>
            </p>
          </Rozbalit>
          {p.vek === "online" && (
          <Rozbalit nadpis="Ověření věku">
            <p>
              {cz(
                "Tohle zboží prodáme jen tomu, komu už bylo 18. Když platíte kartou nebo převodem, ověříte si věk v pokladně bankovní identitou nebo dokladem, trvá to asi minutu a stačí to jednou. Když platíte až na prodejně, ukážete občanku u pultu.",
              )}
            </p>
            <p>
              <Link
                href="/obchod/overeni-veku"
                className="font-bold text-forest-dark underline underline-offset-4"
              >
                Jak ověření probíhá
              </Link>
            </p>
          </Rozbalit>
          )}
          <Rozbalit nadpis="Vrácení a reklamace">
            <p>
              {cz(
                "Neotevřené zboží můžete do 14 dnů vrátit bez udání důvodu. Rozbalené vzít zpět nemůžeme, pokud není vadné.",
              )}
            </p>
            <p>
              <Link
                href="/obchod/vraceni-zbozi"
                className="font-bold text-forest-dark underline underline-offset-4"
              >
                Jak na to
              </Link>
            </p>
          </Rozbalit>
        </div>
      </section>

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

import Link from "next/link";
import { cz } from "@/lib/obchod/typo";

// Rozložení textových stránek e-shopu (doprava a platba, ověření věku,
// vrácení zboží): velký nadpis, úvodní věta a číslované oddíly.

export type Oddil = {
  nadpis: string;
  // odstavce; pole řetězců uvnitř = odrážky
  obsah: (string | string[])[];
};

export default function Stranka({
  nadpis,
  uvod,
  oddily,
  children,
}: {
  nadpis: string;
  uvod: string;
  oddily: Oddil[];
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[86rem] px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-forest">
        <Link href="/obchod" className="hover:underline">
          E-shop
        </Link>{" "}
        / {nadpis}
      </p>
      <h1 className="mt-4 max-w-5xl text-5xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-8xl">
        {nadpis}
      </h1>
      <p className="vyrovnat mt-6 max-w-2xl text-xl leading-relaxed text-ink-soft md:text-2xl">
        {cz(uvod)}
      </p>

      <div className="mt-12 border-t border-ink/10 md:mt-16">
        {oddily.map((o, i) => (
          <section
            key={o.nadpis}
            className="grid gap-4 border-b border-ink/10 py-8 md:grid-cols-[1fr_1.6fr] md:gap-12 md:py-12"
          >
            <h2 className="flex items-start gap-4 text-3xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-4xl">
              <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine text-sm tabular-nums text-lime">
                {i + 1}
              </span>
              {o.nadpis}
            </h2>
            <div className="max-w-2xl space-y-4">
              {o.obsah.map((x, j) =>
                Array.isArray(x) ? (
                  <ul key={j} className="space-y-2">
                    {x.map((radek) => (
                      <li
                        key={radek}
                        className="flex gap-3 text-lg leading-relaxed text-ink-soft"
                      >
                        <span
                          aria-hidden
                          className="mt-[0.7em] h-2 w-2 shrink-0 rounded-full bg-lime ring-2 ring-pine"
                        />
                        <span>{cz(radek)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={j} className="text-lg leading-relaxed text-ink-soft">
                    {cz(x)}
                  </p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
      {children}
    </div>
  );
}

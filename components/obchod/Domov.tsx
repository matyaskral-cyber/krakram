import Image from "next/image";
import Link from "next/link";
import { Pas } from "@/components/obchod/Hlavicka";
import Karta from "@/components/obchod/Karta";
import Uvod from "@/components/obchod/Uvod";
import UvodFoto from "@/components/obchod/UvodFoto";
import { kategorie, najdiProdukt, produkty } from "@/lib/obchod/produkty";
import { cz } from "@/lib/obchod/typo";
import { branches } from "@/lib/pobocky";

const VYBER = [
  "t9hc-kvet-balanced",
  "9h-hhcp-joint-laughing-buddha",
  "vape-gorilla-kush",
  "cbd-kvet",
  "t8hc-kvet-gorilla-power",
  "thp420-joint-amnesia",
  "vape-jungle-monkey",
  "kava-kava-borongoru",
].map((s) => najdiProdukt(s)!);

const KROKY = [
  {
    n: "01",
    nadpis: "Vyberete",
    text: "V e-shopu je jen to, co opravdu leží ve skladu. Nic na objednávku, žádné čekání na dodavatele.",
  },
  {
    n: "02",
    nadpis: "Zabalíme",
    text: "Obyčejná krabice bez loga. Co je uvnitř, víte jen vy a my.",
  },
  {
    n: "03",
    nadpis: "Ukážete doklad",
    text: "Balík vydají jen dospělému. Kurýr i výdejna si věk ověří podle občanky.",
  },
];

const DOTAZY = [
  {
    q: "Proč tu není kratom?",
    a: "Protože to zákon nedovoluje. Kratom se smí prodávat jen osobně, v prodejně s povolením. U nás ho mají na všech pěti.",
  },
  {
    q: "Jak ověřujete věk?",
    a: "Dvakrát. V pokladně potvrdíte, že vám bylo 18, a při předání to dopravce zkontroluje podle dokladu. Bez něj balík nevydá.",
  },
  {
    q: "Můžu si objednávku vyzvednout?",
    a: "Ano. V pokladně vyberte osobní odběr a prodejnu. Jakmile bude nachystáno, napíšeme vám e-mail.",
  },
  {
    q: "Kdy to dorazí?",
    a: "Co objednáte v pracovní den, předáme dopravci nejpozději další pracovní den. Pak už záleží na něm, obvykle den až dva.",
  },
];

// Rozložení dlaždic kategorií (bento) na širokém displeji.
const BENTO = [
  "lg:col-span-5 lg:row-span-2",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-4",
];

// Úvodní stránka e-shopu. `foto` = verze B (úvod s jednou fotkou), jinak
// verze A (živý pult s přepínáním produktů).
export default function Domov({ foto }: { foto?: boolean }) {
  return (
    <>
      {foto ? <UvodFoto /> : <Uvod />}

      <div className="mt-4 md:mt-6">
        <Pas />
      </div>

      {/* Kategorie */}
      <section className="mx-auto max-w-[86rem] px-4 py-16 md:px-8 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
            Co máme
          </h2>
          <Link
            href="/obchod/sortiment"
            className="hidden shrink-0 text-base font-bold text-forest-dark underline underline-offset-4 sm:block"
          >
            Celý sortiment ({produkty.length})
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:auto-rows-[15rem] lg:grid-cols-12">
          {kategorie.map((k, i) => (
            <Link
              key={k.id}
              href={`/obchod/sortiment?k=${k.id}`}
              style={{ "--c": k.barva } as React.CSSProperties}
              className={`group relative flex min-h-[13rem] flex-col-reverse overflow-hidden sm:flex-row rounded-[1.75rem] bg-[color-mix(in_srgb,var(--c)_78%,#F7F4EF)] transition-transform duration-300 hover:-translate-y-1 ${
                i === 0 ? "col-span-2 min-h-[16rem]" : ""
              } ${BENTO[i]}`}
            >
              {/* Text a fotka jsou vedle sebe ve sloupcích, takže se nikdy nepřekryjí. */}
              <div className="flex min-w-0 flex-col justify-between p-4 sm:flex-1 sm:p-5 md:p-7">
                <span className="hidden w-fit rounded-full bg-ink/85 px-3 py-1 text-xs sm:block font-bold uppercase tracking-widest text-cream">
                  {produkty.filter((p) => p.kategorie === k.id).length} ks
                </span>
                <div>
                  <h3
                    className={`font-extrabold uppercase leading-[1.05] tracking-tight text-ink ${
                      i === 0
                        ? "text-4xl md:text-5xl xl:text-6xl"
                        : "text-[1.05rem] sm:text-2xl lg:text-[1.3rem] xl:text-3xl"
                    }`}
                  >
                    {k.nazev}
                  </h3>
                  <p className="vyrovnat mt-2 hidden !text-base font-medium !leading-snug text-ink/75 sm:block">
                    {cz(k.popis)}
                  </p>
                </div>
              </div>
              {k.foto && (
                <div
                  className={`relative min-h-[7.5rem] flex-1 sm:flex-none sm:self-stretch ${
                    i === 0 ? "sm:w-[42%]" : "sm:w-[38%]"
                  }`}
                >
                  <Image
                    src={k.foto}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, 30vw"
                    className="rotate-6 object-contain pt-3 drop-shadow-[0_14px_14px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-out group-hover:rotate-12 sm:scale-[1.5] sm:pt-0 sm:group-hover:scale-[1.65]"
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Výběr */}
      <section className="mx-auto max-w-[86rem] px-4 pb-16 md:px-8 md:pb-24">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
            Právě skladem
          </h2>
          <Link
            href="/obchod/sortiment"
            className="shrink-0 text-base font-bold text-forest-dark underline underline-offset-4"
          >
            Zobrazit vše
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
          {VYBER.map((p, i) => (
            <Karta key={p.slug} produkt={p} priorita={i < 4} />
          ))}
        </div>
      </section>

      {/* Jak to chodí */}
      <section className="relative overflow-hidden bg-pine text-cream">
        <Image
          src="/obchod/listy.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pine via-pine/70 to-pine" />
        <div className="relative mx-auto max-w-[86rem] px-4 py-20 md:px-8 md:py-28">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-lime">Jak to chodí</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-7xl">
            Tři kroky, žádná věda
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {KROKY.map((k) => (
              <div
                key={k.n}
                className="rounded-[1.75rem] border border-cream/15 bg-cream/[0.07] p-7 backdrop-blur-sm md:p-9"
              >
                <span className="text-6xl font-extrabold tabular-nums text-lime">{k.n}</span>
                <h3 className="mt-6 text-2xl font-extrabold uppercase">{k.nadpis}</h3>
                <p className="mt-2 text-lg leading-relaxed text-cream/75">{cz(k.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prodejny */}
      <section className="mx-auto max-w-[86rem] px-4 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-end">
          <div>
            <h2 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
              Máte to kousek? Stavte se.
            </h2>
            <p className="vyrovnat mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              {cz("Objednávku nachystáme na kterékoli prodejně. Vyzvednutí nic nestojí.")}
            </p>
          </div>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {branches.map((b) => (
              <li key={b.slug}>
                <a
                  href={b.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-forest-dark"
                >
                  <span className="text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
                    {b.city}
                  </span>
                  <span className="flex items-center gap-4 text-right text-sm text-ink-muted md:text-base">
                    <span>
                      {b.address}
                      <br className="sm:hidden" />
                      <span className="hidden sm:inline"> · </span>
                      {b.hours}
                    </span>
                    <span
                      aria-hidden
                      className="text-2xl transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Dotazy */}
      <section className="mx-auto max-w-[86rem] px-4 pb-20 md:px-8 md:pb-28">
        <div className="rounded-[2rem] bg-cream-dark p-6 md:rounded-[2.75rem] md:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <h2 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
              Časté dotazy
            </h2>
            <div className="divide-y divide-ink/10">
              {DOTAZY.map((d) => (
                <details key={d.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-bold [&::-webkit-details-marker]:hidden">
                    {d.q}
                    <span
                      aria-hidden
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine text-xl text-cream transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">{cz(d.a)}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Pas tmavy />
    </>
  );
}

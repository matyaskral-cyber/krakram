import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { kc } from "@/lib/obchod/produkty";
import { jeUkazkova } from "@/lib/obchod/server/platba";
import { nacti } from "@/lib/obchod/server/uloziste";

export const metadata: Metadata = { title: "Ukázková platební brána" };
export const dynamic = "force-dynamic";

// Stojí na místě, kde bude stránka skutečné brány. Nic se tu neplatí,
// jen se dá vyzkoušet, co se stane po zaplacení a po zrušení platby.
export default async function UkazkovaBrana({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  if (!jeUkazkova()) notFound();
  const { c = "" } = await searchParams;
  const o = await nacti(c);

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 py-14">
      <div className="w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(31,74,70,0.45)]">
        <div className="flex items-center justify-between gap-4 bg-ink px-6 py-4 text-cream">
          <span className="text-base font-extrabold uppercase tracking-widest">
            Platební brána
          </span>
          <span className="rounded-full bg-lime px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-pine">
            Ukázka
          </span>
        </div>

        {o && o.platba.id === "karta" ? (
          <div className="p-6 md:p-8">
            <p className="!text-sm font-bold uppercase tracking-widest text-ink-muted">
              Objednávka {o.cislo}
            </p>
            <p className="mt-1 text-5xl font-extrabold tabular-nums">
              {kc(o.ceny.celkem)}
            </p>
            <p className="mt-4 !text-base !leading-snug text-ink-soft">
              Tady zákazník uvidí stránku skutečné brány: zadá kartu, nebo
              zaplatí přes Apple Pay či Google Pay. V návrhu se žádné peníze
              nestrhnou, jen si vyberete, jak platba dopadla.
            </p>

            <form
              action="/api/obchod/platba/test"
              method="post"
              className="mt-6 grid gap-2"
            >
              <input type="hidden" name="c" value={o.cislo} />
              <button
                name="vysledek"
                value="zaplaceno"
                className="rounded-full bg-pine py-4 text-lg font-bold text-cream transition-colors hover:bg-forest-dark"
              >
                Platba proběhla
              </button>
              <button
                name="vysledek"
                value="zruseno"
                className="rounded-full border-2 border-ink/15 py-3.5 text-base font-bold text-ink-soft transition-colors hover:border-ink/40"
              >
                Zákazník platbu zrušil
              </button>
            </form>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <p className="text-xl font-bold">Tuhle platbu tu nevidíme.</p>
            <p className="mt-2 !text-base text-ink-soft">
              Objednávka se drží v prohlížeči, ve kterém vznikla. V jiném
              prohlížeči nebo po vymazání cookies ji nenajdeme.
            </p>
            <Link
              href="/obchod"
              className="mt-6 inline-block rounded-full bg-pine px-6 py-3 text-base font-bold text-cream"
            >
              Zpět do obchodu
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

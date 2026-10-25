import type { Metadata } from "next";
import Oznameni from "@/components/Oznameni";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import Sortiment from "@/components/Sortiment";
import { branches, najdiPobocku } from "@/lib/pobocky";
import { nactiSklad } from "@/lib/sklad";

export const revalidate = 60;

type Props = { params: Promise<{ pobocka: string }> };

export function generateStaticParams() {
  return branches.map((b) => ({ pobocka: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = najdiPobocku((await params).pobocka);
  if (!b) return {};
  return {
    title: `Sortiment ${b.city} — KraKrám`,
    description: `Co je právě skladem na pobočce KraKrám ${b.city}.`,
  };
}

const casFormat = new Intl.DateTimeFormat("cs-CZ", {
  timeZone: "Europe/Prague",
  day: "numeric",
  month: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function SortimentPobocky({ params }: Props) {
  const b = najdiPobocku((await params).pobocka);
  if (!b) notFound();
  const sklad = await nactiSklad(b);

  return (
    <>
      <AgeGate />
      <Navbar />
      <main className="section-padding pt-40 md:pt-44 bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Link href="/sortiment" className="text-forest text-sm font-semibold hover:underline underline-offset-2">
            ← Všechny pobočky
          </Link>
          <p className="section-subtitle mt-8 mb-4">Sortiment pobočky</p>
          <div className="divider mb-8" />
          <h1 className="section-title mb-4">{b.city}</h1>
          <p className="text-ink-soft text-lg">
            {b.address}, {b.zip}
          </p>
          <p className="text-ink-muted mb-10">{b.hours}</p>
          {b.oznameni && <Oznameni text={b.oznameni.text} platiDo={b.oznameni.do} className="-mt-6 mb-10" />}

          {sklad ? (
            <>
              <Sortiment produkty={sklad.produkty} />
              <p className="text-ink-muted text-sm mt-12 max-w-2xl">
                Stav skladu z {casFormat.format(new Date(sklad.aktualizovano))}. Během dne se mění,
                zboží nelze objednat ani rezervovat. Prodej výhradně osobně na pobočce
                osobám starším 18 let.
              </p>
            </>
          ) : (
            <div className="rounded-2xl border border-border-green bg-green-bg/40 p-10 text-center">
              <p className="text-xl font-semibold text-ink mb-2">Sortiment této pobočky připravujeme</p>
              <p className="text-ink-muted">Zatím se zastavte přímo na pobočce, rádi poradíme.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

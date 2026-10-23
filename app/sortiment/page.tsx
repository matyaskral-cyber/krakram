import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import { branches } from "@/lib/pobocky";

export const metadata: Metadata = {
  title: "Sortiment poboček — KraKrám",
  description: "Co je právě skladem na jednotlivých pobočkách KraKrám.",
};

export default function SortimentPage() {
  return (
    <>
      <AgeGate />
      <Navbar />
      <main className="section-padding pt-40 md:pt-44 bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto">
          <p className="section-subtitle mb-4">Sortiment</p>
          <div className="divider mb-8" />
          <h1 className="section-title mb-4">Co máme skladem</h1>
          <p className="text-ink-soft text-xl leading-relaxed max-w-2xl mb-12">
            Vyberte pobočku. Prodáváme výhradně osobně na pobočce, zboží nelze
            objednat ani rezervovat.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((b) => (
              <Link
                key={b.slug}
                href={`/sortiment/${b.slug}`}
                className="group rounded-2xl border border-border-green bg-green-bg/40 p-6 hover:border-forest transition-colors"
              >
                <h2 className="text-xl font-bold text-ink group-hover:text-forest transition-colors">
                  {b.city}
                </h2>
                <p className="text-ink-muted text-sm mt-1">{b.address}</p>
                <span className="inline-block mt-4 text-forest font-semibold text-sm">
                  Zobrazit sortiment →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

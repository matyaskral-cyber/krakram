// Sortiment pobočky z PML — veřejný sklad, jen „skladem ano/ne“.
// Čte se na serveru (adresa s klíčem se do prohlížeče nedostane) a drží se
// minutu, takže PML dostane zhruba jeden dotaz za minutu na pobočku.

import type { Pobocka } from "@/lib/pobocky";

export type Produkt = {
  id: number;
  nazev: string;
  kategorie: string;
  skupina: string | null;
  pml: boolean;
  gramaz: string | null;
  skladem: boolean;
  obrazek: string | null;
};

export type Sklad = {
  pobocka: string;
  aktualizovano: string;
  produkty: Produkt[];
};

export const OBNOVA_SEKUND = 60;

export async function nactiSklad(pobocka: Pobocka): Promise<Sklad | null> {
  const url = process.env[pobocka.skladEnv];
  if (!url) return null;
  try {
    const res = await fetch(url, { next: { revalidate: OBNOVA_SEKUND } });
    if (!res.ok) return null;
    return (await res.json()) as Sklad;
  } catch {
    return null;
  }
}

// „25G Bílý kratom prášek MAENG DA“ → „Bílý kratom prášek MAENG DA“;
// gramáž je na kartě zvlášť.
export function hezkyNazev(nazev: string) {
  return nazev
    .replace(/^\s*\d+([.,]\d+)?\s*g\s+/i, "")
    .replace(/\s+\d+([.,]\d+)?\s*g\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

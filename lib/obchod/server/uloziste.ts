// Kde objednávka žije mezi kroky (pokladna → ověření věku → platba → stav).
//
// TEĎ: v podepsané cookie v prohlížeči zákazníka. Stačí to na to, aby šel
// celý nákup projít od začátku do konce, a nepotřebuje to databázi.
// PŘED SPUŠTĚNÍM: `uloz` a `nacti` musí zapisovat do databáze (nebo rovnou
// do PML), jinak se o objednávce nedozví obsluha a brána nemá kam potvrdit
// platbu, když zákazník zavře okno dřív, než se vrátí do e-shopu.

import { cookies } from "next/headers";
import type { Objednavka } from "../objednavka";
import { over, podepis } from "./podpis";

const klic = (cislo: string) => `kk-o-${cislo}`;
const MESIC = 60 * 60 * 24 * 30;

export const jeHttps = (req: Request) =>
  (req.headers.get("x-forwarded-proto") ?? new URL(req.url).protocol).startsWith(
    "https",
  );

export async function uloz(o: Objednavka, https: boolean) {
  (await cookies()).set(klic(o.cislo), podepis(o), {
    httpOnly: true,
    sameSite: "lax",
    secure: https,
    path: "/",
    maxAge: MESIC,
  });
  // Stopa v logu serveru, dokud není databáze. Bez osobních údajů.
  console.info(
    `[obchod] objednávka ${o.cislo}: ${o.ceny.celkem} Kč, platba ${o.platba.id}/${o.platba.stav}, doprava ${o.doprava.id}, věk ${o.vek.zpusob}`,
  );
}

export async function nacti(cislo: string): Promise<Objednavka | null> {
  if (!/^\d{10}$/.test(cislo)) return null;
  const o = over<Objednavka>((await cookies()).get(klic(cislo))?.value);
  return o && o.cislo === cislo ? o : null;
}

// Požadavek musí přijít z našeho webu, ne z cizí stránky.
export function zNasehoWebu(req: Request) {
  const puvod = req.headers.get("origin");
  if (!puvod) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(puvod).host === host;
  } catch {
    return false;
  }
}

// Adresa, pod kterou zákazník web vidí (za proxy Vercelu není v req.url).
export function zaklad(req: Request) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return `${jeHttps(req) ? "https" : "http"}://${host}`;
}

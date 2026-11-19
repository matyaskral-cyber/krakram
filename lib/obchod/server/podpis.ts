// Podepsané balíčky dat (objednávka, ověření věku) uložené v cookie.
// Podpis hlídá, že si je nikdo v prohlížeči nepřepsal — třeba stav platby.

import { createHmac, timingSafeEqual } from "node:crypto";

// Bez vlastního tajemství běží e-shop jen v ukázkovém režimu (viz nastaveni.ts).
const TAJEMSTVI = process.env.OBCHOD_TAJEMSTVI || "navrh-eshopu-bez-tajemstvi";

const mac = (telo: string) =>
  createHmac("sha256", TAJEMSTVI).update(telo).digest("base64url");

export function podepis(data: unknown): string {
  const telo = Buffer.from(JSON.stringify(data), "utf8").toString("base64url");
  return `${telo}.${mac(telo)}`;
}

export function over<T>(balicek: string | undefined): T | null {
  if (!balicek) return null;
  const [telo, podpis] = balicek.split(".");
  if (!telo || !podpis) return null;
  const a = Buffer.from(podpis);
  const b = Buffer.from(mac(telo));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(telo, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

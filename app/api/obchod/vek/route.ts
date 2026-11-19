import { nastaveni } from "@/lib/obchod/server/nastaveni";
import { nactiVek } from "@/lib/obchod/server/vek";

export const dynamic = "force-dynamic";

// Pokladna se ptá, jestli už má tenhle prohlížeč věk ověřený.
export async function GET() {
  const o = await nactiVek();
  return Response.json({
    overeno: Boolean(o),
    kdy: o?.kdy,
    metoda: o?.metoda,
    ukazka: nastaveni.vek === "test",
    // klíč widgetu je veřejný, vkládá se do stránky
    klic: nastaveni.vek === "over18" ? nastaveni.over18Klic : undefined,
  });
}

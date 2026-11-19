import { nastaveni } from "@/lib/obchod/server/nastaveni";
import { jeHttps, zNasehoWebu } from "@/lib/obchod/server/uloziste";
import { ulozVek, zapomenVek } from "@/lib/obchod/server/vek";

export const dynamic = "force-dynamic";

// Ukázkové ověření věku. Jakmile je zapnutý ostrý poskytovatel, tahle cesta
// přestane existovat — jinak by si věk „ověřil“ kdokoli jedním požadavkem.
export async function POST(req: Request) {
  if (nastaveni.vek !== "test" || !zNasehoWebu(req))
    return Response.json({ chyba: "Nedostupné." }, { status: 404 });

  const t = await req.json().catch(() => ({}));
  if (t.vysledek !== "ano") {
    await zapomenVek();
    return Response.json({ overeno: false, ukazka: true });
  }
  const metoda =
    t.metoda === "doklad" ? "doklad" : t.metoda === "mojeid" ? "MojeID" : "bankovní identita";
  const o = await ulozVek(`${metoda} (ukázka)`, jeHttps(req));
  return Response.json({ overeno: true, ukazka: true, ...o });
}

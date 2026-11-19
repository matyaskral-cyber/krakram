import { jeUkazkova } from "@/lib/obchod/server/platba";
import { jeHttps, nacti, uloz, zaklad, zNasehoWebu } from "@/lib/obchod/server/uloziste";

export const dynamic = "force-dynamic";

// Výsledek z ukázkové brány. S ostrou bránou tahle cesta neexistuje —
// jinak by si objednávku „zaplatil“ kdokoli jedním požadavkem.
export async function POST(req: Request) {
  if (!jeUkazkova() || !zNasehoWebu(req))
    return new Response("Nedostupné.", { status: 404 });

  const data = await req.formData();
  const cislo = String(data.get("c") ?? "");
  const o = await nacti(cislo);
  if (!o) return Response.redirect(`${zaklad(req)}/obchod/objednavka/${cislo}`, 303);

  if (o.platba.id === "karta" && o.platba.stav !== "zaplaceno") {
    o.platba.stav = data.get("vysledek") === "zaplaceno" ? "zaplaceno" : "zruseno";
    await uloz(o, jeHttps(req));
  }
  return Response.redirect(`${zaklad(req)}/obchod/objednavka/${cislo}`, 303);
}

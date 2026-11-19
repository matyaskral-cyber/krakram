import { brana } from "@/lib/obchod/server/platba";
import { jeHttps, nacti, uloz, zaklad, zNasehoWebu } from "@/lib/obchod/server/uloziste";

export const dynamic = "force-dynamic";

// Druhý pokus o platbu kartou u objednávky, která ještě není zaplacená.
export async function POST(req: Request) {
  if (!zNasehoWebu(req)) return new Response("Nedostupné.", { status: 403 });

  const cislo = String((await req.formData()).get("c") ?? "");
  const zpet = `${zaklad(req)}/obchod/objednavka/${cislo}`;
  const o = await nacti(cislo);
  if (!o || o.platba.id !== "karta" || o.platba.stav === "zaplaceno")
    return Response.redirect(zpet, 303);

  try {
    const b = brana();
    const platba = await b.zaloz(o, zaklad(req));
    o.platba = { ...o.platba, stav: "ceka", brana: b.nazev, idPlatby: platba.id };
    await uloz(o, jeHttps(req));
    return Response.redirect(new URL(platba.url, zaklad(req)).toString(), 303);
  } catch (e) {
    console.error("[obchod] bránu se nepodařilo oslovit", e);
    return Response.redirect(zpet, 303);
  }
}

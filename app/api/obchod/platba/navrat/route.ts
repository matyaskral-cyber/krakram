import { brana, jeUkazkova } from "@/lib/obchod/server/platba";
import { jeHttps, nacti, uloz, zaklad } from "@/lib/obchod/server/uloziste";

export const dynamic = "force-dynamic";

// Sem brána vrátí zákazníka po platbě. Tomu, co stojí v adrese, se nevěří:
// stav platby si e-shop vyžádá přímo od brány a teprve ten zapíše.
export async function GET(req: Request) {
  const cislo = new URL(req.url).searchParams.get("c") ?? "";
  const zpet = `${zaklad(req)}/obchod/objednavka/${cislo}`;
  const o = await nacti(cislo);

  if (o?.platba.idPlatby && o.platba.stav !== "zaplaceno" && !jeUkazkova()) {
    try {
      o.platba.stav = await brana().stav(o.platba.idPlatby);
      await uloz(o, jeHttps(req));
    } catch (e) {
      console.error("[obchod] stav platby se nepodařilo zjistit", e);
    }
  }
  return Response.redirect(zpet, 303);
}

import { fioZapnuto, prevodDorazil } from "@/lib/obchod/server/fio";
import { jeHttps, nacti, uloz } from "@/lib/obchod/server/uloziste";

export const dynamic = "force-dynamic";

// Stránka se stavem objednávky se sem ptá, jestli už převod dorazil.
export async function GET(req: Request) {
  const o = await nacti(new URL(req.url).searchParams.get("c") ?? "");
  if (!o || o.platba.id !== "prevod") return Response.json({ zaplaceno: false });
  if (o.platba.stav === "zaplaceno") return Response.json({ zaplaceno: true });
  try {
    if (fioZapnuto() && (await prevodDorazil(o.cislo, o.ceny.celkem))) {
      o.platba = { ...o.platba, stav: "zaplaceno", brana: "Fio" };
      await uloz(o, jeHttps(req));
      return Response.json({ zaplaceno: true });
    }
  } catch (e) {
    console.error("[obchod] Fio API neodpovídá", e);
  }
  return Response.json({ zaplaceno: false, hlida: fioZapnuto() });
}

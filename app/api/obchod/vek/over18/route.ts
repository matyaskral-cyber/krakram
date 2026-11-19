import { nastaveni } from "@/lib/obchod/server/nastaveni";
import { jeHttps, zNasehoWebu } from "@/lib/obchod/server/uloziste";
import { ulozVek } from "@/lib/obchod/server/vek";

export const dynamic = "force-dynamic";

// Jeden kód smí ověřit jen jeden prohlížeč. Paměť drží jen tenhle běžící
// server, takže je to slabá pojistka. PŘED SPUŠTĚNÍM (s databází): použité
// kódy ukládat trvale a ověření vázat na účet zákazníka.
const pouzite = new Map<string, number>();
const DEN = 864e5;

// Ostré ověření přes Ověř18. Prohlížeč pošle kód, který mu vydal widget;
// tomu se nevěří, výsledek si server vyžádá přímo u služby.
// NAPSÁNO PODLE DOKUMENTACE (over18.cz/integrace-api.html), NEZKOUŠENO —
// k tomu je potřeba klíč z registrace.
export async function POST(req: Request) {
  if (nastaveni.vek !== "over18" || !zNasehoWebu(req))
    return Response.json({ chyba: "Nedostupné." }, { status: 404 });

  const { kod } = await req.json().catch(() => ({}));
  if (typeof kod !== "string" || !/^[\w-]{6,200}$/.test(kod))
    return Response.json({ overeno: false, ukazka: false });
  if (pouzite.has(kod)) return Response.json({ overeno: false, ukazka: false });
  // Zapsat hned, ještě před dotazem na službu, ať dva souběžné požadavky
  // se stejným kódem neprojdou oba. Staré záznamy se mažou podle stáří.
  const ted = Date.now();
  pouzite.set(kod, ted);
  for (const [k, kdy] of pouzite) if (ted - kdy > DEN) pouzite.delete(k);

  try {
    const odpoved = await fetch(
      `https://api.over18.cz/result/${nastaveni.over18Klic}/${kod}`,
      { cache: "no-store" },
    );
    const data = await odpoved.json();
    // 1 = věk ověřen a je 18+, 2 = ověřen, ale mladší, 0 = neplatné
    if (Number(data.status) !== 1) {
      pouzite.delete(kod);
      return Response.json({ overeno: false, ukazka: false });
    }
  } catch (e) {
    pouzite.delete(kod);
    console.error("[obchod] Ověř18 neodpovídá", e);
    return Response.json({ chyba: "Ověřovací služba teď neodpovídá." }, { status: 502 });
  }
  const o = await ulozVek("Ověř18", jeHttps(req));
  return Response.json({ overeno: true, ukazka: false, ...o });
}

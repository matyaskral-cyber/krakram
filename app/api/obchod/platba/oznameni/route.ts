import { brana, jeUkazkova } from "@/lib/obchod/server/platba";

export const dynamic = "force-dynamic";

// Sem brána na pozadí oznámí změnu stavu platby (i když zákazník zavře okno).
// Oznámení není podepsané, proto se stav vždy ověřuje dotazem přímo u brány.
// PŘED SPUŠTĚNÍM: výsledek zapsat k objednávce v databázi. Dokud objednávka
// žije jen v cookie zákazníka, není tu kam zapisovat, takže se jen zaloguje.
export async function GET(req: Request) {
  const u = new URL(req.url).searchParams;
  const id = u.get("id");
  if (!jeUkazkova() && id && /^\d+$/.test(id)) {
    try {
      console.info(
        `[obchod] oznámení brány: objednávka ${u.get("c")}, platba ${id}: ${await brana().stav(id)}`,
      );
    } catch (e) {
      console.error("[obchod] oznámení brány se nepodařilo ověřit", e);
      return new Response("chyba", { status: 500 });
    }
  }
  return new Response("OK");
}

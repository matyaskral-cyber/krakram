import type { Metadata } from "next";
import Navrh from "@/components/obchod/Navrh";
import Stranka from "@/components/obchod/Stranka";
import { DOPRAVY, PLATBY } from "@/lib/obchod/objednavka";
import { DOPRAVA_ZDARMA_OD, kc } from "@/lib/obchod/produkty";

export const metadata: Metadata = { title: "Doprava a platba" };

const cena = (n: number) => (n ? kc(n) : "zdarma");

export default function DopravaAPlatba() {
  return (
    <Stranka
      nadpis="Doprava a platba"
      uvod="Tři způsoby, jak se k vám objednávka dostane, a čtyři, jak ji zaplatit. Co objednáte v pracovní den, odchází nejpozději další pracovní den."
      oddily={[
        {
          nadpis: "Doprava",
          obsah: [
            DOPRAVY.map((d) => `${d.nazev}: ${cena(d.cena)}. ${d.popis}.`),
            `Od ${kc(DOPRAVA_ZDARMA_OD)} je doprava zdarma.`,
            "Do samoobslužných boxů neposíláme. Zásilku musí předat člověk, který zkontroluje doklad.",
          ],
        },
        {
          nadpis: "Platba",
          obsah: [
            PLATBY.map((p) => `${p.nazev}: ${cena(p.cena)}. ${p.popis}.`),
            "U převodu dostanete QR kód s částkou i variabilním symbolem. Balit začínáme, jakmile platba dorazí.",
          ],
        },
        {
          nadpis: "Balení",
          obsah: [
            "Obyčejná krabice nebo obálka bez loga a bez popisu obsahu. Na štítku je jen vaše adresa a naše firma.",
          ],
        },
        {
          nadpis: "Kam posíláme",
          obsah: ["Jen po České republice."],
        },
      ]}
    >
      <Navrh className="mt-8 max-w-2xl">
        ceny dopravy a platby jsou pracovní, upřesní se podle smluv s dopravcem
        a bránou.
      </Navrh>
    </Stranka>
  );
}

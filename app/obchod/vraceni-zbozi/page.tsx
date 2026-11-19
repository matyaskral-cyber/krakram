import type { Metadata } from "next";
import Navrh from "@/components/obchod/Navrh";
import Stranka from "@/components/obchod/Stranka";

export const metadata: Metadata = { title: "Vrácení a reklamace" };

export default function Vraceni() {
  return (
    <Stranka
      nadpis="Vrácení a reklamace"
      uvod="Rozmysleli jste si to, nebo dorazilo něco jinak, než mělo? Napište nám, vyřešíme to."
      oddily={[
        {
          nadpis: "Vrácení do 14 dnů",
          obsah: [
            "Od převzetí máte 14 dní na to, abyste od koupě odstoupili, a nemusíte říkat proč. Stačí e-mail s číslem objednávky.",
            "Zpátky bereme jen zboží v neporušeném původním obalu. Otevřené sáčky, krabičky a pera z hygienických důvodů vrátit nejde.",
            "Peníze pošleme do 14 dnů od odstoupení, stejnou cestou, jakou jste platili. Počkat ale můžeme na to, až nám zboží dorazí zpět. Poštovné za vrácení platíte vy.",
          ],
        },
        {
          nadpis: "Reklamace",
          obsah: [
            "Přišlo něco poškozeného, jiného, nebo to nefunguje? Pošlete nám fotku a číslo objednávky. Na vadu, kterou zboží mělo při převzetí, se můžete ozvat do dvou let.",
            "Reklamaci vyřídíme co nejdřív, nejpozději do 30 dnů.",
          ],
        },
        {
          nadpis: "Kam psát",
          obsah: [
            "info@ksh-partners.cz, telefon +420 774 982 675. Vrátit i reklamovat můžete také osobně na kterékoli prodejně.",
            "Prodávající: KSH Partners s.r.o., IČO 23990368, Chudenická 1059/30, 102 00 Praha 10.",
          ],
        },
        {
          nadpis: "Když se nedohodneme",
          obsah: [
            "Spor můžete řešit mimosoudně u České obchodní inspekce, www.coi.cz.",
          ],
        },
      ]}
    >
      <Navrh className="mt-8 max-w-2xl">
        shrnutí pro zákazníky, ne právní text. Obchodní podmínky e-shopu
        a reklamační řád musí před spuštěním připravit právník.
      </Navrh>
    </Stranka>
  );
}

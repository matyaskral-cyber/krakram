import type { Metadata } from "next";
import Navrh from "@/components/obchod/Navrh";
import Stranka from "@/components/obchod/Stranka";

export const metadata: Metadata = { title: "Ověření věku" };

export default function OvereniVeku() {
  return (
    <Stranka
      nadpis="Ověření věku"
      uvod="U zboží Canapuff nestačí odkliknout, že vám bylo osmnáct. Věk opravdu ověřujeme, buď online v pokladně, nebo podle dokladu na prodejně."
      oddily={[
        {
          nadpis: "Čeho se to týká",
          obsah: [
            "Zboží značky Canapuff: květů, jointů a vapů. Prodej osobám mladším 18 let je u něj zakázán.",
            "CBD květ, kava a kanna jsou sběratelské předměty a věk se u nich neověřuje.",
          ],
        },
        {
          nadpis: "Jak to probíhá",
          obsah: [
            "Když máte v košíku zboží Canapuff a platíte kartou nebo převodem, přibude v pokladně krok Ověření věku. Nikam vás neposíláme, uděláte to přímo tam. Vyberete si jeden ze tří způsobů:",
            [
              "Bankovní identita. Přihlásíte se do své banky stejně jako do internetového bankovnictví. Je to stejná identita, kterou se hlásíte na úřady.",
              "MojeID. Přihlásíte se ověřeným účtem MojeID.",
              "Doklad totožnosti. Nahrajete fotku občanky nebo pasu a služba z ní přečte datum narození.",
            ],
            "Dokud ověření neproběhne, objednávku s tímhle zbožím nejde odeslat.",
          ],
        },
        {
          nadpis: "Co se o vás dozvíme",
          obsah: [
            "Jen ano, nebo ne. Ověření dělá specializovaná služba a nám pošle pouze to, jestli jste plnoletí. Jméno, datum narození, číslo dokladu ani fotku nevidíme a neukládáme.",
            "Výsledek si pamatujeme 180 dní v prohlížeči, ve kterém jste ověření udělali. Při dalším nákupu se už neptáme.",
          ],
        },
        {
          nadpis: "Bez ověření online",
          obsah: [
            "Nechcete nic ověřovat online? V pokladně zvolte vyzvednutí na prodejně a platbu až na místě. Zboží vám odložíme a věk ověří obsluha podle občanky u pultu.",
          ],
        },
      ]}
    >
      <Navrh className="mt-8 max-w-2xl">
        ověření je zatím ukázkové. Ostré se zapne po smlouvě s ověřovací
        službou; do té doby se tyhle texty mohou v detailech změnit.
      </Navrh>
    </Stranka>
  );
}

import type { Metadata } from "next";
import Navrh from "@/components/obchod/Navrh";
import Stranka from "@/components/obchod/Stranka";

export const metadata: Metadata = { title: "Ověření věku" };

export default function OvereniVeku() {
  return (
    <Stranka
      nadpis="Ověření věku"
      uvod="Prodej osobám mladším 18 let je zakázán. U části zboží nestačí odkliknout, že vám bylo osmnáct. Zákon chce, abychom to opravdu ověřili."
      oddily={[
        {
          nadpis: "Čeho se to týká",
          obsah: [
            "Konopných květů, jointů a vapů. Zákon je řadí mezi bylinné výrobky určené ke kouření a elektronické cigarety a u těch se věk ověřuje elektronicky už při nákupu na dálku.",
            "U kavy a kanny stačí doklad při převzetí.",
          ],
        },
        {
          nadpis: "Jak to probíhá",
          obsah: [
            "V pokladně je krok Ověření věku. Nikam vás neposíláme, uděláte to přímo tam. Vyberete si jeden ze tří způsobů:",
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
          nadpis: "Při převzetí",
          obsah: [
            "Doklad si vezměte i tak. Obsluha výdejního místa, kurýr i naše prodejna vydají zásilku jen dospělému, který ho ukáže. Když u toho nebudete vy, musí být dospělý ten, kdo balík přebírá.",
          ],
        },
        {
          nadpis: "Když to nejde",
          obsah: [
            "Nemáte bankovní identitu ani doklad po ruce? Stavte se na kterékoli prodejně. Tam stačí ukázat občanku u pultu.",
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

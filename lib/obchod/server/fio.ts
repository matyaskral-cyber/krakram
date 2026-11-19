// Vlastní „brána“ pro převody: e-shop se přes API Fio banky sám podívá,
// jestli na účet dorazila platba se správným variabilním symbolem a částkou.
// Bez poplatků; s okamžitými platbami je objednávka zaplacená do minuty.
// Zapne se proměnnou FIO_TOKEN (token jen ke čtení, z internetového
// bankovnictví Fio). NAPSÁNO PODLE DOKUMENTACE FIO, NEZKOUŠENO — chybí token.

import { nastaveni } from "./nastaveni";

type Pohyb = { vs: string; castka: number; mena: string; den: string };

// Fio dovoluje jeden dotaz za 30 s na token, proto se odpověď chvíli drží.
let pamet: { kdy: number; pohyby: Pohyb[] } | null = null;

// Jen s vlastním tajemstvím a skutečným účtem: bez nich by šel stav
// „zaplaceno“ v cookie podvrhnout nebo by QR kód mířil na ukázkový účet.
//
// VYPNUTO, dokud objednávky nežijí v databázi. Bez ní nejde zaručit, že se
// variabilní symbol neopakuje a že jedna platba nezaplatí dvě objednávky
// (k tomu je potřeba trvale si zapsat ID bankovního pohybu k objednávce).
// Až databáze bude, doplnit ten zápis a přepnout na true.
const OBJEDNAVKY_V_DATABAZI = false;

export const fioZapnuto = () =>
  OBJEDNAVKY_V_DATABAZI &&
  Boolean(process.env.FIO_TOKEN && nastaveni.tajemstvi && nastaveni.iban);

async function pohyby(): Promise<Pohyb[]> {
  if (pamet && Date.now() - pamet.kdy < 35_000) return pamet.pohyby;
  const den = (d: Date) => d.toISOString().slice(0, 10);
  const od = den(new Date(Date.now() - 14 * 864e5));
  const odpoved = await fetch(
    `https://fioapi.fio.cz/v1/rest/periods/${process.env.FIO_TOKEN}/${od}/${den(new Date())}/transactions.json`,
    { cache: "no-store" },
  );
  // 409 = ptáme se moc často; vrátíme, co víme z minula
  if (!odpoved.ok) return pamet?.pohyby ?? [];
  const data = await odpoved.json();
  const seznam: Record<string, { value: unknown } | null>[] =
    data?.accountStatement?.transactionList?.transaction ?? [];
  const nove = seznam.map((t) => ({
    castka: Number(t.column1?.value ?? 0),
    vs: String(t.column5?.value ?? ""),
    mena: String(t.column14?.value ?? ""),
    den: String(t.column0?.value ?? "").slice(0, 10),
  }));
  pamet = { kdy: Date.now(), pohyby: nove };
  return nove;
}

// Dorazila platba k téhle objednávce? Musí sedět variabilní symbol, částka
// přesně na korunu a platba nesmí být starší než objednávka.
// PŘED SPUŠTĚNÍM (s databází): čísla objednávek brát z číselné řady, aby se
// variabilní symbol nemohl opakovat, a ke každé objednávce si zapsat ID
// bankovního pohybu, aby jedna platba nemohla zaplatit dvě objednávky.
export async function prevodDorazil(vs: string, castka: number, vytvoreno: string) {
  if (!fioZapnuto()) return false;
  const odDne = vytvoreno.slice(0, 10);
  return (await pohyby()).some(
    (p) =>
      p.vs.replace(/^0+/, "") === vs.replace(/^0+/, "") &&
      p.mena === "CZK" &&
      Math.round(p.castka * 100) === castka * 100 &&
      p.den >= odDne,
  );
}

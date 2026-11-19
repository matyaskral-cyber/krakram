// Vlastní „brána“ pro převody: e-shop se přes API Fio banky sám podívá,
// jestli na účet dorazila platba se správným variabilním symbolem a částkou.
// Bez poplatků; s okamžitými platbami je objednávka zaplacená do minuty.
// Zapne se proměnnou FIO_TOKEN (token jen ke čtení, z internetového
// bankovnictví Fio). NAPSÁNO PODLE DOKUMENTACE FIO, NEZKOUŠENO — chybí token.

type Pohyb = { vs: string; castka: number; mena: string };

// Fio dovoluje jeden dotaz za 30 s na token, proto se odpověď chvíli drží.
let pamet: { kdy: number; pohyby: Pohyb[] } | null = null;

export const fioZapnuto = () => Boolean(process.env.FIO_TOKEN);

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
  }));
  pamet = { kdy: Date.now(), pohyby: nove };
  return nove;
}

// Dorazila platba s tímhle variabilním symbolem aspoň v dané výši?
export async function prevodDorazil(vs: string, castka: number) {
  if (!fioZapnuto()) return false;
  const prislo = (await pohyby())
    .filter((p) => p.vs.replace(/^0+/, "") === vs.replace(/^0+/, "") && p.mena === "CZK" && p.castka > 0)
    .reduce((a, p) => a + p.castka, 0);
  return prislo >= castka;
}

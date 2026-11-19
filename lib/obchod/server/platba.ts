// Platební brána za jednotným rozhraním. E-shop zná jen `zaloz` a `stav`,
// takže výměna brány znamená napsat jeden nový objekt, ne přepsat pokladnu.

import type { Objednavka, StavPlatby } from "../objednavka";
import { nastaveni } from "./nastaveni";

export type Brana = {
  nazev: string;
  // Založí platbu a vrátí adresu, kam zákazníka poslat zaplatit.
  zaloz(o: Objednavka, web: string): Promise<{ id: string; url: string }>;
  // Zeptá se brány, jak platba dopadla. Návratu zákazníka z brány se nevěří,
  // rozhoduje až tahle odpověď přímo od brány.
  stav(id: string): Promise<StavPlatby>;
};

// Ukázková brána: stránka v e-shopu, kde se platba jen předvede.
const ukazkova: Brana = {
  nazev: "ukázková",
  async zaloz(o) {
    return { id: `ukazka-${o.cislo}`, url: `/obchod/platba/test?c=${o.cislo}` };
  },
  async stav() {
    return "ceka";
  },
};

// GoPay (doc.gopay.cz). NAPSÁNO PODLE DOKUMENTACE, PROTI BRÁNĚ NEZKOUŠENO —
// k tomu jsou potřeba přihlašovací údaje ze zkušebního účtu GoPay.
const GOPAY = () =>
  process.env.GOPAY_OSTRY === "1"
    ? "https://gate.gopay.cz/api"
    : "https://gw.sandbox.gopay.com/api";

async function gopayToken(rozsah: "payment-create" | "payment-all") {
  const e = process.env;
  const odpoved = await fetch(`${GOPAY()}/oauth2/token`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      authorization: `Basic ${Buffer.from(`${e.GOPAY_CLIENT_ID}:${e.GOPAY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: `grant_type=client_credentials&scope=${rozsah}`,
    cache: "no-store",
  });
  if (!odpoved.ok) throw new Error(`GoPay token: ${odpoved.status}`);
  return (await odpoved.json()).access_token as string;
}

const gopay: Brana = {
  nazev: "GoPay",
  async zaloz(o, web) {
    const token = await gopayToken("payment-create");
    const odpoved = await fetch(`${GOPAY()}/payments/payment`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        payer: {
          contact: {
            first_name: o.zakaznik.jmeno,
            last_name: o.zakaznik.prijmeni,
            email: o.zakaznik.email,
          },
        },
        target: { type: "ACCOUNT", goid: Number(process.env.GOPAY_GOID) },
        amount: o.ceny.celkem * 100, // v haléřích
        currency: "CZK",
        order_number: o.cislo,
        order_description: `Objednávka ${o.cislo}`,
        lang: "CS",
        callback: {
          return_url: `${web}/api/obchod/platba/navrat?c=${o.cislo}`,
          notification_url: `${web}/api/obchod/platba/oznameni?c=${o.cislo}`,
        },
      }),
      cache: "no-store",
    });
    if (!odpoved.ok) throw new Error(`GoPay založení platby: ${odpoved.status}`);
    const data = await odpoved.json();
    return { id: String(data.id), url: data.gw_url as string };
  },
  async stav(id) {
    const token = await gopayToken("payment-all");
    const odpoved = await fetch(`${GOPAY()}/payments/payment/${id}`, {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!odpoved.ok) throw new Error(`GoPay stav platby: ${odpoved.status}`);
    const { state } = await odpoved.json();
    if (state === "PAID") return "zaplaceno";
    if (state === "CANCELED" || state === "TIMEOUTED") return "zruseno";
    return "ceka";
  },
};

export const jeUkazkova = () => nastaveni.brana === "test";
export const brana = (): Brana => (jeUkazkova() ? ukazkova : gopay);

// Výsledek ověření věku si pamatujeme v podepsané cookie, aby se stálý
// zákazník nemusel ověřovat při každém nákupu. Neukládá se nic než způsob
// a datum: žádné jméno, datum narození ani číslo dokladu.

import { cookies } from "next/headers";
import { over, podepis } from "./podpis";

const COOKIE = "kk-vek";
// Jak dlouho ověření platí pro další nákupy z téhož prohlížeče.
export const PLATNOST_DNI = 180;

export type Overeni = { metoda: string; kdy: string };

export async function nactiVek(): Promise<Overeni | null> {
  const o = over<Overeni>((await cookies()).get(COOKIE)?.value);
  if (!o?.kdy) return null;
  const stari = Date.now() - new Date(o.kdy).getTime();
  return stari >= 0 && stari < PLATNOST_DNI * 864e5 ? o : null;
}

export async function ulozVek(metoda: string, https: boolean) {
  const o: Overeni = { metoda, kdy: new Date().toISOString() };
  (await cookies()).set(COOKIE, podepis(o), {
    httpOnly: true,
    sameSite: "lax",
    secure: https,
    path: "/",
    maxAge: PLATNOST_DNI * 86400,
  });
  return o;
}

export async function zapomenVek() {
  (await cookies()).delete(COOKIE);
}

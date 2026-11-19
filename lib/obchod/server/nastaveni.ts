// Co je zapnuté. Bez proměnných prostředí běží e-shop v ukázkovém režimu:
// platba i ověření věku se jen předvádějí a nikam se nic neposílá.
//
//   OBCHOD_TAJEMSTVI   náhodný řetězec, kterým se podepisují objednávky
//   OBCHOD_UCET        číslo účtu pro QR platbu (IBAN nebo 123-456789/0100)
//   OBCHOD_BRANA       „gopay“ zapne ostrou platební bránu
//   GOPAY_GOID, GOPAY_CLIENT_ID, GOPAY_CLIENT_SECRET
//   GOPAY_OSTRY        „1“ = ostrý provoz, jinak zkušební prostředí GoPay
//   FIO_TOKEN          token Fio banky zapne automatické párování převodů
//   OVER18_KLIC        klíč služby Ověř18 zapne ostré ověřování věku

import { naIban } from "../qr";

const e = process.env;
const tajemstvi = Boolean(e.OBCHOD_TAJEMSTVI);

export const nastaveni = {
  tajemstvi,
  // Ostré služby se zapnou jen s vlastním tajemstvím. Bez něj by šel podpis
  // objednávky nebo ověření věku podvrhnout.
  brana:
    tajemstvi &&
    e.OBCHOD_BRANA === "gopay" &&
    e.GOPAY_GOID &&
    e.GOPAY_CLIENT_ID &&
    e.GOPAY_CLIENT_SECRET
      ? ("gopay" as const)
      : ("test" as const),
  // Ostré ověřování věku přes službu Ověř18 (over18.cz): klíč OVER18_KLIC.
  vek: tajemstvi && e.OVER18_KLIC ? ("over18" as const) : ("test" as const),
  over18Klic: e.OVER18_KLIC ?? "",
  iban: e.OBCHOD_UCET ? naIban(e.OBCHOD_UCET) : null,
};

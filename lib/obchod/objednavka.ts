// Výpočet objednávky. Stejný kód běží v prohlížeči (pokladna ukazuje ceny)
// i na serveru — ten si všechno spočítá znovu a cenám z prohlížeče nevěří.

import {
  DOPRAVA_ZDARMA_OD,
  najdiProdukt,
  type Produkt,
  type Varianta,
} from "./produkty";

export type Polozka = { slug: string; varianta: string; ks: number };
export type Radek = Polozka & { produkt: Produkt; v: Varianta };

export type DopravaId = "vydejna" | "kuryr" | "odber";
export type PlatbaId = "karta" | "prevod" | "prodejna";

export const MAX_KS = 20;
// Kdo platí až u pultu, tomu věk ověří obsluha podle dokladu.
export const REZERVACE_BEZ_OVERENI = true;

export const DOPRAVY: {
  id: DopravaId;
  nazev: string;
  popis: string;
  cena: number;
}[] = [
  {
    id: "vydejna",
    nazev: "Výdejní místo Zásilkovny",
    popis: "Výdejní místa i boxy po celém Česku",
    cena: 79,
  },
  {
    id: "kuryr",
    nazev: "Kurýr na adresu",
    popis: "Doveze až ke dveřím",
    cena: 129,
  },
  {
    id: "odber",
    nazev: "Vyzvednu na prodejně",
    popis: "Zdarma, na kterékoli z pěti prodejen",
    cena: 0,
  },
];

export const PLATBY: {
  id: PlatbaId;
  nazev: string;
  popis: string;
  cena: number;
  doprava: DopravaId[];
}[] = [
  {
    id: "karta",
    nazev: "Kartou online",
    popis: "Karta, Apple Pay nebo Google Pay",
    cena: 0,
    doprava: ["vydejna", "kuryr", "odber"],
  },
  {
    id: "prevod",
    nazev: "Převodem přes QR kód",
    popis: "Kód naskenujete v bankovní aplikaci",
    cena: 0,
    doprava: ["vydejna", "kuryr", "odber"],
  },
  {
    id: "prodejna",
    nazev: "Až na prodejně",
    popis: "Hotově nebo kartou při vyzvednutí",
    cena: 0,
    doprava: ["odber"],
  },
];

export const platbyPro = (doprava: DopravaId) =>
  PLATBY.filter((p) => p.doprava.includes(doprava));

export function radky(polozky: Polozka[]): Radek[] {
  return polozky.flatMap((p) => {
    const produkt = najdiProdukt(p.slug);
    const v = produkt?.varianty.find((x) => x.id === p.varianta);
    return produkt && v ? [{ ...p, produkt, v }] : [];
  });
}

export function spocitej(
  polozky: Polozka[],
  dopravaId: DopravaId,
  platbaId: PlatbaId,
) {
  const r = radky(polozky);
  const zbozi = r.reduce((a, x) => a + x.ks * x.v.cena, 0);
  const d = DOPRAVY.find((x) => x.id === dopravaId) ?? DOPRAVY[0];
  const p =
    platbyPro(d.id).find((x) => x.id === platbaId) ?? platbyPro(d.id)[0];
  const doprava = zbozi >= DOPRAVA_ZDARMA_OD ? 0 : d.cena;

  // Zboží s kolkem: věk se ověřuje, ostatní je sběratelské a neověřuje se.
  const vekZbozi = r.filter((x) => x.produkt.vek === "online");
  // Rezervace s platbou u pultu: věk ověří obsluha, online krok odpadá.
  const naProdejne =
    REZERVACE_BEZ_OVERENI && d.id === "odber" && p.id === "prodejna";

  return {
    radky: r,
    d,
    p,
    zbozi,
    doprava,
    platba: p.cena,
    celkem: zbozi + doprava + p.cena,
    vekZbozi,
    overitVek: vekZbozi.length > 0 && !naProdejne,
  };
}

export type Zakaznik = {
  jmeno: string;
  prijmeni: string;
  email: string;
  telefon: string;
};

export type Adresa = { ulice: string; mesto: string; psc: string };

export type StavPlatby = "ceka" | "zaplaceno" | "zruseno";

export type Objednavka = {
  cislo: string;
  vytvoreno: string;
  polozky: Polozka[];
  ceny: { zbozi: number; doprava: number; platba: number; celkem: number };
  doprava: {
    id: DopravaId;
    // výdejní místo, nebo slug prodejny u osobního odběru
    misto?: string;
    adresa?: Adresa;
  };
  platba: {
    id: PlatbaId;
    stav: StavPlatby;
    brana?: string;
    idPlatby?: string;
  };
  zakaznik: Zakaznik;
  // online = ověřeno v pokladně, prodejna = ověří obsluha u pultu,
  // zadne = v košíku je jen sběratelské zboží, věk se neověřuje
  vek: { zpusob: "online" | "prodejna" | "zadne"; metoda?: string };
  poznamka?: string;
};

// To, co pokladna posílá na server.
export type Pozadavek = {
  polozky: Polozka[];
  doprava: DopravaId;
  platba: PlatbaId;
  misto?: string;
  adresa?: Adresa;
  zakaznik: Zakaznik;
  poznamka?: string;
  souhlas: boolean;
};

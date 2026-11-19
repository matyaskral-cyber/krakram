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
export type PlatbaId = "karta" | "prevod" | "dobirka" | "prodejna";

export const MAX_KS = 20;
export const REZERVACE_BEZ_OVERENI = false;

export const DOPRAVY: {
  id: DopravaId;
  nazev: string;
  popis: string;
  cena: number;
}[] = [
  {
    id: "vydejna",
    nazev: "Výdejní místo Zásilkovny",
    popis: "Jen místa s obsluhou, ta zkontroluje doklad",
    cena: 79,
  },
  {
    id: "kuryr",
    nazev: "Kurýr na adresu",
    popis: "Předá jen dospělému, podle dokladu",
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
    id: "dobirka",
    nazev: "Při převzetí",
    popis: "Zaplatíte dopravci, hotově nebo kartou",
    cena: 39,
    doprava: ["vydejna", "kuryr"],
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

  // Zboží, u kterého zákon chce věk ověřit už při prodeji na dálku.
  const vekZbozi = r.filter((x) => x.produkt.vek === "online");
  // Rezervace s platbou u pultu: úřady nikde nepotvrdily, že nejde o prodej
  // na dálku, proto se věk ověřuje i tady (stejně to dělají velké vape
  // e-shopy). Kdyby právník řekl opak, stačí přepnout REZERVACE_BEZ_OVERENI.
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
  // predani = v košíku není nic, co by chtělo ověření předem
  vek: { zpusob: "online" | "prodejna" | "predani"; metoda?: string };
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

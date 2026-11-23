import { randomInt } from "node:crypto";
import {
  DOPRAVY,
  MAX_KS,
  platbyPro,
  spocitej,
  type Objednavka,
  type Polozka,
  type Pozadavek,
} from "@/lib/obchod/objednavka";
import { brana } from "@/lib/obchod/server/platba";
import { jeHttps, uloz, zaklad, zNasehoWebu } from "@/lib/obchod/server/uloziste";
import { nactiVek } from "@/lib/obchod/server/vek";
import { branches } from "@/lib/pobocky";

export const dynamic = "force-dynamic";

const chyba = (stav: number, text: string) =>
  Response.json({ chyba: text }, { status: stav });

const text = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "";

// Z košíku z prohlížeče zůstane jen to, co dává smysl: známé položky,
// celé kusy v povoleném rozsahu, každá varianta jednou.
function procisti(vstup: unknown): Polozka[] {
  if (!Array.isArray(vstup)) return [];
  const mapa = new Map<string, Polozka>();
  for (const x of vstup.slice(0, 60)) {
    const slug = text(x?.slug, 80);
    const varianta = text(x?.varianta, 20);
    const ks = Math.floor(Number(x?.ks));
    if (!slug || !varianta || !(ks >= 1)) continue;
    const klic = `${slug}/${varianta}`;
    const uz = mapa.get(klic)?.ks ?? 0;
    mapa.set(klic, { slug, varianta, ks: Math.min(uz + ks, MAX_KS) });
  }
  return [...mapa.values()];
}

// Číslo objednávky slouží i jako variabilní symbol: jen číslice, nejvýš deset.
// RRMMDD + čtyři náhodné číslice. S databází ho nahradí číselná řada.
function noveCislo() {
  const d = new Date();
  const dva = (n: number) => String(n).padStart(2, "0");
  return (
    dva(d.getFullYear() % 100) +
    dva(d.getMonth() + 1) +
    dva(d.getDate()) +
    String(randomInt(0, 10000)).padStart(4, "0")
  );
}

export async function POST(req: Request) {
  if (!zNasehoWebu(req)) return chyba(403, "Požadavek odjinud nepřijímáme.");

  let t: Partial<Pozadavek>;
  try {
    t = await req.json();
  } catch {
    return chyba(400, "Objednávka dorazila poškozená. Zkuste to prosím znovu.");
  }

  const polozky = procisti(t.polozky);
  const doprava = DOPRAVY.find((d) => d.id === t.doprava);
  if (!doprava) return chyba(400, "Vyberte prosím dopravu.");
  if (!platbyPro(doprava.id).some((p) => p.id === t.platba))
    return chyba(400, "Tenhle způsob platby k vybrané dopravě nejde.");

  // Ceny se počítají tady z ceníku, ne z toho, co poslal prohlížeč.
  const v = spocitej(polozky, doprava.id, t.platba!);
  if (v.radky.length === 0) return chyba(400, "Košík je prázdný.");
  if (v.radky.length !== polozky.length)
    return chyba(
      409,
      "Něco z košíku už v nabídce není. Zkontrolujte ho prosím a zkuste to znovu.",
    );

  const zakaznik = {
    jmeno: text(t.zakaznik?.jmeno, 40),
    prijmeni: text(t.zakaznik?.prijmeni, 40),
    email: text(t.zakaznik?.email, 80).toLowerCase(),
    telefon: text(t.zakaznik?.telefon, 20),
  };
  if (!zakaznik.jmeno || !zakaznik.prijmeni)
    return chyba(400, "Doplňte prosím jméno a příjmení.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(zakaznik.email))
    return chyba(400, "E-mail nevypadá správně.");
  if (zakaznik.telefon.replace(/\D/g, "").length < 9)
    return chyba(400, "Telefon nevypadá správně.");

  const kam: Objednavka["doprava"] = { id: doprava.id };
  if (doprava.id === "kuryr") {
    const adresa = {
      ulice: text(t.adresa?.ulice, 80),
      mesto: text(t.adresa?.mesto, 60),
      psc: text(t.adresa?.psc, 6).replace(/\s/g, ""),
    };
    if (!adresa.ulice || !adresa.mesto || !/^\d{5}$/.test(adresa.psc))
      return chyba(400, "Doplňte prosím celou adresu včetně PSČ.");
    kam.adresa = adresa;
  } else if (doprava.id === "odber") {
    const prodejna = branches.find(
      (b) => b.slug === t.misto && b.status === "open",
    );
    if (!prodejna) return chyba(400, "Vyberte prosím prodejnu.");
    kam.misto = prodejna.slug;
  } else {
    kam.misto = text(t.misto, 120);
    if (!kam.misto) return chyba(400, "Vyberte prosím výdejní místo.");
  }

  if (t.souhlas !== true)
    return chyba(400, "Bez souhlasu s obchodními podmínkami to nejde.");

  // Zboží s kolkem bez ověřeného věku neprojde, ani kdyby někdo krok
  // v pokladně obešel.
  const overeni = v.overitVek ? await nactiVek() : null;
  if (v.overitVek && !overeni)
    return chyba(409, "Ještě zbývá ověřit věk.");

  const objednavka: Objednavka = {
    cislo: noveCislo(),
    vytvoreno: new Date().toISOString(),
    polozky,
    ceny: {
      zbozi: v.zbozi,
      doprava: v.doprava,
      platba: v.platba,
      celkem: v.celkem,
    },
    doprava: kam,
    platba: { id: v.p.id, stav: "ceka" },
    zakaznik,
    vek: v.overitVek
      ? { zpusob: "online", metoda: overeni!.metoda }
      : { zpusob: v.vekZbozi.length ? "prodejna" : "zadne" },
    poznamka: text(t.poznamka, 300) || undefined,
  };

  let dalsi = `/obchod/objednavka/${objednavka.cislo}`;
  if (objednavka.platba.id === "karta") {
    try {
      const b = brana();
      const platba = await b.zaloz(objednavka, zaklad(req));
      objednavka.platba.brana = b.nazev;
      objednavka.platba.idPlatby = platba.id;
      dalsi = platba.url;
    } catch (e) {
      console.error("[obchod] bránu se nepodařilo oslovit", e);
      return chyba(
        502,
        "Platební brána teď neodpovídá. Zkuste to za chvilku, nebo zvolte převod.",
      );
    }
  }

  await uloz(objednavka, jeHttps(req));
  return Response.json({ cislo: objednavka.cislo, dalsi });
}

// Sortiment e-shopu KraKrám — jen zboží mimo režim PML (žádný kratom).
// NÁSTŘEL: ceny kromě CBD květu jsou ukázkové a texty pracovní.

export type KategorieId = "cbd" | "kvety" | "jointy" | "vapy" | "sberatelske";

export type Kategorie = {
  id: KategorieId;
  nazev: string;
  kratce: string;
  popis: string;
  barva: string;
  foto: string | null;
};

export type Varianta = { id: string; nazev: string; cena: number };

export type Produkt = {
  slug: string;
  nazev: string;
  znacka: string;
  kategorie: KategorieId;
  barva: string;
  foto: string | null;
  varianty: Varianta[];
  // jedna věta pod názvem; jde i do popisu stránky pro vyhledávače
  veta: string;
  // dva tři krátké odstavce: co to je a jak je to udělané. Žádné účinky.
  popis: string[];
  // vůně v pár slovech (podle výrobce nebo dodavatele)
  tony?: { nadpis: string; seznam: string[]; pozn?: string };
  // na co odkazuje název odrůdy; není to tvrzení o tomhle výrobku
  jmeno?: string;
  parametry: [string, string][];
  vBaleni: string[];
  uchovani: string;
  upozorneni: string;
  // online = zákon chce věk ověřit už při prodeji na dálku (kuřivo, vapy),
  // doklad = prodáváme jen dospělým, doklad se ukazuje při převzetí
  vek: "online" | "doklad";
  stitek?: string;
};

export const kategorie: Kategorie[] = [
  {
    id: "cbd",
    nazev: "CBD květy",
    kratce: "CBD",
    popis: "Technické konopí z Ostravy. Po gramu, nebo po třech.",
    barva: "#B4D777",
    foto: "/obchod/cbd-kvet.webp",

  },
  {
    id: "kvety",
    nazev: "Květy Canapuff",
    kratce: "Květy",
    popis: "Pět odrůd v gramových sáčcích.",
    barva: "#1FB5C9",
    foto: "/obchod/p/29.webp",
  },
  {
    id: "jointy",
    nazev: "Jointy Canapuff",
    kratce: "Jointy",
    popis: "Ubalené, dvougramové, šest druhů.",
    barva: "#F5C518",
    foto: "/obchod/p/16.webp",
  },
  {
    id: "vapy",
    nazev: "Terpenové vapy",
    kratce: "Vapy",
    popis: "Osm příchutí, mililitr v peru.",
    barva: "#E5257E",
    foto: "/obchod/p/32.webp",
  },
  {
    id: "sberatelske",
    nazev: "Kava a kanna",
    kratce: "Sběratelské",
    popis: "Sběratelské rostliny od Vivadzen.",
    barva: "#EE7A1E",
    foto: "/obchod/p/08.webp",
  },
];

const VAROVANI_18 = "Prodej pouze osobám starším 18 let. Uchovávejte mimo dosah dětí.";
const VAROVANI_VAPE =
  "Používání tohoto výrobku škodí vašemu zdraví. Prodej pouze osobám starším 18 let.";
const VAROVANI_SBER =
  "Sběratelský předmět, není určen ke konzumaci. Prodej pouze osobám starším 18 let.";

const UCHOVANI_KVET =
  "V zavřeném obalu, v suchu, chladnu a mimo světlo. Mimo dosah dětí.";
const POZN_VUNE = "Vůni popisuje výrobce.";

// Na co odkazují názvy odrůd. Jde o obecně uváděný původ jména,
// ne o tvrzení o konkrétním výrobku.
const JMENA: Record<string, string> = {
  Amnesia:
    "Amnesia je známá sativní odrůda, nejčastěji se uvádí křížení Cinderella 99 a Jack Herer. Typický je pro ni terpen terpinolen, odtud kořenitá a bylinná vůně.",
  "King Luis XIII":
    "King Louis XIII je odrůda z Kalifornie, uvádí se jako křížení OG Kush a LA Confidential. Čeká se od ní borovice, dřevo a zem.",
  "Laughing Buddha":
    "Laughing Buddha vyšlechtili v Barney's Farm z thajské a jamajské genetiky. V roce 2003 vyhrála Cannabis Cup.",
  "Permanent Marker":
    "Permanent Marker je odrůda od Seed Junky Genetics, Leafly ji vyhlásilo odrůdou roku 2023. Jméno má podle vůně, která připomíná lihový fix.",
  AK47: "AK-47 je hybrid z 90. let složený z kolumbijských, mexických, thajských a afghánských odrůd.",
  "Double OG":
    "Double OG se uvádí jako křížení SFV OG a Big Bud.",
  "Green Crack":
    "Green Crack vychází ze Skunku č. 1. Čeká se od něj citrus a mango.",
  "OG Kush":
    "OG Kush je kalifornská klasika z 90. let. Přesný původ se neví, nejčastěji se uvádí Chemdawg, Lemon Thai a Hindu Kush.",
};

type Rada = { latka: string; deklarace: string; cisto: string };
const RADY: Record<string, Rada> = {
  T9HC: { latka: "T9HC", deklarace: "99 % T9HC", cisto: "99 %" },
  T8HC: { latka: "T8HC", deklarace: "99 % T8HC", cisto: "99 %" },
  "9H-HHC": { latka: "9H-HHC", deklarace: "99 % 9H-HHC", cisto: "99 %" },
  "9H-HHCP": { latka: "9H-HHCP", deklarace: "99 % 9H-HHCP", cisto: "99 %" },
  "9H-THC": { latka: "9H-THC", deklarace: "99 % 9H-THC", cisto: "99 %" },
};

const oProcentech = (latka: string, cisto: string) =>
  `Číslo ${cisto} na obalu je podle výrobce čistota extraktu, kterým je květ obalený. Neříká, kolik ${latka} je v gramu květu. Samotný květ má pod 0,2 % THC.`;

function kvet(
  slug: string,
  latka: string,
  odruda: string,
  barva: string,
  foto: string,
  tony: string[],
  procenta = "99 %",
): Produkt {
  return {
    slug,
    nazev: `${latka} květ ${odruda}`,
    znacka: "Canapuff",
    kategorie: "kvety",
    barva,
    foto: `/obchod/p/${foto}.webp`,
    varianty: [{ id: "1g", nazev: "1 g", cena: 199 }],
    veta: `Gram květu z řady ${latka}. Vůně: ${tony.slice(0, 3).join(", ")}.`,
    popis: [
      `Konopný květ pěstovaný pod střechou, který Canapuff obaluje extraktem ${latka}. V sáčku je gram, stejný, jaký vám podáme přes pult.`,
      oProcentech(latka, procenta),
    ],
    tony: { nadpis: "Vůně", seznam: tony, pozn: POZN_VUNE },
    jmeno: JMENA[odruda],
    parametry: [
      ["Značka", "Canapuff"],
      ["Řada", `${latka} Premium`],
      ["Odrůda", odruda],
      ["Deklarace výrobce", `${procenta} ${latka}`],
      ["THC", "pod 0,2 %"],
      ["Obsah", "1 g"],
      ["Vyrobeno", "v EU"],
    ],
    vBaleni: ["1 g květu", "zipový sáček, dá se znovu zavřít"],
    uchovani: UCHOVANI_KVET,
    upozorneni: VAROVANI_18,
    vek: "online",
  };
}

function joint(
  slug: string,
  latka: string,
  odruda: string,
  barva: string,
  foto: string,
  tony: string[],
  procenta = "99 %",
): Produkt {
  return {
    slug,
    nazev: `${latka} joint ${odruda}`,
    znacka: "Canapuff",
    kategorie: "jointy",
    barva,
    foto: `/obchod/p/${foto}.webp`,
    varianty: [{ id: "2g", nazev: "2 g", cena: 249 }],
    veta: `Ubalený joint, dva gramy. Vůně: ${tony.slice(0, 3).join(", ")}.`,
    popis: [
      `Hotový joint z konopného květu obaleného extraktem ${latka}. Váží 2 g a v krabičce je jeden.`,
      oProcentech(latka, procenta),
    ],
    tony: { nadpis: "Vůně", seznam: tony, pozn: POZN_VUNE },
    jmeno: JMENA[odruda],
    parametry: [
      ["Značka", "Canapuff"],
      ["Řada", `${latka} Premium`],
      ["Odrůda", odruda],
      ["Deklarace výrobce", `${procenta} ${latka}`],
      ["THC", "pod 0,2 %"],
      ["Obsah", "2 g"],
      ["Vyrobeno", "v EU"],
    ],
    vBaleni: ["1 ubalený joint, 2 g", "papírová krabička"],
    uchovani: UCHOVANI_KVET,
    upozorneni: VAROVANI_18,
    vek: "online",
  };
}

function vape(
  slug: string,
  prichut: string,
  barva: string,
  foto: string,
  tony: string[],
): Produkt {
  return {
    slug,
    nazev: `Terpenový vape ${prichut}`,
    znacka: "Canapuff",
    kategorie: "vapy",
    barva,
    foto: `/obchod/p/${foto}.webp`,
    varianty: [{ id: "1ml", nazev: "1 ml", cena: 449 }],
    veta: `Pero s mililitrem terpenové náplně. Vůně: ${tony.slice(0, 3).join(", ")}.`,
    popis: [
      "Malé pero s náplní z terpenů, tedy z látek, které dávají rostlinám vůni. Podle dodavatele v něm není nikotin.",
      "Náplně je mililitr a baterie se dobíjí přes USB-C, takže pero vydrží, dokud náplň nedojde. Zapíná a vypíná se pěti rychlými stisky tlačítka.",
    ],
    tony: { nadpis: "Vůně", seznam: tony, pozn: "Vůni popisuje dodavatel." },
    jmeno: JMENA[prichut],
    parametry: [
      ["Značka", "Canapuff"],
      ["Příchuť", prichut],
      ["Objem náplně", "1 ml"],
      ["Baterie", "350 mAh"],
      ["Dobíjení", "USB-C"],
      ["Výdrž", "až 450 potahů (údaj dodavatele)"],
      ["Nikotin", "bez nikotinu (údaj dodavatele)"],
    ],
    vBaleni: ["1 pero s náplní 1 ml", "krabička"],
    uchovani:
      "V pokojové teplotě, mimo slunce a mimo dosah dětí. Pero má baterii, takže po dosloužení patří do sběru elektra, ne do koše.",
    upozorneni: VAROVANI_VAPE,
    vek: "online",
  };
}

function kava(
  slug: string,
  kultivar: string,
  barva: string,
  foto: string,
  tony: string[],
): Produkt {
  return {
    slug,
    nazev: `Kava kava ${kultivar}`,
    znacka: "Vivadzen",
    kategorie: "sberatelske",
    barva,
    foto: `/obchod/p/${foto}.webp`,
    varianty: [{ id: "50g", nazev: "50 g", cena: 249 }],
    veta: `Mletý kořen pepřovníku opojného, kultivar ${kultivar}. Padesát gramů do sbírky.`,
    popis: [
      `Kava je keř z ostrovů jižního Tichomoří a ${kultivar} je jeden z jeho pojmenovaných kultivarů. Dodavatel ho řadí mezi takzvané noble, tedy ušlechtilé.`,
      "V sáčku je jen kořen, žádné stonky ani listy, namletý nastředně. Prodáváme ho jako sběratelský předmět.",
    ],
    tony: {
      nadpis: "Vůně suchého kořene",
      seznam: tony,
      pozn: "Vůni popisuje dodavatel.",
    },
    parametry: [
      ["Značka", "Vivadzen"],
      ["Rostlina", "Piper methysticum"],
      ["Kultivar", kultivar],
      ["Zařazení", "noble"],
      ["Původ", "jižní Tichomoří"],
      ["Forma", "mletý kořen"],
      ["Obsah", "50 g"],
    ],
    vBaleni: ["50 g mletého kořene", "zipový sáček, dá se znovu zavřít"],
    uchovani: "V zavřeném sáčku, v suchu a mimo světlo. Mimo dosah dětí.",
    upozorneni: VAROVANI_SBER,
    vek: "doklad",
  };
}

function kanna(slug: string, gramaz: string, cena: number, barva: string, foto: string): Produkt {
  return {
    slug,
    nazev: "Kanna",
    znacka: "Vivadzen",
    kategorie: "sberatelske",
    barva,
    foto: `/obchod/p/${foto}.webp`,
    varianty: [{ id: gramaz.replace(" ", ""), nazev: gramaz, cena }],
    veta: `Sušená mletá nať kosmatcovníku, ${gramaz} do sbírky.`,
    popis: [
      "Kanna, botanicky Sceletium tortuosum, je drobný sukulent z jižní Afriky. V sáčku je usušená a namletá rostlina, bez extraktů a bez přísad.",
      "Prodáváme ji jako sběratelský předmět.",
    ],
    parametry: [
      ["Značka", "Vivadzen"],
      ["Rostlina", "Sceletium tortuosum"],
      ["Původ", "Jižní Afrika"],
      ["Forma", "sušená mletá rostlina"],
      ["Obsah", gramaz],
    ],
    vBaleni: [`${gramaz} mleté rostliny`, "zipový sáček, dá se znovu zavřít"],
    uchovani: "V zavřeném sáčku, v suchu a mimo světlo. Mimo dosah dětí.",
    upozorneni: VAROVANI_SBER,
    vek: "doklad",
  };
}

export const produkty: Produkt[] = [
  {
    slug: "cbd-kvet",
    nazev: "CBD květ",
    znacka: "Michato",
    kategorie: "cbd",
    barva: "#B4D777",
    foto: "/obchod/cbd-kvet.webp",
    varianty: [
      { id: "1g", nazev: "1 g", cena: 130 },
      { id: "3g", nazev: "3 g", cena: 339 },
    ],
    veta: "Sušený květ technického konopí. Vážíme ho po gramu, nebo po třech.",
    popis: [
      "Květ technického konopí s THC do 1 %. Bereme ho od Michata z Ostravy, stejný máme ve všech pěti prodejnách.",
      "Vážíme ho až při balení objednávky. Odrůda se podle dodávky mění, aktuální vám napíšeme do potvrzení.",
    ],
    parametry: [
      ["Dodavatel", "Michato s.r.o., Ostrava"],
      ["Surovina", "technické konopí"],
      ["THC", "do 1 %"],
      ["Balení", "1 g nebo 3 g"],
    ],
    vBaleni: ["1 g nebo 3 g květu", "uzavíratelný obal"],
    uchovani: UCHOVANI_KVET,
    upozorneni: VAROVANI_18,
    vek: "online",
    stitek: "Z našich prodejen",
  },
  kvet("t9hc-kvet-balanced", "T9HC", "Balanced", "#1FB5C9", "29", ["exotické ovoce", "citrus", "byliny"]),
  kvet("t9hc-kvet-extreemly", "T9HC", "Extreemly", "#C93C9A", "31", ["tropické ovoce", "citrus", "koření"]),
  kvet("t8hc-kvet-gorilla-kush", "T8HC", "Gorilla Kush", "#D8336B", "28", ["zem", "dřevo", "pepř", "lehká sladkost"]),
  kvet("t8hc-kvet-gorilla-power", "T8HC", "Gorilla Power", "#E8553A", "30", ["ovoce", "citrus", "borová pryskyřice", "zem"]),
  kvet("thp420-kvet-amnesia", "THP420", "Amnesia", "#39B6E0", "27", ["koření", "černý pepř", "byliny", "fenykl"], "65 %"),
  joint("9h-hhc-joint-king-luis-xiii", "9H-HHC", "King Luis XIII", "#E0452B", "17", ["borovice", "limetka", "suché koření", "zem"]),
  joint("9h-hhcp-joint-laughing-buddha", "9H-HHCP", "Laughing Buddha", "#F5C518", "16", ["lékořice", "cedr", "skořice", "koření"]),
  joint("9h-thc-joint-permanent-marker", "9H-THC", "Permanent Marker", "#F2A711", "33", ["květiny", "fialové hrozny"]),
  joint("t9hc-joint-deep", "T9HC", "Deep", "#2A7FB8", "35", ["tropické ovoce", "květiny", "koření"]),
  joint("t9hc-joint-extreemly", "T9HC", "Extreemly", "#D6278F", "37", ["tropické ovoce", "citrus", "koření"]),
  joint("thp420-joint-amnesia", "THP420", "Amnesia", "#5B3FA8", "24", ["koření", "černý pepř", "byliny", "fenykl"], "60 %"),
  vape("vape-ak47", "AK47", "#E3411F", "40", ["zem", "borovice", "byliny", "citrus"]),
  vape("vape-double-og", "Double OG", "#D9A520", "26", ["sladké ovoce", "zem"]),
  vape("vape-gorilla-kush", "Gorilla Kush", "#E5257E", "32", ["dřevo", "černý pepř"]),
  vape("vape-gorilla-power", "Gorilla Power", "#E8642A", "39", ["ovoce", "citrus", "borová pryskyřice"]),
  vape("vape-green-crack", "Green Crack", "#5DBB3F", "36", ["citrus", "zem", "sladký závěr"]),
  vape("vape-jungle-monkey", "Jungle Monkey", "#7BD13A", "25", ["tropické ovoce", "citrus", "byliny"]),
  vape("vape-king-gorilla", "King Gorilla", "#C8262C", "38", ["tmavé ovoce", "koření", "zem"]),
  vape("vape-og-kush", "OG Kush", "#8E9AA0", "34", ["pomeranč", "limetka", "benzín"]),
  kava("kava-kava-borongoru", "Borongoru", "#EE7A1E", "08", ["kakao", "ořechy", "pepř", "dřevo"]),
  kava("kava-kava-damu", "Damu", "#D63A2F", "01", ["kakao", "vlašský ořech", "slad", "pepř"]),
  kava("kava-kava-melo-melo", "Melo Melo", "#F2D21B", "04", ["seno", "vanilka", "mandle", "kokos"]),
  kanna("kanna-5g", "5 g", 199, "#A9B8A2", "07"),
  kanna("kanna-10g", "10 g", 349, "#C9D36A", "05"),
];

export const najdiProdukt = (slug: string) => produkty.find((p) => p.slug === slug);
export const najdiKategorii = (id: string) => kategorie.find((k) => k.id === id);
export const cenaOd = (p: Produkt) => Math.min(...p.varianty.map((v) => v.cena));
export const kc = (n: number) => `${n.toLocaleString("cs-CZ").replace(/ /g, " ")} Kč`;

export const DOPRAVA_ZDARMA_OD = 1500;

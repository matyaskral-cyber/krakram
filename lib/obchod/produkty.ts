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
  splyvat?: boolean;
};

export type Varianta = { id: string; nazev: string; cena: number };

export type Produkt = {
  slug: string;
  nazev: string;
  znacka: string;
  kategorie: KategorieId;
  barva: string;
  foto: string | null;
  // fotka má světlé pozadí → prolnout s dlaždicí
  splyvat?: boolean;
  varianty: Varianta[];
  popis: string;
  parametry: [string, string][];
  upozorneni: string;
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
  "Sběratelský produkt. Není určeno k lidské konzumaci. Prodej pouze osobám starším 18 let.";

function kvet(slug: string, latka: string, odruda: string, barva: string, foto: string): Produkt {
  return {
    slug,
    nazev: `${latka} květ ${odruda}`,
    znacka: "Canapuff",
    kategorie: "kvety",
    barva,
    foto: `/obchod/p/${foto}.webp`,
    varianty: [{ id: "1g", nazev: "1 g", cena: 199 }],
    popis: `Květ z řady Canapuff Premium, odrůda ${odruda}. Gram v originálním zipovém sáčku.`,
    parametry: [
      ["Značka", "Canapuff"],
      ["Řada", `${latka} Premium`],
      ["Odrůda", odruda],
      ["Obsah", "1 g"],
      ["Balení", "zipový sáček"],
    ],
    upozorneni: VAROVANI_18,
  };
}

function joint(slug: string, latka: string, odruda: string, barva: string, foto: string): Produkt {
  return {
    slug,
    nazev: `${latka} joint ${odruda}`,
    znacka: "Canapuff",
    kategorie: "jointy",
    barva,
    foto: `/obchod/p/${foto}.webp`,
    varianty: [{ id: "2g", nazev: "2 g", cena: 249 }],
    popis: `Ubalený joint z řady Canapuff Premium, odrůda ${odruda}. Jeden kus v krabičce, 2 g.`,
    parametry: [
      ["Značka", "Canapuff"],
      ["Řada", `${latka} Premium`],
      ["Odrůda", odruda],
      ["Obsah", "2 g"],
      ["Balení", "krabička, 1 ks"],
    ],
    upozorneni: VAROVANI_18,
  };
}

function vape(slug: string, prichut: string, barva: string, foto: string): Produkt {
  return {
    slug,
    nazev: `Terpenový vape ${prichut}`,
    znacka: "Canapuff",
    kategorie: "vapy",
    barva,
    foto: `/obchod/p/${foto}.webp`,
    varianty: [{ id: "1ml", nazev: "1 ml", cena: 449 }],
    popis: `Jednorázové pero Canapuff s terpenovou náplní, příchuť ${prichut}. Mililitr, rozbalíte a funguje.`,
    parametry: [
      ["Značka", "Canapuff"],
      ["Příchuť", prichut],
      ["Objem", "1 ml"],
      ["Typ", "jednorázové pero"],
    ],
    upozorneni: VAROVANI_VAPE,
  };
}

function sber(
  slug: string,
  nazev: string,
  gramaz: string,
  cena: number,
  barva: string,
  foto: string,
  popis: string,
  latinsky: string,
): Produkt {
  return {
    slug,
    nazev,
    znacka: "Vivadzen",
    kategorie: "sberatelske",
    barva,
    foto: `/obchod/p/${foto}.webp`,
    varianty: [{ id: gramaz.replace(" ", ""), nazev: gramaz, cena }],
    popis,
    parametry: [
      ["Značka", "Vivadzen"],
      ["Rostlina", latinsky],
      ["Obsah", gramaz],
      ["Balení", "zipový sáček"],
    ],
    upozorneni: VAROVANI_SBER,
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
    popis:
      "Sušený květ technického konopí, THC do 1 %. Vážíme po gramu a po třech.",
    parametry: [
      ["Dodavatel", "Michato s.r.o., Ostrava"],
      ["Surovina", "technické konopí"],
      ["THC", "do 1 %"],
      ["Balení", "1 g nebo 3 g"],
    ],
    upozorneni: VAROVANI_18,
    stitek: "Z našich prodejen",
  },
  kvet("t9hc-kvet-balanced", "T9HC", "Balanced", "#1FB5C9", "29"),
  kvet("t9hc-kvet-extreemly", "T9HC", "Extreemly", "#C93C9A", "31"),
  kvet("t8hc-kvet-gorilla-kush", "T8HC", "Gorilla Kush", "#D8336B", "28"),
  kvet("t8hc-kvet-gorilla-power", "T8HC", "Gorilla Power", "#E8553A", "30"),
  kvet("thp420-kvet-amnesia", "THP420", "Amnesia", "#39B6E0", "27"),
  joint("9h-hhc-joint-king-luis-xiii", "9H-HHC", "King Luis XIII", "#E0452B", "17"),
  joint("9h-hhcp-joint-laughing-buddha", "9H-HHCP", "Laughing Buddha", "#F5C518", "16"),
  joint("9h-thc-joint-permanent-marker", "9H-THC", "Permanent Marker", "#F2A711", "33"),
  joint("t9hc-joint-deep", "T9HC", "Deep", "#2A7FB8", "35"),
  joint("t9hc-joint-extreemly", "T9HC", "Extreemly", "#D6278F", "37"),
  joint("thp420-joint-amnesia", "THP420", "Amnesia", "#5B3FA8", "24"),
  vape("vape-ak47", "AK47", "#E3411F", "40"),
  vape("vape-double-og", "Double OG", "#D9A520", "26"),
  vape("vape-gorilla-kush", "Gorilla Kush", "#E5257E", "32"),
  vape("vape-gorilla-power", "Gorilla Power", "#E8642A", "39"),
  vape("vape-green-crack", "Green Crack", "#5DBB3F", "36"),
  vape("vape-jungle-monkey", "Jungle Monkey", "#7BD13A", "25"),
  vape("vape-king-gorilla", "King Gorilla", "#C8262C", "38"),
  vape("vape-og-kush", "OG Kush", "#8E9AA0", "34"),
  sber(
    "kava-kava-borongoru",
    "Kava kava Borongoru",
    "50 g",
    249,
    "#EE7A1E",
    "08",
    "Mletý kořen pepřovníku opojného, kultivar Borongoru. Původ Papua-Nová Guinea.",
    "Piper methysticum",
  ),
  sber(
    "kava-kava-damu",
    "Kava kava Damu",
    "50 g",
    249,
    "#D63A2F",
    "01",
    "Mletý kořen pepřovníku opojného, kultivar Damu. Původ Papua-Nová Guinea.",
    "Piper methysticum",
  ),
  sber(
    "kava-kava-melo-melo",
    "Kava kava Melo Melo",
    "50 g",
    249,
    "#F2D21B",
    "04",
    "Mletý kořen pepřovníku opojného, kultivar Melo Melo. Původ Papua-Nová Guinea.",
    "Piper methysticum",
  ),
  sber(
    "kanna-5g",
    "Kanna",
    "5 g",
    199,
    "#A9B8A2",
    "07",
    "Sušená drcená nať kosmatcovníku, menší sáček.",
    "Sceletium tortuosum",
  ),
  sber(
    "kanna-10g",
    "Kanna",
    "10 g",
    349,
    "#C9D36A",
    "05",
    "Sušená drcená nať kosmatcovníku, větší sáček.",
    "Sceletium tortuosum",
  ),
];

export const najdiProdukt = (slug: string) => produkty.find((p) => p.slug === slug);
export const najdiKategorii = (id: string) => kategorie.find((k) => k.id === id);
export const cenaOd = (p: Produkt) => Math.min(...p.varianty.map((v) => v.cena));
export const kc = (n: number) => `${n.toLocaleString("cs-CZ").replace(/ /g, " ")} Kč`;

export const DOPRAVA_ZDARMA_OD = 1500;

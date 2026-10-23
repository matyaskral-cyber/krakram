// Pobočky KraKrám — jediné místo s jejich údaji (úvodní stránka i sortiment).
// skladEnv = název proměnné prostředí s adresou veřejného skladu z PML
// (Web prodejny → Adresa pro web). Bez ní stránka sortimentu ukáže „připravujeme“.

export type Pobocka = {
  slug: string;
  skladEnv: string;
  city: string;
  address: string;
  zip: string;
  hours: string;
  status: "open" | "soon";
  badge: string | null;
  photo: string | null;
  mapsLink: string;
};

export const branches: Pobocka[] = [
  {
    slug: "tabor",
    skladEnv: "PML_SKLAD_TABOR",
    city: "Tábor",
    address: "nám. F. Křižíka 496/10",
    zip: "390 01 Tábor",
    hours: "Po–So: 11:00–19:00 · Ne: 13:00–19:00",
    status: "open",
    badge: null,
    photo: "/pobocka-tabor.jpg",
    mapsLink:
      "https://maps.google.com/maps?q=nám.+F.+Křižíka+496%2F10,+Tábor",
  },
  {
    slug: "jindrichuv-hradec",
    skladEnv: "PML_SKLAD_JH",
    city: "Jindřichův Hradec",
    address: "Klášterská 79/II",
    zip: "377 01 Jindřichův Hradec",
    hours: "Po–So: 10:00–19:00 · Ne: 13:00–19:00",
    status: "open",
    badge: null,
    photo: "/pobocka-jh.jpg",
    mapsLink:
      "https://maps.google.com/maps?q=Klášterská+79,+377+01+Jindřichův+Hradec",
  },
  {
    slug: "dacice",
    skladEnv: "PML_SKLAD_DACICE",
    city: "Dačice",
    address: "Palackého nám. 54",
    zip: "380 01 Dačice",
    hours: "Otevírací dobu brzy doplníme",
    status: "open",
    badge: null,
    photo: null,
    mapsLink:
      "https://maps.google.com/maps?q=Palackého+nám.+54,+380+01+Dačice",
  },
  {
    slug: "moravske-budejovice",
    skladEnv: "PML_SKLAD_MB",
    city: "Moravské Budějovice",
    address: "náměstí ČSA 37",
    zip: "676 02 Moravské Budějovice",
    hours: "Otevírací dobu brzy doplníme",
    status: "open",
    badge: null,
    photo: null,
    mapsLink:
      "https://maps.google.com/maps?q=náměstí+ČSA+37,+676+02+Moravské+Budějovice",
  },
  {
    slug: "havlickuv-brod",
    skladEnv: "PML_SKLAD_HB",
    city: "Havlíčkův Brod",
    address: "Nádražní 90",
    zip: "580 01 Havlíčkův Brod",
    hours: "Otevírací dobu brzy doplníme",
    status: "open",
    badge: null,
    photo: null,
    mapsLink:
      "https://maps.google.com/maps?q=Nádražní+90,+580+01+Havlíčkův+Brod",
  },
];

export function najdiPobocku(slug: string) {
  return branches.find((b) => b.slug === slug);
}

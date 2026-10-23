// Pobočky KraKrám — jediné místo s jejich údaji (úvodní stránka i sortiment).
// sklad = adresa veřejného skladu pobočky v PML (Admin → Web prodejny → Adresa
// pro web). Klíč v ní jen zpřístupňuje skladem ano/ne, které je na webu stejně
// vidět; po přegenerování v PML ho stačí přepsat tady nebo přebít proměnnou
// prostředí `skladEnv` ve Vercelu.

export type Pobocka = {
  slug: string;
  skladEnv: string;
  sklad: string;
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
    sklad: "https://pml-system.cz/verejne/v1/sklad/tgAZvKDAll3TMauAACwMzDxRAgKVSa59",
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
    sklad: "https://pml-system.cz/verejne/v1/sklad/jjgIrXwOVNI6lasB2aV8MPXpfDliaSNL",
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
    sklad: "https://pml-system.cz/verejne/v1/sklad/Z2mFKk8Caws0YN6lfcYpLttoefzb0-C0",
    skladEnv: "PML_SKLAD_DACICE",
    city: "Dačice",
    address: "Palackého nám. 54",
    zip: "380 01 Dačice",
    hours: "Po–Ne: 11:00–19:00",
    status: "open",
    badge: null,
    photo: null,
    mapsLink:
      "https://maps.google.com/maps?q=Palackého+nám.+54,+380+01+Dačice",
  },
  {
    slug: "moravske-budejovice",
    sklad: "https://pml-system.cz/verejne/v1/sklad/ZYg3xqdJIaInoqodDWAWY-9cN8IckuZT",
    skladEnv: "PML_SKLAD_MB",
    city: "Moravské Budějovice",
    address: "náměstí ČSA 37",
    zip: "676 02 Moravské Budějovice",
    hours: "Po–Ne: 11:00–19:00",
    status: "open",
    badge: null,
    photo: null,
    mapsLink:
      "https://maps.google.com/maps?q=náměstí+ČSA+37,+676+02+Moravské+Budějovice",
  },
  {
    slug: "havlickuv-brod",
    sklad: "https://pml-system.cz/verejne/v1/sklad/txlOntynmV0-AlF5u5aK8oYVeHWPQhq7",
    skladEnv: "PML_SKLAD_HB",
    city: "Havlíčkův Brod",
    address: "Nádražní 90",
    zip: "580 01 Havlíčkův Brod",
    hours: "Po–Ne: 11:00–19:00",
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

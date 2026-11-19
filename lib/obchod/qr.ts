// QR platba (formát SPAYD, který čtou všechny české bankovní aplikace)
// a vykreslení QR kódu do SVG.

import qrcode from "qrcode-generator";

// České číslo účtu „předčíslí-číslo/kód banky“ → IBAN.
export function naIban(ucet: string): string | null {
  const cisty = ucet.replace(/\s+/g, "").toUpperCase();
  if (/^CZ\d{22}$/.test(cisty)) return ibanPlatny(cisty) ? cisty : null;
  const m = cisty.match(/^(?:(\d{1,6})-)?(\d{2,10})\/(\d{4})$/);
  if (!m) return null;
  const bban = m[3] + (m[1] ?? "").padStart(6, "0") + m[2].padStart(10, "0");
  // „CZ00“ přepsané na čísla (C = 12, Z = 35) se přidá za BBAN.
  const kontrola = 98 - mod97(bban + "123500");
  return `CZ${String(kontrola).padStart(2, "0")}${bban}`;
}

// Zbytek po dělení 97 u čísla delšího, než kolik unese běžný number.
function mod97(cislice: string) {
  let zbytek = 0;
  for (const c of cislice) zbytek = (zbytek * 10 + Number(c)) % 97;
  return zbytek;
}

function ibanPlatny(iban: string) {
  const presun = iban.slice(4) + iban.slice(0, 4);
  const cisla = presun.replace(/[A-Z]/g, (z) => String(z.charCodeAt(0) - 55));
  return mod97(cisla) === 1;
}

// IBAN → číslo účtu, jak ho lidé znají z výpisu.
export function ucetCesky(iban: string) {
  const kod = iban.slice(4, 8);
  const predcisli = iban.slice(8, 14).replace(/^0+/, "");
  const cislo = iban.slice(14).replace(/^0+/, "");
  return `${predcisli ? `${predcisli}-` : ""}${cislo}/${kod}`;
}

export function spayd(p: {
  iban: string;
  castka: number;
  vs: string;
  zprava: string;
}) {
  // Hvězdička odděluje pole, ve zprávě být nesmí. Bez diakritiky a velkými
  // písmeny vyjde kód menší a čte se spolehlivěji.
  const zprava = p.zprava
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 .,:/-]/g, " ")
    .toUpperCase()
    .slice(0, 60);
  return [
    "SPD",
    "1.0",
    `ACC:${p.iban}`,
    `AM:${p.castka.toFixed(2)}`,
    "CC:CZK",
    `X-VS:${p.vs}`,
    `MSG:${zprava}`,
  ].join("*");
}

// Cesta SVG se čtverečky QR kódu a počet modulů na stranu.
export function qrCesta(text: string) {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    }
  }
  return { d, n };
}

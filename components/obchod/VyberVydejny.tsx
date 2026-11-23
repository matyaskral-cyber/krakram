"use client";

import Navrh from "./Navrh";

// Výběr výdejního místa. V návrhu se místo jen napíše; s účtem u Zásilkovny
// sem přijde jejich mapa (widget), která vrátí přesné místo i jeho kód.
export default function VyberVydejny({
  misto,
  zmen,
  trida,
}: {
  misto: string;
  zmen: (misto: string) => void;
  trida: string;
}) {
  return (
    <div className="mt-3">
      <input
        className={trida}
        placeholder="Výdejní místo: město a ulice"
        value={misto}
        onChange={(e) => zmen(e.target.value)}
        maxLength={120}
        required
      />
      <Navrh className="mt-2">
        v ostrém provozu se tu vybírá na mapě Zásilkovny.
      </Navrh>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

// Dokud převod nedorazí, stránka se každých 40 s zeptá serveru.
// Jakmile platba přijde, sama se obnoví a ukáže „zaplaceno“.
export default function CekaNaPrevod({ cislo }: { cislo: string }) {
  const [hlida, setHlida] = useState(false);
  useEffect(() => {
    let zije = true;
    const zeptej = async () => {
      try {
        const d = await (await fetch(`/api/obchod/platba/prevod?c=${cislo}`)).json();
        if (!zije) return;
        if (d.zaplaceno) window.location.reload();
        setHlida(Boolean(d.hlida));
      } catch {}
    };
    zeptej();
    const t = window.setInterval(zeptej, 40_000);
    return () => {
      zije = false;
      window.clearInterval(t);
    };
  }, [cislo]);
  if (!hlida) return null;
  return (
    <p className="mt-3 flex items-center gap-2 !text-sm font-bold text-forest-dark">
      <span className="h-2 w-2 animate-pulse rounded-full bg-forest" />
      Hlídáme účet. Až platba dorazí, stránka se sama přepne.
    </p>
  );
}

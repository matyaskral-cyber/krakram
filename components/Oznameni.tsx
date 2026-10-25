"use client";

import { useEffect, useState } from "react";

// Dočasné upozornění u pobočky. Stránka může být vygenerovaná dopředu, proto
// se platnost hlídá i v prohlížeči: po konci dne `platiDo` (český čas) zmizí.
function platne(platiDo: string) {
  const dnes = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Prague" }).format(new Date());
  return dnes <= platiDo;
}

export default function Oznameni({ text, platiDo, className = "" }: { text: string; platiDo: string; className?: string }) {
  const [vidim, setVidim] = useState(() => platne(platiDo));
  useEffect(() => setVidim(platne(platiDo)), [platiDo]);
  if (!vidim) return null;
  return (
    <div role="status" className={`flex items-start gap-2 rounded-xl border border-amber-400/60 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 ${className}`}>
      <span aria-hidden="true">⚠</span>
      <span>{text}</span>
    </div>
  );
}

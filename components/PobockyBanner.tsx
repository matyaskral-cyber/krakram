"use client";

import { usePathname } from "next/navigation";

// Pruh s novinkou o pobočkách — v e-shopu (/obchod) se neukazuje.
export default function PobockyBanner() {
  const cesta = usePathname();
  if (cesta?.startsWith("/obchod")) return null;
  return (
    <div className="bg-forest text-cream text-center text-sm font-semibold py-2.5 px-4">
      🎉 Nově otevřeno v Dačicích, Moravských Budějovicích a Havlíčkově Brodě!&nbsp;
      <a href="#pobocky" className="underline underline-offset-2 opacity-80 hover:opacity-100">
        Najít pobočku
      </a>
    </div>
  );
}

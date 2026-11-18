import type { Metadata } from "next";
import AgeGate from "@/components/AgeGate";
import Hlavicka from "@/components/obchod/Hlavicka";
import { KosikProvider } from "@/components/obchod/Kosik";
import Paticka from "@/components/obchod/Paticka";
import PruhNavrhu from "@/components/obchod/PruhNavrhu";

export const metadata: Metadata = {
  title: { default: "KraKrám e-shop", template: "%s — KraKrám e-shop" },
  description:
    "E-shop prodejen KraKrám: CBD květy, Canapuff a sběratelské rostliny. Prodej pouze osobám starším 18 let.",
  // Nástřel — dokud není schválený, ať ho vyhledávače neindexují.
  robots: { index: false, follow: false },
};

export default function ObchodLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="obchod font-sans">
      <KosikProvider>
        <AgeGate />
        <PruhNavrhu />
        <Hlavicka />
        <main>{children}</main>
        <Paticka />
      </KosikProvider>
    </div>
  );
}

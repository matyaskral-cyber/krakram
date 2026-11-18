import type { Metadata } from "next";
import Domov from "@/components/obchod/Domov";

export const metadata: Metadata = { title: "Verze B" };

// Verze B: úvod s jednou velkou fotkou.
export default function ObchodUvodB() {
  return <Domov foto />;
}

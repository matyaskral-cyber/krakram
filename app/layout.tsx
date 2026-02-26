import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "KraKrám — Kvalitní kratom",
  description:
    "KraKrám nabízí prémiový kratom v prášku. Přírodní botanická látka s důrazem na čistotu a transparentnost původu.",
  keywords: ["kratom", "kratom prášek", "botanické látky", "přírodní produkty"],
  openGraph: {
    title: "KraKrám — Kvalitní kratom",
    description: "Prémiový kratom s důrazem na kvalitu a transparentnost.",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="scroll-smooth">
      <body className={`${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "KraKrám — Psychomodulační látky",
  description:
    "KraKrám je specializovaná prodejna psychomodulačních látek dle vyhl. č. 448/2025 Sb. Prodej výhradně osobám starším 18 let na kamenných pobočkách.",
  keywords: ["kratom", "psychomodulační látky", "krakram", "kratom pobočky"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "KraKrám — Psychomodulační látky",
    description: "Specializovaná prodejna psychomodulačních látek. Prodej výhradně osobám starším 18 let.",
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
        <CookieConsent />
      </body>
    </html>
  );
}

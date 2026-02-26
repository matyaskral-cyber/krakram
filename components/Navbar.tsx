"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const links = [
  { label: "O nás", href: "/#o-nas" },
  { label: "Co je kratom?", href: "/#co-je-kratom" },
  { label: "Pobočky", href: "/#pobocky" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/#faq" },
  { label: "Kontakt", href: "/#kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur-sm border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-12 h-28 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="KraKrám"
            width={200}
            height={200}
            className="h-20 w-auto object-contain"
            priority
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-base font-semibold text-ink-soft hover:text-forest transition-colors whitespace-nowrap"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <a
          href="#kontakt"
          className="hidden md:inline-flex items-center gap-2 bg-forest text-cream text-base font-semibold px-6 py-3 rounded-full hover:bg-forest-light transition-colors whitespace-nowrap shrink-0"
        >
          Kontaktujte nás
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`w-6 h-px bg-ink transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-px bg-ink transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-px bg-ink transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-border px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-ink-soft hover:text-forest transition-colors text-lg"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center bg-forest text-cream text-sm px-5 py-3 rounded-full hover:bg-forest-light transition-colors"
          >
            Kontaktujte nás
          </a>
        </div>
      )}
    </header>
  );
}

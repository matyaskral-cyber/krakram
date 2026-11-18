"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cenaOd, kc, najdiProdukt, type Produkt } from "@/lib/obchod/produkty";
import { useKosik } from "./Kosik";

// Co se střídá na podstavci. `vyska` = jak vysoký je produkt vůči scéně.
const VYSTAVA: { slug: string; stitek: string; vyska: number }[] = [
  { slug: "cbd-kvet", stitek: "CBD květ", vyska: 1 },
  { slug: "t9hc-kvet-balanced", stitek: "Květy", vyska: 1 },
  { slug: "9h-hhcp-joint-laughing-buddha", stitek: "Jointy", vyska: 1.08 },
  { slug: "vape-gorilla-kush", stitek: "Vapy", vyska: 1.08 },
  { slug: "kava-kava-borongoru", stitek: "Kava kava", vyska: 1 },
];
const POLOZKY = VYSTAVA.map((v) => ({ ...v, produkt: najdiProdukt(v.slug) as Produkt }));
const INTERVAL = 5200;

function useVystava() {
  const [i, setI] = useState(0);
  const [bezi, setBezi] = useState(true);
  const n = POLOZKY.length;

  useEffect(() => {
    if (!bezi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), INTERVAL);
    return () => clearTimeout(t);
  }, [i, bezi, n]);

  const vyber = useCallback(
    (x: number) => {
      setI(((x % n) + n) % n);
      setBezi(false);
    },
    [n],
  );
  return { i, vyber, bezi, setBezi };
}

// Produkt vznášející se nad podstavcem. Při změně se starý vytratí nahoru
// a nový dosedne zespodu.
function Produkty({ i, velikost }: { i: number; velikost: string }) {
  return (
    <>
      {POLOZKY.map((p, x) => (
        <div
          key={p.slug}
          aria-hidden={x !== i}
          className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
            x === i
              ? "translate-y-0 rotate-0 scale-100 opacity-100"
              : x < i
                ? "pointer-events-none -translate-y-16 -rotate-6 scale-90 opacity-0"
                : "pointer-events-none translate-y-10 rotate-6 scale-90 opacity-0"
          }`}
        >
          <div className="absolute inset-0 animate-vznaset motion-reduce:animate-none">
            <Image
              src={p.produkt.foto!}
              alt={x === i ? `${p.produkt.nazev} – ${p.produkt.znacka}` : ""}
              fill
              priority={x === 0}
              sizes={velikost}
              className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.45)]"
              style={{ transform: `scale(${p.vyska})` }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

function Titulek({ className }: { className: string }) {
  return (
    <h1 className={`font-extrabold uppercase tracking-tight text-cream ${className}`}>
      {["Z\u00a0pultu", "rovnou", "k\u00a0vám."].map((radek, x) => (
        // Maska pro vyjetí řádku; nahoře rezerva, aby se neuřízly háčky a čárky.
        <span key={radek} className="-mt-[0.18em] block overflow-hidden pb-[0.06em] pt-[0.3em]">
          <span
            className="block animate-vyjed motion-reduce:animate-none"
            style={{ animationDelay: `${150 + x * 120}ms` }}
          >
            {radek}
          </span>
        </span>
      ))}
    </h1>
  );
}

// Jméno, cena a tlačítko právě vystaveného produktu.
function Nabidka({ p, kompaktni }: { p: Produkt; kompaktni?: boolean }) {
  const { pridej } = useKosik();
  const vice = p.varianty.length > 1;
  return (
    <div
      key={p.slug}
      className={`flex animate-zjev items-center gap-3 rounded-[1.75rem] bg-cream/[0.08] ring-1 ring-cream/15 backdrop-blur-md motion-reduce:animate-none ${
        kompaktni ? "p-2.5 pl-4" : "p-3 pl-6"
      }`}
    >
      <Link href={`/obchod/produkt/${p.slug}`} className="min-w-0 flex-1">
        <span className="block truncate text-xs font-bold uppercase tracking-widest text-lime">
          {p.znacka}
          {!kompaktni && ` · ${p.varianty.map((v) => v.nazev).join(" / ")}`}
        </span>
        <span
          className={`block truncate font-bold text-cream ${kompaktni ? "text-base" : "text-xl"}`}
        >
          {p.nazev}
        </span>
      </Link>
      <span
        className={`shrink-0 font-extrabold tabular-nums text-cream ${kompaktni ? "text-base" : "text-xl"}`}
      >
        {vice && <span className="text-sm font-medium text-cream/60">od </span>}
        {kc(cenaOd(p))}
      </span>
      <button
        type="button"
        onClick={() => pridej(p.slug, p.varianty[0].id)}
        className={`shrink-0 rounded-full bg-lime font-bold text-pine transition-transform hover:scale-105 active:scale-95 ${
          kompaktni ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-base"
        }`}
      >
        Do košíku
      </button>
    </div>
  );
}

function Prepinac({
  i,
  vyber,
  bezi,
  maly,
}: {
  i: number;
  vyber: (x: number) => void;
  bezi: boolean;
  maly?: boolean;
}) {
  return (
    <div role="tablist" aria-label="Vystavený produkt" className="flex gap-2">
      {POLOZKY.map((p, x) => {
        const aktivni = x === i;
        return (
          <button
            key={p.slug}
            type="button"
            role="tab"
            aria-selected={aktivni}
            aria-label={p.stitek}
            title={p.stitek}
            onClick={() => vyber(x)}
            className={`group relative shrink-0 overflow-hidden rounded-2xl transition-all duration-300 ${
              maly ? "h-12 w-12" : "h-16 w-16"
            } ${aktivni ? "scale-100 ring-2 ring-lime" : "scale-90 opacity-70 hover:scale-100 hover:opacity-100"}`}
            style={{ background: `color-mix(in srgb, ${p.produkt.barva} 70%, #F7F4EF)` }}
          >
            <Image
              src={p.produkt.foto!}
              alt=""
              fill
              sizes="64px"
              className="object-contain p-1 transition-transform duration-300 group-hover:scale-110"
            />
            {aktivni && bezi && (
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left animate-plneni bg-pine/70 motion-reduce:hidden" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Počítač ───────────────────────── */

function UvodPocitac({ v }: { v: ReturnType<typeof useVystava> }) {
  const panel = useRef<HTMLDivElement>(null);
  const p = POLOZKY[v.i].produkt;
  const { i, vyber, setBezi } = v;

  // Pozice myši → proměnné: pozadí uhýbá málo, produkt víc a naklání se,
  // světlo jde za kurzorem.
  const pohyb = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !panel.current) return;
    const r = panel.current.getBoundingClientRect();
    const s = panel.current.style;
    s.setProperty("--mx", String((e.clientX - r.left) / r.width - 0.5));
    s.setProperty("--my", String((e.clientY - r.top) / r.height - 0.5));
    s.setProperty("--sx", `${e.clientX - r.left}px`);
    s.setProperty("--sy", `${e.clientY - r.top}px`);
    s.setProperty("--svetlo", "1");
  };
  const klid = () => {
    const s = panel.current?.style;
    s?.setProperty("--mx", "0");
    s?.setProperty("--my", "0");
    s?.setProperty("--svetlo", "0");
    setBezi(true);
  };

  useEffect(() => {
    const klavesa = (e: KeyboardEvent) => {
      if (!panel.current?.matches(":hover")) return;
      if (e.key === "ArrowRight") vyber(i + 1);
      if (e.key === "ArrowLeft") vyber(i - 1);
    };
    window.addEventListener("keydown", klavesa);
    return () => window.removeEventListener("keydown", klavesa);
  }, [i, vyber]);

  return (
    <div
      ref={panel}
      onPointerMove={pohyb}
      onPointerEnter={() => setBezi(false)}
      onPointerLeave={klid}
      className="relative hidden overflow-hidden rounded-[2.75rem] bg-[#185854] lg:block"
      style={{ "--mx": 0, "--my": 0, "--svetlo": 0 } as React.CSSProperties}
    >
      {/* scéna */}
      <div className="absolute inset-0 animate-priblizit motion-reduce:animate-none">
        <div className="absolute -inset-8 transition-transform duration-700 ease-out [transform:translate3d(calc(var(--mx)*-24px),calc(var(--my)*-16px),0)] motion-reduce:transform-none">
          <Image
            src="/obchod/scena.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1376px) 1400px, 105vw"
            className="object-cover object-[80%_center]"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#185854]/80 via-transparent to-transparent" />

      {/* světlo za kurzorem */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[var(--svetlo)] transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(26rem circle at var(--sx) var(--sy), rgba(180,215,119,0.16), transparent 70%)",
        }}
      />

      {/* záře v barvě produktu + produkt nad podstavcem */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: "var(--pl)",
          top: "var(--pt)",
          width: "var(--pw)",
          height: "var(--ph)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-[4%] rounded-full opacity-35 blur-3xl transition-colors duration-700"
          style={{ background: p.barva }}
        />
        <div className="absolute inset-0 transition-transform duration-500 ease-out [transform:perspective(900px)_translate3d(calc(var(--mx)*46px),calc(var(--my)*30px),0)_rotateY(calc(var(--mx)*16deg))_rotateX(calc(var(--my)*-12deg))] motion-reduce:transform-none">
          <Produkty i={i} velikost="(min-width: 1280px) 420px, 34vw" />
        </div>
        <Link
          href={`/obchod/produkt/${p.slug}`}
          aria-label={`Detail: ${p.nazev}`}
          className="pointer-events-auto absolute inset-[12%] rounded-full"
        />
      </div>

      <Link
        href="/obchod/sortiment"
        className="group absolute right-8 top-8 z-10 animate-zjev rounded-full bg-cream/10 px-5 py-2.5 text-base font-bold text-cream ring-1 ring-cream/25 backdrop-blur-md transition-colors [animation-delay:900ms] hover:bg-cream hover:text-pine motion-reduce:animate-none"
      >
        Celý sortiment{" "}
        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>

      {/* text */}
      <div className="relative flex min-h-[43rem] max-w-[60%] flex-col justify-end p-12 xl:p-14">
        <p className="animate-zjev text-sm font-bold uppercase tracking-[0.25em] text-lime motion-reduce:animate-none">
          E-shop KraKrám
        </p>
        <Titulek className="mt-2 text-7xl leading-[1.04] xl:text-[5.4rem]" />
        <p className="vyrovnat mt-5 max-w-[27rem] animate-zjev text-lg leading-relaxed text-cream/80 [animation-delay:600ms] motion-reduce:animate-none">
          Co máme na pultu, pošleme i&nbsp;poštou. Vyberte si, co chcete vidět zblízka.
        </p>

        <div className="mt-8 max-w-[29rem] animate-zjev space-y-4 xl:max-w-[33rem] [animation-delay:780ms] motion-reduce:animate-none">
          <Nabidka p={p} />
          <Prepinac i={i} vyber={vyber} bezi={v.bezi} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Telefon ───────────────────────── */

function UvodTelefon({ v }: { v: ReturnType<typeof useVystava> }) {
  const p = POLOZKY[v.i].produkt;
  const start = useRef<{ x: number; y: number } | null>(null);
  const [tah, setTah] = useState(0);

  // Přejetí prstem do stran mění produkt; svislý pohyb nechává stránku rolovat.
  const dotyk = (e: React.TouchEvent) => {
    start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const posun = (e: React.TouchEvent) => {
    if (!start.current) return;
    const dx = e.touches[0].clientX - start.current.x;
    const dy = e.touches[0].clientY - start.current.y;
    if (Math.abs(dx) > Math.abs(dy)) setTah(dx);
  };
  const pust = () => {
    if (Math.abs(tah) > 45) v.vyber(v.i + (tah < 0 ? 1 : -1));
    setTah(0);
    start.current = null;
  };

  return (
    <div className="relative mx-auto max-w-xl overflow-hidden rounded-[2rem] bg-[#17534c] lg:hidden">
      <div className="relative z-10 px-5 pt-7">
        <p className="animate-zjev !text-xs font-bold uppercase tracking-[0.25em] text-lime motion-reduce:animate-none">
          E-shop KraKrám
        </p>
        <Titulek className="mt-1 text-[2.55rem] leading-[1.06]" />
        <p className="mt-3 animate-zjev !text-base !leading-relaxed text-cream/80 [animation-delay:600ms] motion-reduce:animate-none">
          Co máme na pultu, pošleme i&nbsp;poštou.
        </p>
      </div>

      {/* jeviště s podstavcem – táhnout do stran */}
      <div
        onTouchStart={dotyk}
        onTouchMove={posun}
        onTouchEnd={pust}
        className="relative -mt-6 aspect-[358/400] touch-pan-y"
      >
        <Image
          src="/obchod/scena-mobil.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#17534c] to-transparent" />
        <div
          aria-hidden
          className="absolute left-1/2 top-[10%] h-[50%] w-[62%] -translate-x-1/2 rounded-full opacity-35 blur-3xl transition-colors duration-700"
          style={{ background: p.barva }}
        />
        <div
          className="absolute left-1/2 aspect-square"
          style={{
            top: "var(--mt)",
            height: "var(--mp)",
            transform: `translateX(calc(-50% + ${tah * 0.6}px)) rotate(${tah * 0.04}deg)`,
            transition: tah ? "none" : "transform 0.4s ease-out",
          }}
        >
          <Produkty i={v.i} velikost="70vw" />
        </div>
        <button
          type="button"
          aria-label="Předchozí produkt"
          onClick={() => v.vyber(v.i - 1)}
          className="absolute left-3 top-[32%] grid h-10 w-10 place-items-center rounded-full bg-cream/10 text-xl text-cream ring-1 ring-cream/20 backdrop-blur"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Další produkt"
          onClick={() => v.vyber(v.i + 1)}
          className="absolute right-3 top-[32%] grid h-10 w-10 place-items-center rounded-full bg-cream/10 text-xl text-cream ring-1 ring-cream/20 backdrop-blur"
        >
          →
        </button>
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          <Prepinac i={v.i} vyber={v.vyber} bezi={v.bezi} maly />
        </div>
      </div>

      <div className="relative bg-[#1d625b] px-4 pb-4 pt-1">
        <Nabidka p={p} kompaktni />
        <Link
          href="/obchod/sortiment"
          className="mt-3 block rounded-full border border-cream/40 py-3.5 text-center text-base font-bold text-cream"
        >
          Celý sortiment
        </Link>
      </div>
    </div>
  );
}

export default function Uvod() {
  const v = useVystava();
  return (
    <section
      className="mx-auto max-w-[86rem] px-4 pt-4 md:px-8 md:pt-6"
      // Umístění produktu nad podstavcem (podle fotky scény).
      style={
        {
          "--pl": "59%",
          "--pt": "12%",
          "--pw": "32%",
          "--ph": "60%",
          "--mt": "7%",
          "--mp": "50%",
        } as React.CSSProperties
      }
    >
      <UvodPocitac v={v} />
      <UvodTelefon v={v} />
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

// Verze B úvodu: jedna velká fotka, titulek vyjíždějící po řádcích.
// Počítač a telefon mají vlastní rozložení i vlastní fotku.

function Titulek({ className }: { className: string }) {
  return (
    <h1 className={`font-extrabold uppercase tracking-tight text-cream ${className}`}>
      {["Krám až", "ke dveřím."].map((radek, x) => (
        // Maska pro vyjetí řádku; nahoře rezerva, aby se neuřízly háčky a čárky.
        <span key={radek} className="-mt-[0.18em] block overflow-hidden pb-[0.06em] pt-[0.3em]">
          <span
            className="block animate-vyjed motion-reduce:animate-none"
            style={{ animationDelay: `${150 + x * 130}ms` }}
          >
            {radek}
          </span>
        </span>
      ))}
    </h1>
  );
}

// Otáčející se kulatá pečeť s textem po obvodu.
function Pecet({ className }: { className: string }) {
  return (
    <div
      className={`absolute animate-zjev [animation-delay:1100ms] motion-reduce:animate-none ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full animate-kruh motion-reduce:animate-none"
        aria-hidden
      >
        <defs>
          <path id="pecet-kruh" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="99" fill="#B4D777" />
        <text
          fill="#1F4A46"
          fontSize="17.5"
          fontWeight="800"
          letterSpacing="3.6"
          style={{ textTransform: "uppercase" }}
        >
          <textPath href="#pecet-kruh">Jen pro dospělé ✦ Diskrétní balení ✦ Skladem ✦</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center text-2xl font-extrabold text-pine">
        18+
      </span>
    </div>
  );
}

function Tlacitka({ naVysku }: { naVysku?: boolean }) {
  return (
    <div
      className={`flex animate-zjev gap-3 [animation-delay:800ms] motion-reduce:animate-none ${
        naVysku ? "[&>a]:flex-1 [&>a]:px-3 [&>a]:py-3.5 [&>a]:text-base" : "flex-wrap"
      }`}
    >
      <Link
        href="/obchod/sortiment"
        className="rounded-full bg-lime px-8 py-4 text-center text-lg font-bold text-pine transition-transform hover:scale-[1.03]"
      >
        {naVysku ? "Sortiment" : "Prohlédnout sortiment"}
      </Link>
      <Link
        href="/obchod/sortiment?k=cbd"
        className={`rounded-full border border-cream/40 px-8 py-4 text-center text-lg font-bold text-cream transition-colors hover:bg-cream hover:text-pine ${
          naVysku ? "bg-pine/40 backdrop-blur-sm" : ""
        }`}
      >
        CBD květy
      </Link>
    </div>
  );
}

function Pocitac() {
  const panel = useRef<HTMLDivElement>(null);

  // Fotka se lehce posouvá proti pohybu myši.
  const pohyb = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !panel.current) return;
    const r = panel.current.getBoundingClientRect();
    panel.current.style.setProperty("--mx", String((e.clientX - r.left) / r.width - 0.5));
    panel.current.style.setProperty("--my", String((e.clientY - r.top) / r.height - 0.5));
  };
  const klid = () => {
    panel.current?.style.setProperty("--mx", "0");
    panel.current?.style.setProperty("--my", "0");
  };

  return (
    <div
      ref={panel}
      onPointerMove={pohyb}
      onPointerLeave={klid}
      className="relative hidden overflow-hidden rounded-[2.75rem] bg-[var(--pozadi)] lg:block"
      style={{ "--mx": 0, "--my": 0 } as React.CSSProperties}
    >
      <div className="absolute inset-0 animate-priblizit motion-reduce:animate-none">
        <div className="absolute -inset-6 transition-transform duration-700 ease-out [transform:translate3d(calc(var(--mx)*-28px),calc(var(--my)*-20px),0)] motion-reduce:transform-none">
          <Image
            src="/obchod/hero.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1376px) 1360px, 105vw"
            className="object-cover object-right"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--pozadi)] via-[var(--pozadi)]/40 to-transparent" />

      <Pecet className="right-6 top-6 h-24 w-24" />

      <div className="relative flex min-h-[40rem] max-w-[58%] flex-col justify-end p-12 xl:p-14">
        <p className="animate-zjev text-sm font-bold uppercase tracking-[0.25em] text-lime motion-reduce:animate-none">
          E-shop KraKrám
        </p>
        <Titulek className="mt-2 text-7xl leading-[1.04] xl:text-[6.2rem]" />
        <p className="vyrovnat mt-5 max-w-[26rem] animate-zjev text-lg leading-relaxed text-cream/80 [animation-delay:650ms] motion-reduce:animate-none">
          Co máme na pultu, pošleme i&nbsp;poštou. CBD květy, Canapuff, kava a&nbsp;kanna.
        </p>
        <div className="mt-8">
          <Tlacitka />
        </div>
      </div>
    </div>
  );
}

function Telefon() {
  return (
    <div className="relative mx-auto aspect-[358/700] max-w-xl sm:aspect-[4/5] overflow-hidden rounded-[2rem] bg-[var(--pozadi-mobil)] lg:hidden">
      <Image
        src="/obchod/hero-mobil.webp"
        alt=""
        fill
        priority
        sizes="(min-width: 576px) 576px, 100vw"
        className="animate-priblizit object-cover object-bottom motion-reduce:animate-none"
      />
      <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-[var(--pozadi-mobil)] to-transparent" />

      <Pecet className="right-4 top-[34%] h-20 w-20 sm:h-24 sm:w-24" />

      <div className="absolute inset-0 flex flex-col justify-between p-5 pt-7 sm:p-8">
        <div>
          <p className="animate-zjev !text-xs font-bold uppercase tracking-[0.25em] text-lime motion-reduce:animate-none">
            E-shop KraKrám
          </p>
          <Titulek className="mt-1 text-[2.7rem] leading-[1.06] sm:text-6xl" />
          <p className="vyrovnat mt-3 max-w-[18rem] animate-zjev !text-base !leading-relaxed text-cream/80 [animation-delay:650ms] motion-reduce:animate-none">
            Co máme na pultu, pošleme i&nbsp;poštou.
          </p>
        </div>
        <Tlacitka naVysku />
      </div>
    </div>
  );
}

export default function UvodFoto() {
  return (
    <section
      className="mx-auto max-w-[86rem] px-4 pt-4 md:px-8 md:pt-6"
      // Barva pozadí fotek, aby okraje panelu splynuly.
      style={{ "--pozadi": "#11514e", "--pozadi-mobil": "#0a4948" } as React.CSSProperties}
    >
      <Pocitac />
      <Telefon />
    </section>
  );
}

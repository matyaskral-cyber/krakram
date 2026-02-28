"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Je kratom v ČR legální?",
    a: "Ano. Kratom není v České republice zařazen mezi omamné ani psychotropní látky. Jeho prodej a osobní držení jsou zcela legální. Není však registrován jako léčivo a nesmí být propagován jako takový.",
  },
  {
    q: "Kde vás najdu?",
    a: "Prodáváme výhradně osobně na našich kamenných pobočkách. Přesné adresy a otevírací dobu zjistíte na vyžádání — stačí zavolat nebo napsat e-mail.",
  },
  {
    q: "Jak jsou produkty testovány?",
    a: "Každá šarže prochází nezávislým laboratorním testováním zaměřeným na obsah alkaloidů, těžké kovy, pesticidy a mikrobiologickou čistotu. Na vyžádání poskytneme certifikáty.",
  },
  {
    q: "Jaké množství je vhodné pro začátečníky?",
    a: "Doporučujeme začít s 1–2 gramy. Účinky se mohou projevit do 30 minut. Před dalším užitím vyčkejte minimálně 4–6 hodin. Nepřekračujte 5 gramů v rámci jednoho dne.",
  },
  {
    q: "Jaké jsou platební možnosti?",
    a: "Na pobočkách přijímáme hotovost i platební karty. Jiný způsob platby nenabízíme — prodáváme výhradně osobně.",
  },
  {
    q: "Lze kratom kombinovat s léky?",
    a: "Kratom může interagovat s různými léčivy, zejména s opioidními analgetiky, antidepresivy a sedativy. Pokud užíváte jakékoliv léky, konzultujte kombinaci s lékařem.",
  },
  {
    q: "Jaký je rozdíl mezi odrůdami?",
    a: "Odrůdy se tradičně liší barvou žilnatiny listu v době sklizně — bílá, zelená a červená. Každá má jiný alkaloidový profil. Podrobnější informace najdete v sekci blogu nebo se zeptejte přímo na pobočce.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding bg-cream-dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-subtitle mb-4">Časté dotazy</p>
          <div className="divider mb-8 mx-auto" />
          <h2 className="section-title">Máte otázky?</h2>
        </div>

        <div className="max-w-3xl divide-y divide-border">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-6 py-7 text-left group"
              >
                <span className="font-bold text-base md:text-xl text-ink group-hover:text-forest transition-colors">
                  {faq.q}
                </span>
                <span className="text-ink-muted shrink-0 mt-0.5 text-2xl leading-none transition-transform duration-200"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="pb-7 text-ink-soft leading-relaxed text-base md:text-xl">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

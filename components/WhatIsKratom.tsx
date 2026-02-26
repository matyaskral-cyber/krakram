const facts = [
  {
    num: "01",
    title: "Původ a botanika",
    text: "Kratom (Mitragyna speciosa) je strom z čeledi mořenovitých (Rubiaceae), příbuzný kávovníku. Roste přirozeně v tropických deštných lesích Indonésie, Malajsie, Thajska a Myanmaru, kde dosahuje výšky až 25 metrů.",
  },
  {
    num: "02",
    title: "Tradiční využití",
    text: "V jihovýchodní Asii je kratom znám po tisíce let. Místní obyvatelé žvýkali čerstvé listy nebo je vařili do čaje jako součást každodenního života — ke zvýšení energie při fyzické práci i k uklidnění po náročném dni.",
  },
  {
    num: "03",
    title: "Aktivní látky",
    text: "Hlavními alkaloidy jsou mitragynin a 7-hydroxymitragynin. Tyto látky interagují s různými receptory v těle a mohou v závislosti na množství projevovat stimulační nebo uklidňující účinky. Přesný mechanismus je předmětem vědeckého výzkumu.",
  },
  {
    num: "04",
    title: "Formy a odrůdy",
    text: "Kratom se nejčastěji prodává jako jemný prášek sušených a mletých listů. Odrůdy se tradičně označují barvou žilnatiny listu (bílá, zelená, červená), přičemž každá má jiný alkaloidový profil a charakter účinků.",
  },
  {
    num: "05",
    title: "Právní status v ČR",
    text: "Od 12. 11. 2025 je kratom v České republice regulován jako psychomodulační látka (PML) dle nařízení vlády č. 456/2025 Sb. Prodej je povolen pouze dospělým osobám starším 18 let v souladu se zákonem č. 167/1998 Sb. a vyhláškou č. 448/2025 Sb. Kratom není registrován jako léčivý přípravek.",
  },
  {
    num: "06",
    title: "Zodpovědné užívání",
    text: "Při doporučeném dávkování má výrobek povzbuzující účinky, při překročení tlumivé účinky. Tento výrobek by se neměl užívat každý den — mezi jednotlivými užitími by měla být přestávka 3 dny. Neužívejte výrobek při, bezprostředně před a v době kratší než 8 hodin před řízením motorového vozidla. Nevhodné pro osoby mladší 18 let, těhotné a kojící ženy.",
  },
];

export default function WhatIsKratom() {
  return (
    <section id="co-je-kratom" className="section-padding bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-subtitle mb-4">Vzdělání</p>
          <div className="divider mb-8 mx-auto" />
          <h2 className="section-title mb-4">Co je kratom?</h2>
          <p className="text-ink-soft text-xl leading-relaxed max-w-2xl mx-auto">
            Věříme, že informovaný zákazník je spokojeným zákazníkem. Zde najdete
            vše podstatné, co byste o kratom u měli vědět.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facts.map((f) => (
            <div key={f.num} className="bg-white border border-border-green rounded-2xl p-8 hover:border-forest/50 transition-colors">
              <p className="text-sm font-bold text-forest mb-4">{f.num}</p>
              <h3 className="font-bold text-ink text-xl mb-3">{f.title}</h3>
              <p className="text-ink-soft text-lg leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

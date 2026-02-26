export default function About() {
  const values = [
    {
      icon: "◈",
      title: "Čistota na prvním místě",
      desc: "Každá šarže prochází testováním na těžké kovy, pesticidy a mikrobiální kontaminaci. Žádné příměsi, žádné kompromisy.",
    },
    {
      icon: "◉",
      title: "Transparentní původ",
      desc: "Spolupracujeme výhradně s ověřenými farmáři v Indonésii a Thajsku. Víme přesně, odkud každý produkt pochází.",
    },
    {
      icon: "◎",
      title: "Odpovědný přístup",
      desc: "Kratom bereme vážně. Poskytujeme pravdivé informace, podporujeme zodpovědné užívání a ctíme soukromí zákazníků.",
    },
  ];

  return (
    <section id="o-nas" className="section-padding bg-forest text-cream">
      <div className="max-w-6xl mx-auto text-center">
        <p className="section-subtitle mb-4 text-forest-muted">O nás</p>
        <div className="w-16 h-1 bg-cream/50 rounded-full mb-8 mx-auto" />
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-cream mb-6">
          Obchod postavený na kvalitě, ne kompromisech
        </h2>
        <p className="text-cream/80 text-xl leading-relaxed mb-5 max-w-3xl mx-auto">
          KraKrám se specializuje výhradně na kratom — psychomodulační látku s tisíciletou
          historií v jihovýchodní Asii. Prodáváme osobně na kamenných pobočkách,
          kde si zákazník může vše v klidu prohlédnout a zeptat se.
        </p>
        <p className="text-cream/80 text-xl leading-relaxed mb-16 max-w-3xl mx-auto">
          Nejsme velkosklad, který prodává cokoliv. Jsme malý, specializovaný obchod,
          kde každý produkt osobně prověřujeme. Zajímá nás původ, zpracování a výsledná
          kvalita — proto nabízíme jen to, za co ručíme.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-white/10 rounded-2xl p-8">
              <span className="text-cream text-4xl block mb-4">{v.icon}</span>
              <h3 className="font-bold text-cream text-xl mb-3">{v.title}</h3>
              <p className="text-cream/75 text-lg leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

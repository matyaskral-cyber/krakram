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
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-cream mb-6">
          O nás
        </h2>
        <p className="text-cream/80 text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
          KraKrám je specializovaná prodejna psychomodulačních látek s povolením
          Ministerstva zdravotnictví ČR. Prodej probíhá výhradně osobně na kamenných
          pobočkách osobám starším 18 let.
        </p>
      </div>
    </section>
  );
}

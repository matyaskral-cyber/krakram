import Image from "next/image";

const branches = [
  {
    city: "Tábor",
    address: "nám. F. Křižíka 496/10",
    zip: "390 01 Tábor",
    hours: "Po–Ne: 10:00–20:00",
    status: "open",
    badge: null,
    mapSrc:
      "https://maps.google.com/maps?q=nám.+F.+Křižíka+496%2F10,+Tábor&output=embed&hl=cs&z=16",
    mapsLink:
      "https://maps.google.com/maps?q=nám.+F.+Křižíka+496%2F10,+Tábor",
  },
  {
    city: "Jindřichův Hradec",
    address: "Klášterská 79/II",
    zip: "377 01 Jindřichův Hradec",
    hours: "Po–Ne: 10:00–20:00",
    status: "soon",
    badge: "Otevíráme 10. 3.",
    mapSrc:
      "https://maps.google.com/maps?q=Klášterská+79,+377+01+Jindřichův+Hradec&output=embed&hl=cs&z=16",
    mapsLink:
      "https://maps.google.com/maps?q=Klášterská+79,+377+01+Jindřichův+Hradec",
  },
];

export default function Branches() {
  return (
    <section id="pobocky" className="section-padding bg-green-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Image
            src="/logo.png"
            alt="KraKrám"
            width={220}
            height={220}
            className="h-24 md:h-36 w-auto object-contain mb-6 md:mb-8 mx-auto"
          />
          <p className="section-subtitle mb-4">Kde nás najdete</p>
          <div className="divider mb-8 mx-auto" />
          <h2 className="section-title mb-4">Naše pobočky</h2>
          <p className="text-ink-soft text-xl leading-relaxed max-w-xl mx-auto">
            Prodáváme výhradně osobně. Přijďte nás navštívit — rádi poradíme
            s výběrem přímo na místě.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {branches.map((b) => (
            <div
              key={b.city}
              className={`rounded-2xl overflow-hidden border ${
                b.status === "open"
                  ? "border-forest/30"
                  : "border-border-green"
              } bg-green-bg flex flex-col`}
            >
              {/* Map */}
              <div className="relative h-56 w-full bg-green-bg-dark">
                {b.status === "soon" && (
                  <div className="absolute inset-0 bg-ink/20 z-10 flex items-center justify-center">
                    <span className="bg-forest text-cream text-sm font-semibold px-5 py-2 rounded-full">
                      {b.badge}
                    </span>
                  </div>
                )}
                <iframe
                  src={b.mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa pobočky ${b.city}`}
                />
              </div>

              {/* Info */}
              <div className="p-7 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-ink">{b.city}</h3>
                    <p className="text-ink-soft mt-1">{b.address}</p>
                    <p className="text-ink-muted text-sm">{b.zip}</p>
                  </div>
                  {b.status === "open" ? (
                    <span className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-forest bg-forest/10 px-3 py-1.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
                      Otevřeno
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs font-semibold text-ink-muted bg-border-green px-3 py-1.5 rounded-full">
                      {b.badge}
                    </span>
                  )}
                </div>

                {/* Hours */}
                <div className="flex items-center gap-3 text-sm text-ink-soft">
                  <svg className="w-4 h-4 text-forest shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {b.hours}
                </div>

                {/* Address row */}
                <div className="flex items-center gap-3 text-sm text-ink-soft">
                  <svg className="w-4 h-4 text-forest shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {b.address}, {b.zip}
                </div>

                {/* Navigate button */}
                <a
                  href={b.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-2 border border-forest text-forest font-semibold text-sm px-6 py-3 rounded-full hover:bg-forest hover:text-cream transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Navigovat
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

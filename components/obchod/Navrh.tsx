// Poznámka viditelná jen v návrhu: říká, co je zatím ukázkové a co se zapne
// až s ostrým účtem (brána, ověření věku, mapa výdejen). Před spuštěním
// stačí vyhledat <Navrh> a všechny výskyty smazat.
export default function Navrh({
  children,
  tmavy,
  className = "",
}: {
  children: React.ReactNode;
  tmavy?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`rounded-xl border border-dashed px-3 py-2 !text-sm !leading-snug ${
        tmavy
          ? "border-cream/30 text-cream/70"
          : "border-ink/25 text-ink-muted"
      } ${className}`}
    >
      <strong className="font-bold uppercase tracking-wider">Návrh · </strong>
      {children}
    </p>
  );
}

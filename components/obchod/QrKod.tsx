import { qrCesta } from "@/lib/obchod/qr";

// QR kód vykreslený na serveru rovnou do SVG, bez skriptu v prohlížeči.
export default function QrKod({
  text,
  popis,
  className = "",
}: {
  text: string;
  popis: string;
  className?: string;
}) {
  const { d, n } = qrCesta(text);
  // Čtečky potřebují kolem kódu čtyři moduly klidného okraje.
  return (
    <svg
      role="img"
      aria-label={popis}
      viewBox={`-4 -4 ${n + 8} ${n + 8}`}
      shapeRendering="crispEdges"
      className={className}
    >
      <rect x={-4} y={-4} width={n + 8} height={n + 8} fill="#fff" />
      <path d={d} fill="#1A1A18" />
    </svg>
  );
}

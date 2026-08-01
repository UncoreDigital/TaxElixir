import { cn } from "@/lib/utils";

/**
 * The shield mark as inline SVG. Pure geometry — no font, no raster — so it is
 * safe at 16px and at 800px.
 */
export default function Mark({
  variant = "gold",
  className,
  idPrefix = "mark",
}: {
  variant?: "gold" | "outline";
  className?: string;
  idPrefix?: string;
}) {
  const outer =
    "M60 6 L14 22 V70 C14 98 34 118 60 134 C86 118 106 98 106 70 V22 Z";
  const inner =
    "M60 16 L23 29 V70 C23 92 39 108 60 120 C81 108 97 92 97 70 V29 Z";

  const ink = variant === "outline" ? "hsl(var(--gold))" : "hsl(var(--navy))";
  const gradId = `${idPrefix}-shield`;

  return (
    <svg
      viewBox="0 0 120 140"
      className={cn("h-auto", className)}
      role="img"
      aria-label="TaxElixir"
    >
      {variant === "gold" && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--gold-light))" />
            <stop offset="55%" stopColor="hsl(var(--gold))" />
            <stop offset="100%" stopColor="hsl(var(--gold-dark))" />
          </linearGradient>
        </defs>
      )}

      <path
        d={outer}
        fill={variant === "gold" ? `url(#${gradId})` : "none"}
        stroke={variant === "gold" ? "hsl(var(--navy))" : "hsl(var(--gold))"}
        strokeWidth={variant === "gold" ? 4 : 5}
      />
      <path
        d={inner}
        fill="none"
        stroke={variant === "gold" ? "hsl(var(--navy))" : "hsl(var(--gold))"}
        strokeWidth={2}
        opacity={variant === "gold" ? 0.85 : 0.55}
      />

      {/* Interlocking serif TE monogram, drawn as geometry. */}
      <g fill={ink}>
        <rect x="28" y="43" width="42" height="10" />
        <rect x="28" y="43" width="6" height="14" />
        <rect x="64" y="43" width="6" height="14" />
        <rect x="44" y="43" width="10" height="52" />
        <rect x="36" y="89" width="26" height="6" />
        <rect x="52" y="57" width="10" height="47" />
        <rect x="52" y="57" width="32" height="9" />
        <rect x="52" y="76" width="26" height="8" />
        <rect x="52" y="95" width="34" height="9" />
      </g>
    </svg>
  );
}

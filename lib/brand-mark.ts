/**
 * The TaxElixir shield mark, reconstructed as vector paths from logo.jpeg.
 *
 * The supplied logo is a 1600x427 raster lockup — unusable as a favicon (it
 * renders as a squashed sliver) and unusable on dark backgrounds (it carries a
 * near-white #FCFCFC field). This module rebuilds just the shield element as
 * geometry, so it can be a favicon, an app icon, a social card and a watermark
 * without any raster or font dependency.
 *
 * Colours are the sampled logo values — see lib/site.ts and globals.css.
 */

export const BRAND = {
  navy: "#0C2748",
  navyDeep: "#002448",
  goldLight: "#D8B460",
  gold: "#CBA85A",
  goldDark: "#C0A854",
  paper: "#FCFCFC",
} as const;

/** Outer shield silhouette — flat top, straight flanks, point at the base. */
const SHIELD_OUTER =
  "M60 6 L14 22 V70 C14 98 34 118 60 134 C86 118 106 98 106 70 V22 Z";

/** The inset keyline the original artwork carries inside the shield edge. */
const SHIELD_INNER =
  "M60 16 L23 29 V70 C23 92 39 108 60 120 C81 108 97 92 97 70 V29 Z";

/**
 * Interlocking serif "TE" monogram. Drawn as rectangles rather than glyphs so
 * it renders identically everywhere — an SVG favicon cannot rely on a font
 * being available, and Satori (the OG image renderer) does not load page fonts.
 */
const MONOGRAM = `
  <g fill="{{ink}}">
    <rect x="28" y="43" width="42" height="10"/>
    <rect x="28" y="43" width="6"  height="14"/>
    <rect x="64" y="43" width="6"  height="14"/>
    <rect x="44" y="43" width="10" height="52"/>
    <rect x="36" y="89" width="26" height="6"/>
    <rect x="52" y="57" width="10" height="47"/>
    <rect x="52" y="57" width="32" height="9"/>
    <rect x="52" y="76" width="26" height="8"/>
    <rect x="52" y="95" width="34" height="9"/>
  </g>`;

type MarkOptions = {
  /** Shield fill. "gold" for light backgrounds, "outline" for dark ones. */
  variant?: "gold" | "outline";
  size?: number;
  /** Unique id prefix — two gradients with the same id on one page collide. */
  idPrefix?: string;
};

export function markSvg({
  variant = "gold",
  size = 120,
  idPrefix = "te",
}: MarkOptions = {}): string {
  const gradId = `${idPrefix}-shield-gold`;
  const height = Math.round((size * 140) / 120);

  if (variant === "outline") {
    // Dark backgrounds: gold linework, no fill, monogram in gold.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="${size}" height="${height}" role="img" aria-label="TaxElixir">
  <path d="${SHIELD_OUTER}" fill="none" stroke="${BRAND.gold}" stroke-width="5"/>
  <path d="${SHIELD_INNER}" fill="none" stroke="${BRAND.gold}" stroke-width="2" opacity="0.55"/>
  ${MONOGRAM.replace("{{ink}}", BRAND.gold)}
</svg>`;
  }

  // Light backgrounds: the gold shield with its vertical gradient, navy ink.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="${size}" height="${height}" role="img" aria-label="TaxElixir">
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${BRAND.goldLight}"/>
      <stop offset="55%"  stop-color="${BRAND.gold}"/>
      <stop offset="100%" stop-color="${BRAND.goldDark}"/>
    </linearGradient>
  </defs>
  <path d="${SHIELD_OUTER}" fill="url(#${gradId})" stroke="${BRAND.navy}" stroke-width="4"/>
  <path d="${SHIELD_INNER}" fill="none" stroke="${BRAND.navy}" stroke-width="2" opacity="0.85"/>
  ${MONOGRAM.replace("{{ink}}", BRAND.navy)}
</svg>`;
}

/** Base64 data URI — Satori and CSS `url()` both need this rather than a path. */
export function markDataUri(options?: MarkOptions): string {
  const encoded = Buffer.from(markSvg(options)).toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
}

export { SHIELD_OUTER, SHIELD_INNER };

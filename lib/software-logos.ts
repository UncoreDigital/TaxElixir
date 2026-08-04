import fs from "node:fs";
import path from "node:path";

/**
 * Maps a software slug to its logo file, if one has been supplied.
 *
 * The directory is read at build time rather than the paths being hard-coded,
 * because the person adding these logos is the client, not a developer. They
 * drop `quickbooks.svg` into public/assets/software/ and it appears — no edit
 * to a manifest, no PR, nothing to get wrong. A slug with no matching file
 * simply returns null and the card falls back to a wordmark.
 *
 * Server-only: every consumer is a server component. Importing this into a
 * "use client" file will fail the build on `node:fs`, which is the correct
 * outcome rather than something to work around.
 */

const DIR = path.join(process.cwd(), "public", "assets", "software");

/** Ordered by preference — vector first, then the lossless raster formats. */
const EXTENSIONS = [".svg", ".webp", ".png", ".jpg", ".jpeg"];

function build(): Record<string, string> {
  let entries: string[];
  try {
    entries = fs.readdirSync(DIR);
  } catch {
    // Directory absent is the normal state until the first logo lands.
    return {};
  }

  const found: Record<string, string> = {};

  for (const ext of [...EXTENSIONS].reverse()) {
    for (const entry of entries) {
      if (path.extname(entry).toLowerCase() !== ext) continue;
      // Later loop passes overwrite earlier ones, so iterating the extension
      // list in reverse leaves the most-preferred format as the final value.
      found[path.basename(entry, path.extname(entry)).toLowerCase()] =
        `/assets/software/${entry}`;
    }
  }

  return found;
}

const logos = build();

export function softwareLogo(slug: string): string | null {
  return logos[slug.toLowerCase()] ?? null;
}

/** How many of the listed tools actually have artwork — drives the dev hint. */
export function softwareLogoCount(): number {
  return Object.keys(logos).length;
}

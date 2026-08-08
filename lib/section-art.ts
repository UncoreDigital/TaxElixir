import fs from "node:fs";
import path from "node:path";

/**
 * Resolves artwork for a homepage section, if it has been supplied yet.
 *
 * Same idea as lib/software-logos: the directory is read at build time rather
 * than the path being hard-coded, because the person adding these files is not
 * the person editing the code. Drop `built-for.webp` into public/assets/home/
 * and it appears on the next build.
 *
 * The alternative — hard-coding the path — renders a broken image on every
 * preview between now and the file landing, because next/image does not check
 * that a local file exists until something requests it. Returning null lets the
 * section fall back to the brand's own surface, which reads as designed rather
 * than as missing.
 *
 * Server-only: importing this into a "use client" file will fail the build on
 * `node:fs`, which is the correct outcome rather than something to work around.
 */

const DIR = path.join(process.cwd(), "public", "assets", "home");

/** Ordered by preference. */
const EXTENSIONS = [".webp", ".avif", ".jpg", ".jpeg", ".png"];

export function sectionArt(name: string): string | null {
  for (const ext of EXTENSIONS) {
    const file = `${name}${ext}`;
    try {
      if (fs.existsSync(path.join(DIR, file))) return `/assets/home/${file}`;
    } catch {
      // Directory absent is the normal state until the first file lands.
      return null;
    }
  }
  return null;
}

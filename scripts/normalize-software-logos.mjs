/**
 * Normalises vendor logos in public/assets/software/ onto one canvas.
 *
 *   node scripts/normalize-software-logos.mjs
 *
 * Why this exists: vendor artwork arrives as whatever the vendor publishes.
 * Across the current set the trimmed aspect ratios run from 0.78:1 (CCH Axcess,
 * a stacked lockup) to 7.6:1 (Drake, a long wordmark), and most files carry a
 * different amount of baked-in padding. Dropped into a row untouched they sit at
 * wildly different optical weights and the wall looks sloppy — the wide ones
 * read as small, the square ones as huge.
 *
 * Two passes fix that:
 *   1. Trim the padding, so the file's own whitespace stops deciding its size.
 *   2. Scale toward a constant *area* rather than a constant bounding box, then
 *      clamp into the canvas. Equal-area is much closer to how the eye judges
 *      "these logos are the same size" than equal-width or equal-height.
 *
 * Every output is the same pixel dimensions, so the card can render a fixed box
 * and nothing can overflow or shift.
 *
 * Re-runnable: it writes `<slug>.norm.png` and leaves originals alone, so a bad
 * run is not destructive. Originals are kept in `_source/`.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "assets", "software");
const SOURCE = path.join(DIR, "_source");

/** Output canvas. Matches the card's inner width at the smallest card size. */
const CANVAS_W = 200;
const CANVAS_H = 56;

/** Target ink area. Tuned so a long wordmark and a square mark look equal. */
const TARGET_AREA = 6600;

const INPUT = /\.(png|jpe?g|webp)$/i;

async function main() {
  if (!fs.existsSync(SOURCE)) fs.mkdirSync(SOURCE, { recursive: true });

  // Prefer originals in _source once they have been moved there, so re-running
  // never normalises an already-normalised file.
  const fromSource = fs.readdirSync(SOURCE).filter((f) => INPUT.test(f));
  const fromDir = fs
    .readdirSync(DIR)
    .filter((f) => INPUT.test(f) && !f.endsWith(".norm.png"));

  for (const file of fromDir) {
    fs.renameSync(path.join(DIR, file), path.join(SOURCE, file));
  }

  const files = [...new Set([...fromSource, ...fromDir])];
  if (files.length === 0) {
    console.log("No logos found in public/assets/software/ — nothing to do.");
    return;
  }

  for (const file of files) {
    const slug = path.basename(file, path.extname(file));
    const src = path.join(SOURCE, file);

    // Trim first so the vendor's own padding stops influencing the scale.
    const trimmed = await sharp(src)
      .trim({ threshold: 12 })
      .toBuffer({ resolveWithObject: true })
      .catch(async () => ({
        data: await sharp(src).toBuffer(),
        info: await sharp(src).metadata(),
      }));

    const { width: w, height: h } = trimmed.info;

    // Equal-area scale, then clamp so it always fits the canvas.
    let scale = Math.sqrt(TARGET_AREA / (w * h));
    scale = Math.min(scale, CANVAS_W / w, CANVAS_H / h);

    const outW = Math.max(1, Math.round(w * scale));
    const outH = Math.max(1, Math.round(h * scale));

    await sharp(trimmed.data)
      .resize(outW, outH, { fit: "fill" })
      .extend({
        top: Math.floor((CANVAS_H - outH) / 2),
        bottom: Math.ceil((CANVAS_H - outH) / 2),
        left: Math.floor((CANVAS_W - outW) / 2),
        right: Math.ceil((CANVAS_W - outW) / 2),
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(path.join(DIR, `${slug}.norm.png`));

    console.log(
      `  ${slug.padEnd(14)} ${String(`${w}x${h}`).padEnd(10)} -> ${String(`${outW}x${outH}`).padEnd(9)} on ${CANVAS_W}x${CANVAS_H}`
    );
  }

  console.log(`\n${files.length} logo(s) normalised. Originals kept in _source/.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

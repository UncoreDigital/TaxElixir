# Software logos

Drop a logo in here named after the tool's `slug` in `lib/content.ts` and the
card on the Software section picks it up on the next build. No code change.

    public/assets/software/quickbooks.svg   ->  the "QuickBooks" card

Filenames expected (from `software` in `lib/content.ts`):

| Slug            | Tool         |
|-----------------|--------------|
| `cch-axcess`    | CCH Axcess   |
| `caseware`      | CaseWare     |
| `quickbooks`    | QuickBooks   |
| `xero`          | Xero         |
| `ultratax-cs`   | UltraTax CS  |
| `lacerte`       | Lacerte      |
| `drake-tax`     | Drake Tax    |
| `proconnect`    | ProConnect   |
| `sage`          | Sage         |
| `netsuite`      | NetSuite     |

## Format

`.svg` preferred, then `.webp`, `.png`, `.jpg`. If several formats of the same
slug are present the first in that order wins.

## Normalise after adding one

    node scripts/normalize-software-logos.mjs

Vendor artwork arrives at whatever size and padding the vendor publishes — the
current set ranges from 0.78:1 (CCH Axcess, stacked) to 7.6:1 (Drake, a long
wordmark). Dropped in raw they sit at visibly different weights.

The script trims each file, scales it toward a constant *ink area* rather than a
constant box — which is much closer to how the eye judges "same size" — and
centres the result on a shared 200x56 canvas as `<slug>.norm.png`. Originals are
moved to `_source/` and never overwritten, so it is safe to re-run.

`<slug>.norm.png` always wins over a raw file of the same slug. A raw drop-in
still works if you skip the script; it will just be less even.

## Before you add one

These are third-party trademarks. Use the vendor's own official asset from their
press or brand page, at the size and colourway their brand guidelines permit, and
do not recolour, redraw or place them on a background their guidelines prohibit.
Several vendors (Intuit, Xero, Sage) additionally restrict logo use to their
partner programmes — see gap #20 in `docs/CLIENT-CONTENT-GAPS.md`. A slug with no
file falls back to a plain wordmark, which is always safe.

Provenance of the current set is recorded in `_source/PROVENANCE.md`.

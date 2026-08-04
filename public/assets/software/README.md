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

Cards are 112px tall and cap the logo at 48px high, `object-contain`. Supply the
logo on a transparent or white background, trimmed of surrounding whitespace —
padding baked into the file makes that logo look smaller than its neighbours.

## Before you add one

These are third-party trademarks. Use the vendor's own official asset from their
press or brand page, at the size and colourway their brand guidelines permit, and
do not recolour, redraw or place them on a background their guidelines prohibit.
Several vendors (Intuit, Xero, Sage) additionally restrict logo use to their
partner programmes — see gap #20 in `docs/CLIENT-CONTENT-GAPS.md`. A slug with no
file falls back to a plain wordmark, which is always safe.

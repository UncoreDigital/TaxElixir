# Where these files came from

Recorded so the question "can we actually use this?" has an answer later, when
nobody remembers.

## Current set

The seven files in this folder were retrieved on 2026-08-04 from
`unisonglobus.com/wp-content/uploads/`, at the client's explicit instruction,
after the client supplied the source URLs.

| File                 | Slug         |
|----------------------|--------------|
| `Xero.png`           | `xero`       |
| `Quickbooks.png`     | `quickbooks` |
| `sage.png`           | `sage`       |
| `Pro-connect.png`    | `proconnect` |
| `DrakeSoftware.png`  | `drake-tax`  |
| `cch-axcess-logo.jpg`| `cch-axcess` |
| `O-NetSuite-rgb.png` | `netsuite`   |

## What that means

These are the vendors' trademarks — Intuit, Xero, Sage, Oracle, Wolters Kluwer,
Drake. Unisonglobus does not own them and is not the licensor; that site was only
where the copies happened to be hosted. So retrieving them from there settles
nothing about whether TaxElixir may display them. Two things still stand:

1. **Colourway and treatment.** These are one vendor's published rendition, not
   necessarily the current approved asset. Vendors update marks. Check each
   against the vendor's own brand page before this goes to production.

2. **Partner-programme restrictions.** Intuit (QuickBooks, ProConnect), Xero and
   Sage restrict logo use to firms enrolled in their partner programmes. If
   TaxElixir is not enrolled, those three should come out and revert to the
   wordmark fallback, which needs no permission. This is gap #20 in
   `docs/CLIENT-CONTENT-GAPS.md`.

Replacing any file with the vendor's official asset is a drop-in: same filename,
then re-run `node scripts/normalize-software-logos.mjs`.

## Still missing

`caseware`, `ultratax-cs` and `lacerte` were not in the source set — those three
tools are not on unisonglobus's list. They render as wordmark cards until
official artwork is supplied.

# TaxElixir — what we still need from the client

The services deck (`TaxElixir Services.xlsx`) covered the **service lines** thoroughly —
every return type, every accounting task, all five audit engagement types and all six
offshore roles are on the site in the client's own wording.

It contained nothing about the **firm itself**. Everything below is a gap. Each one is
currently rendered as a visible amber placeholder in development and as an empty slot or
an em dash in production. Nothing has been invented to fill a space.

---

## 🔴 Blockers — the site should not go live until these are resolved

| # | Item | Where it appears | Why it blocks |
|---|---|---|---|
| 1 | **Brand spelling confirmation** | Everywhere | The logo reads `TaxElixir`; the deck writes `TaxEliXir` in 9 of 11 headers. Built with the logo spelling. One-line change in `lib/site.ts` if wrong — but wrong on launch day means every page, title and URL |
| 2 | **Certifications — do you hold ISO 27001 / SOC 2 / GDPR?** | `/security` | Currently claims **none**. Publishing an unevidenced badge on a page selling data security to CPA firms is the fastest way to fail a due-diligence review. If held, supply certificate numbers and PDFs; if not held, we position around the control set instead |
| 3 | **Verify the security control set** | `/security` (8 controls) | The eight controls listed are the ones a CPA firm's vendor questionnaire asks about. Each is drafted. Any that is not actually in place must be removed before launch, not after a prospect asks |
| 4 | **Legal review of the privacy policy** | `/privacy-policy` | Drafted skeleton, not legal advice. Counsel must confirm: retention period, lawful basis for transferring data to India, and CCPA/CPRA rights |
| 5 | **Phone number** | Contact page, footer | No phone number was supplied. US firms expect one from an offshore provider — its absence is read as a red flag |
| 6 | **Registered office address** | Contact page, footer, schema | Same reason. Also feeds `ProfessionalService` structured data |

---

## 🟠 High value — significantly weakens the site while missing

| # | Item | Where | Notes |
|---|---|---|---|
| 7 | **Years in business** | Homepage, About, `/admin/settings` | Renders as an em dash today |
| 8 | **Number of professionals** | Homepage, About | " |
| 9 | **Number of CPA firms supported** | Homepage, About | " |
| 10 | **Returns prepared annually** | Homepage, About | Strongest single number for this audience — a CPA firm evaluating a partner wants throughput |
| 11 | **Client testimonials** (3–5, named person + firm) | Homepage, service pages | The competitor uses five named testimonials from named firms as its main trust signal. `lib/content.ts → testimonials` is an empty array; the section stays hidden until filled |
| 12 | **Leadership team** — names, titles, short bios, photos | `/about` | Currently a placeholder. Offshore providers get asked "who is actually accountable?" — this is where that is answered |
| 13 | **Software licences** — which of QuickBooks, Xero, UltraTax, Lacerte, Drake, ProConnect, Sage, NetSuite do you actually work in? | `/software`, service pages | Only **CCH Axcess** and **CaseWare** are confirmed, from the audit sheet. The rest are drafted and marked `verified: false` in `lib/content.ts` |

Set 7–10 once in **Admin → Site Settings** and every page picks them up. They deliberately
cannot be hard-coded per page.

---

## 🟣 Brand assets — we generated stand-ins, originals are better

The only artwork supplied was `logo.jpeg` — a 1600×427 raster lockup on a near-white
field. That is unusable as a favicon (it renders as a squashed sliver in a browser tab)
and unusable on dark backgrounds (it leaves a white patch on the navy footer).

So the shield mark was **rebuilt as vector geometry** from the logo and used to generate
a full icon and social-card set. Everything below works today — but the client's original
files would be better, and item 14 in particular should be checked by whoever designed
the logo.

| # | Item | What we generated as a stand-in | Why the original matters |
|---|---|---|---|
| 14 | **Vector logo source** — `.ai`, `.eps` or `.svg` | Shield mark redrawn as SVG paths from the JPEG; wordmark set live in Playfair Display | Our redraw is a close match, not a trace. If the real logo uses a specific licensed typeface or precise shield curve, this will drift from print and social collateral |
| 15 | **Logo variants** — transparent PNG, white/knockout version | Vector lockup that recolours for dark backgrounds | Needed for partner directories, PDFs, email signatures, conference material |
| 16 | **Brand guidelines** — if any exist (colour codes, clear space, approved fonts) | Palette sampled from the JPEG by pixel clustering: navy `#0C2748`, gold `#D8B460 → #C0A854` | Confirms our sampled values match the intended brand colours |
| 17 | **Team headshots** — consistent framing, plain background | Dashed placeholder frames on `/about` | Deliberately not stock photography. A leadership page with purchased faces is worse than an honest empty frame |
| 18 | **Office photographs** — workspace, security-controlled floor | None; `/security` is text-only | Strong trust signal for a page about protecting client data |
| 19 | **Article cover images** | Branded shield-and-grid fallback plate, auto-applied per category | Real images lift click-through on social; the fallback is a floor, not a target |
| 20 | **Software partner badges** — if TaxElixir holds any (Intuit ProAdvisor, Xero Partner, etc.) | Plain text pills | Trademarked logos cannot be used without authorisation — supply proof of partner status and we will use the official badge |

**What is already generated and needs no client input:** favicon (`app/icon.svg`), Apple
touch icon (180×180), PWA icons (192/512), social share cards for the site and the blog
(1200×630), and the background patterns. All are produced by
[`scripts/generate-assets.js`](../scripts/generate-assets.js) — re-run `node scripts/generate-assets.js`
after any brand change and every size regenerates from one source.

---

## 🟡 Useful — improves conversion, not required for launch

| # | Item | Where |
|---|---|---|
| 21 | LinkedIn / social URLs | Footer |
| 22 | Case studies — even one, anonymised ("a 12-partner firm in Ohio…") | New `/case-studies` section |
| 23 | Engagement pricing or a starting rate | `/how-we-work` |
| 24 | Typical turnaround times per work type | `/how-we-work`, service pages |
| 25 | Team size / working hours overlap with US time zones | `/about`, `/how-we-work` |
| 26 | Sample workpaper or deliverable (redacted) | `/how-we-work` |

---

## Copy the client should review

These read as drafted rather than fabricated, but they are our words describing their
business, so they need a read-through and sign-off:

- All four service page `intro` paragraphs — `lib/services-data.ts`
- All six role `intro` and `whoFor` blocks — `lib/hire-data.ts`
- The six "Why firms work with us" points — `lib/content.ts → whyUs`
- The five-step engagement process — `lib/content.ts → workflow`
- The eight FAQ answers — `lib/content.ts → faqs`
- The four "What we stand for" values — `/about`

The service **scope lists**, the back-year **process table**, the audit **deliverables
table** and every role's **capabilities** are the client's own wording, transcribed
verbatim. Those need checking for transcription accuracy only.

---

## One thing worth flagging back

The deck describes the audit service as *"Financial Statement Audit — detailed, compliant
financial statement reviews"*. On the site this is worded as **audit support** throughout —
"execute audit procedures", "prepare workpapers" — never "we audit" or "we review".

That is deliberate, and it follows from the client's own disclaimer that TaxElixir is not
a CPA firm. A non-licensed offshore provider describing itself as performing financial
statement audits for US clients is a claim that invites exactly the wrong kind of
attention. If the client wants stronger wording here, it should go past their counsel
first.

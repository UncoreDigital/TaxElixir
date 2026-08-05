# TaxElixir — what we still need from the client

The services deck (`TaxElixir Services.xlsx`) covered the **service lines** thoroughly —
every return type, every accounting task, all five audit engagement types and all six
offshore roles are on the site in the client's own wording.

It contained nothing about the **firm itself**. Everything below is a gap. Each one is
currently rendered as a visible amber placeholder in development and as an empty slot or
an em dash in production. Nothing has been invented to fill a space.

---

## ⚪ Round 2 — `changes/Website Updates.xlsx` (August 2026)

The client returned 18 change requests plus two assets. All 18 are implemented. This
section records what that round **closed** and what it **opened**, so the tables below can
be read against it.

**Closed by this round**

- **Gaps 7–10** (years in business, professionals, firms supported, returns annually) are
  no longer gaps. The client replaced all four headline figures with operational facts they
  are willing to state — three-level review, licensed-CPA-led, 100% onsite secured
  operation, 24-hour software utilisation. Migration `0005_highlight_figures.sql` swaps the
  `site_settings` rows to match; the four old volume counters are deleted, not hidden.
- **Gap 5** (phone number) is resolved — a number is set in `site_settings` and rendering.
  See the formatting note below.
- **Gap 2** (certifications) no longer appears on the site: the client asked for the
  "Independent certifications" section to be removed from `/security` entirely. The
  underlying question is still open, but nothing on the site now depends on the answer.
- **Gap 22** (case studies) is parked rather than closed — `/case-studies` is behind
  `features.resources` with the rest of the Resources group.
- **Gap 15** (logo variants) is partly closed: the client supplied a dark-background
  export, now serving the footer as `public/assets/footer-logo.png`.

**Opened by this round**

| # | Item | Where | Notes |
|---|---|---|---|
| 31 | **Three hero carousel images** | Homepage hero panel | The rotating panel replacing the old service index is built and running on the three proof figures. Each slide has an image slot rendering the brand's grid-and-shield surface until artwork lands. Drop files into `public/assets/success/` and set `image` in `lib/content.ts → successProof` |
| 32 | **Three named client success stories, each with its industry** | `/about` | The client asked for industry, the 55–75% cost range, the 48-hour turnaround and capacity. Three of those four are live as figures. Industry needs an actual engagement to name and none was supplied — an invented one would be the single line on the page a prospect could catch us on |
| 33 | **Software artwork for CaseWare, UltraTax CS and Lacerte** | Homepage, `/software` | Narrows gap 20a: 7 of the 10 tools now have normalised logos. These three still render as wordmark cards. Client is supplying the artwork |
| 34 | **Footer logo lettering — white or gold?** | Footer | The sheet says *"Letter should be in Golden"*; the file supplied has **white** lettering. Built with the supplied file. One-line swap in `lib/site.ts → footerLogo` if gold was meant literally |
| 35 | **Phone number formatting** | Top bar, footer, contact page | The stored value is `+918552859594` and renders exactly as stored — an unbroken 12-digit run. Re-enter it as `+91 85528 59594` under **Admin → Site Settings**; the `tel:` link strips the spaces itself, so display and dialling stay in sync |

**Deliberately not reinstated:** the partnership-specific FAQ block. Row 15 of the sheet
confines FAQ sections to the homepage, `/software` and `/faqs`, so it was removed from
`/partnership` along with the Software and FAQ blocks on `/services`, `/services/[slug]`,
`/how-we-work` and `/hire/[slug]`. The four questions it carried are answered by the shared
set on `/faqs`; the copy is in git if it is wanted back.

---

## 🔴 Blockers — the site should not go live until these are resolved

| # | Item | Where it appears | Why it blocks |
|---|---|---|---|
| 1 | **Brand spelling confirmation** | Everywhere | The logo reads `TaxElixir`; the deck writes `TaxEliXir` in 9 of 11 headers. Built with the logo spelling. One-line change in `lib/site.ts` if wrong — but wrong on launch day means every page, title and URL |
| 2 | ~~**Certifications — do you hold ISO 27001 / SOC 2 / GDPR?**~~ | ~~`/security`~~ | **Closed in round 2** — the client removed the certifications section from `/security`. The site now claims nothing either way. If certifications are later held and a badge is wanted back, the original rule still governs: nothing goes on that page until it can be evidenced |
| 3 | **Verify the security control set** | `/security` (8 controls) | The eight controls listed are the ones a CPA firm's vendor questionnaire asks about. Each is drafted. Any that is not actually in place must be removed before launch, not after a prospect asks |
| 4 | **Legal review of the privacy policy** | `/privacy-policy` | Drafted skeleton, not legal advice. Counsel must confirm: retention period, lawful basis for transferring data to India, and CCPA/CPRA rights |
| 5 | ~~**Phone number**~~ | ~~Contact page, footer~~ | **Closed in round 2** — set in `site_settings` and rendering in the top bar, footer and contact page. Formatting still needs a pass; see gap 35 |
| 6 | **Registered office address** | Contact page, footer, schema | Same reason. Also feeds `ProfessionalService` structured data |

---

## 🟠 High value — significantly weakens the site while missing

| # | Item | Where | Notes |
|---|---|---|---|
| 7–10 | ~~**Years in business · professionals · CPA firms supported · returns annually**~~ | ~~Homepage, About~~ | **Withdrawn in round 2.** The client replaced all four volume counters with operational facts (see the round 2 section above), so none of these renders anywhere and `site_settings` no longer carries their rows. Worth revisiting later regardless: throughput is still the strongest single number for this audience, and nothing stops a fifth figure being added back once there is one worth publishing |
| 11 | **Client testimonials** (3–5, named person + firm) | Homepage, service pages | The competitor uses five named testimonials from named firms as its main trust signal. `lib/content.ts → testimonials` is an empty array; the section stays hidden until filled |
| 12 | **Leadership team** — names, titles, short bios, photos | `/about` | **Partly supplied.** Dhara Jain (founder) is live with photo and bio; her *title* is our inference from "owner" and needs confirming. Anyone else on the leadership bench is still outstanding — offshore providers get asked "who is actually accountable?", and one name only answers part of it |
| 13 | **Software licences** — which of QuickBooks, Xero, UltraTax, Lacerte, Drake, ProConnect, Sage, NetSuite do you actually work in? | `/software`, service pages | Only **CCH Axcess** and **CaseWare** are confirmed, from the audit sheet. The rest are drafted and marked `verified: false` in `lib/content.ts` |

The four highlighted figures that replaced 7–10 are edited the same way — set them once in
**Admin → Site Settings** and every page picks them up. They deliberately cannot be
hard-coded per page.

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
| 17 | **Team headshots** — consistent framing, plain background | One supplied: `public/assets/team/Owner.jpeg`, 1254×1254, plain office background | Match this framing for the rest of the team so the row does not read as a collage. Still no stock photography for the unfilled slots |
| 18 | **Office photographs** — workspace, security-controlled floor | None; `/security` is text-only | Strong trust signal for a page about protecting client data |
| 19 | **Article cover images** | Branded shield-and-grid fallback plate, auto-applied per category | Real images lift click-through on social; the fallback is a floor, not a target |
| 20 | **Software partner badges** — if TaxElixir holds any (Intuit ProAdvisor, Xero Partner, etc.) | Wordmark cards | Trademarked logos cannot be used without authorisation — supply proof of partner status and we will use the official badge |
| 20a | **Software vendor logos** — official artwork for the 10 tools on the Software section | Wordmark card per tool; the logo slot is built and waiting | Drop `<slug>.svg` into `public/assets/software/` (see the README there) and each card swaps to the logo on the next build — no code change. Use the vendor's own press-page asset; several restrict logo use to their partner programmes, which is gap 20 above |

**What is already generated and needs no client input:** favicon (`app/icon.svg`), Apple
touch icon (180×180), PWA icons (192/512), social share cards for the site and the blog
(1200×630), and the background patterns. All are produced by
[`scripts/generate-assets.js`](../scripts/generate-assets.js) — re-run `node scripts/generate-assets.js`
after any brand change and every size regenerates from one source.

---

## 🔵 Scope confirmation — four service pages now built, three need sign-off

All nine service pages are live. Four of them cover work that does **not** appear in the
TaxElixir services deck, so their scope was drafted from standard practice rather than
transcribed. Each renders a visible amber notice during review, and each needs the client
to confirm, correct or remove it before launch.

A service page is a promise. These four are promises the client has not yet made.

| # | Service | Status | What we need confirmed |
|---|---|---|---|
| 27 | **Payroll Services** — `/services/payroll` | Provisional | The deck lists payroll only as a *role* ("Offshore Payroll Expert", sheet 4), not a service scope. The page uses that role's four capabilities verbatim. **We deliberately did not claim 940/941/W-2 preparation or filing** — confirm whether TaxElixir performs those |
| 28 | **Sales Tax Services** — `/services/sales-tax` | Provisional | Absent from the deck. Confirm which of return preparation, multi-state filing, registration support, exemption-certificate tracking and notice handling are actually performed. Nexus determination is currently positioned as the firm's call, not ours |
| 29 | **Filing 1099 & Issue Forms** — `/services/filing-1099` | Provisional | Absent from the deck. Confirm the forms handled (1099-NEC, 1099-MISC, others?), whether TIN matching is performed, and whether submission happens under the client firm's credentials or ours |
| 30 | **Management Consultation** — `/services/management-consultation` | **Grounded — light review only** | Every scope item is verbatim from the deck's Accounting sheet: budgeting and forecasting, break-even analysis, cash flow monitoring, financial statement preparation and review, revenue reporting. This page reframes work already described rather than inventing a service. Read it for tone, not for accuracy |

### Client portal — currently a document exchange, not a login

The design brief asked for a **Client Login** in the sticky header. There is no
authenticated client area, so the link is labelled **Client Portal** and points at the
secure document upload — which is a real feature. Labelling it "Login" when it opens an
upload form is the kind of small dishonesty that costs trust on a site whose pitch is
security.

A genuine client portal — per-client accounts, engagement status, document history,
scoped access — is a separate build. If TaxElixir wants one, it needs scoping: who gets
accounts, what they can see, and how access is revoked when an engagement ends.

### Two items from the same brief that were not built

- **Regional sections for UK, Australia and Canada.** TaxElixir's own deck says it serves
  US CPA firms *exclusively*. Building four regional sections would contradict that
  positioning, would require service content that does not exist (VAT, BAS, T1/T2), and is
  the exact structure that left the competitor with four un-canonicalised duplicate pages
  and a UK section claiming more clients than the company claims worldwide. If TaxElixir
  does intend to serve those markets, that is a positioning decision to make first and a
  separate build to scope after.
- **Machine translation widget.** On the competitor's site this is currently *broken* — the
  `[gtranslate]` shortcode prints as literal text on all 68 pages. Beyond that, machine
  translation of tax and compliance copy risks mistranslating regulatory claims, and the
  audience here is US-based. Not recommended.

Two further items from the same brief were not built, for reasons worth stating plainly:

- **Regional sections for UK, Australia and Canada.** TaxElixir's own deck says it serves
  US CPA firms *exclusively*. Building four regional sections would contradict that
  positioning, and it is the exact structure that left the competitor with four
  un-canonicalised duplicate pages and a UK section claiming more clients than the company
  claims worldwide. If TaxElixir does intend to serve those markets, that is a positioning
  decision to make first and a build to scope separately.
- **Machine translation widget.** On the competitor's site this is currently *broken* — the
  `[gtranslate]` shortcode prints as literal text on all 68 pages. Beyond that, machine
  translation of tax and compliance copy risks mistranslating regulatory claims, and the
  audience here is US-based. Not recommended.

---

## 🟡 Useful — improves conversion, not required for launch

| # | Item | Where |
|---|---|---|
| 21 | LinkedIn / social URLs | Footer |
| 22 | Case studies — even one, anonymised ("a 12-partner firm in Ohio…") | `/case-studies`, **parked** behind `features.resources` — see gap 32 for the version now on `/about` |
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

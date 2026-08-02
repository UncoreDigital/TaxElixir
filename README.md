# TaxElixir

Marketing site + admin panel for **TaxElixir** — an India-based offshore outsourcing partner serving US CPA firms.

> **TaxElixir is not a CPA Firm. We are a professional outsourcing partner exclusively serving US CPA Firms.**
>
> This disclaimer is taken verbatim from the client's services deck. It appears in the footer of every page and in a dedicated band on every service and hire page. It is a liability boundary, not marketing copy — do not soften it, and do not let copy anywhere imply TaxElixir issues opinions, holds a licence, or serves end taxpayers.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS custom properties |
| Animation | framer-motion, variants centralised in [`lib/motion.ts`](lib/motion.ts) |
| Scrolling | Lenis momentum smoothing ([`SmoothScroll.tsx`](components/SmoothScroll.tsx)) |
| Database / Auth / Storage | Supabase |
| Rich text | TipTap (full toolbar, inline image upload) |
| Notifications | Supabase Edge Function + SMTP, fired by Database Webhooks |
| Validation | Zod |

Marketing pages are static / ISR. `/admin/*` is a client-rendered island behind Supabase Auth, `noindex`.

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                    # http://localhost:3000
```

### Supabase setup

1. Create a Supabase project.
2. Copy the URL and anon key into `.env.local`.
3. Open **Dashboard → SQL Editor → New query** and run the migrations in order:
   [`0001_init.sql`](supabase/migrations/0001_init.sql),
   [`0002_resources.sql`](supabase/migrations/0002_resources.sql),
   [`0003_newsletter.sql`](supabase/migrations/0003_newsletter.sql).
   Full schema reference: **[docs/DATABASE.md](docs/DATABASE.md)**.
4. Deploy the notification function and set its secrets, then run
   [`0004_webhooks.sql`](supabase/migrations/0004_webhooks.sql) with your project ref
   and service-role key substituted:

   ```bash
   supabase functions deploy lead-notification
   supabase secrets set SMTP_HOST=... SMTP_PORT=465 SMTP_USER=... \
                        SMTP_PASS=... NOTIFICATION_EMAIL=info@taxelixir.com
   ```
5. Create an admin user under **Authentication → Users → Add user** (email + password).
   There is no public sign-up: the only way to get an admin account is to create it here.
6. Sign in at `/admin/login`.

### Scripts

```bash
npm run dev         # dev server
npm run build       # production build
npm run start       # serve the production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

---

## Project structure

```
app/
  (marketing)/            static/ISR public site — TopBar + Header + Footer
    page.tsx              home
    services/[slug]/      tax · back-year-tax · accounting · bookkeeping · payroll · audit
    hire/[slug]/          six offshore roles
    about · how-we-work · security · software · faqs · partnership
    blog/ · blog/[slug]/           Insights, from Supabase
    case-studies/ · [slug]/        from Supabase
    events/ · guides/              from Supabase
    contact/ · upload/    lead form · secure document upload
    privacy-policy/
  admin/
    login/                unauthenticated
    (dashboard)/          guarded route group → AdminShell
      page.tsx            dashboard
      leads/ posts/ posts/[id]/ resources/ resources/[id]/ uploads/ settings/
  api/
    contact/              validate + insert lead (notification via DB webhook)
    newsletter/           subscribe
    admin/download/       60-second signed URLs for private files
  sitemap.ts robots.ts manifest.ts not-found.tsx globals.css

components/               shared UI; components/sections/* compose pages
  admin/RichTextEditor    TipTap editor, ported from Anchor and extended
lib/
  site.ts                 brand, contact, navigation
  services-data.ts        the 9 service lines     ← from the client's xlsx
  hire-data.ts            the 6 offshore roles    ← from the client's xlsx
  content.ts              drafted copy + stats + FAQs + security controls
  motion.ts               shared Framer Motion variants
  posts.ts · resources.ts published-content reads
  supabase/               browser + server clients, types
middleware.ts             session refresh + /admin guard
supabase/
  migrations/             0001 → 0004, run in order
  functions/lead-notification/   edge function (Deno)
```

### Admin → Site Settings, and where it surfaces

| Setting | Renders in |
|---|---|
| Years / Professionals / Firms / Returns | "By The Numbers" on the homepage and `/about` |
| Primary phone | TopBar (every page), Footer, `/contact` |
| Registered office address | Footer, `/contact` |
| LinkedIn URL | Footer |

Read via [`lib/settings.ts`](lib/settings.ts). The marketing tree revalidates every
300s, so an edit appears within five minutes without a rebuild.

Leave a figure empty and the site renders an em dash. Enter something
non-numeric (`TBC`, `**`) and it is echoed back verbatim — never coerced into a
number, because `Number("")` is `0` and that would print "0+".

### Where content lives

Service and role content is transcribed from **`TaxElixir Services.xlsx`** into
`lib/services-data.ts` and `lib/hire-data.ts`. Those two files are the source of
truth — edit them, not the page components. Everything renders from the data, so
a page cannot exist without being in the sitemap and cannot drift from the nav.

---

## Hero image

`hero.png` (repo root) is the master. [`components/sections/Hero.tsx`](components/sections/Hero.tsx)
serves the optimised `public/assets/hero/tower-night.webp` through `next/image` with
`priority`, so it is the LCP element and is preloaded. Browsers negotiate AVIF: **39 KB at
1080w, 74 KB at 1920w**.

**The contrast scrim was measured, not eyeballed.** The raw photograph has lit windows
reaching into the left column where the copy sits — worst-pixel contrast there was 2.5:1,
which fails WCAG outright. The scrim is a flat 28% navy tint plus a left-to-right gradient
holding ~90% over the copy column and releasing to 0 across the tower, so the gold windows
survive. Re-measured after compositing:

| Region | Mean | Worst pixel | |
|---|---|---|---|
| Headline | 15.9:1 | **15.3:1** | AAA |
| Proof points | 15.7:1 | **8.2:1** | AAA |
| CTA row | 15.6:1 | **10.4:1** | AAA |

If the image is ever swapped, re-run that measurement rather than assuming the new one
behaves the same — a brighter photo will need a heavier scrim.

**Known ceiling:** the source is 1672×941. Next will not upscale, so `w=3840` returns the
same bytes as `w=1920` and the image is marginally soft on very large displays. It is dark,
heavily scrimmed and decorative, so this is acceptable — but a 2560px-wide original would
be better if one is ever available.

## Motion

All variants live in [`lib/motion.ts`](lib/motion.ts) so timing is consistent across the
site rather than re-tuned per component. Three rules:

1. **One easing curve for entrances** — `EASE_OUT` `[0.16, 1, 0.3, 1]`, a long-tail
   ease-out. This is the difference between "premium" and "an element appeared".
2. **Distance scales with importance** — the hero headline travels 38px, a card 30px,
   a list row 14px. Matching them flattens the composition.
3. **Stagger is parent-driven** — `staggerChildren` on the container, never hand-tuned
   delays per child.

Every animated component reads `useReducedMotion()` and swaps in the inert `noMotion`
variant rather than setting a zero duration, which still runs a frame loop.

**On "scroll hijacking":** literal hijacking — intercepting the wheel to force fixed jumps
between sections — breaks the scrollbar, find-in-page and keyboard paging, and is a
documented accessibility failure. What produces the feel people mean by that phrase is
momentum smoothing, where scroll position still maps 1:1 to input and is merely eased.
That is what `SmoothScroll` does, and it disables itself entirely under reduced-motion and
on touch devices (which already have native momentum).

## Design system

Colours were sampled from `logo.jpeg` by pixel clustering rather than estimated:

| Token | Hex | HSL | Where in the logo |
|---|---|---|---|
| `--navy` | `#0C2748` | `hsl(213 71% 16%)` | Wordmark, shield outline, "TE" monogram |
| `--navy-deep` | `#002448` | `hsl(210 100% 14%)` | Core of the letterforms |
| `--gold-light` | `#D8B460` | `hsl(42 61% 61%)` | Top of the shield gradient |
| `--gold` | `#CBA85A` | `hsl(43 51% 58%)` | Shield centre |
| `--gold-dark` | `#C0A854` | `hsl(47 46% 54%)` | Bottom of the shield gradient |

The shield is a vertical gradient, reproduced as `--gradient-gold`.

**Emerald is a trust accent, not a second brand colour.** Gold is the logo and owns primary
CTAs. Emerald (`--emerald` `hsl(158 64% 34%)`) carries verified / secure / success states
only — certifications, encrypted-transfer signals, form confirmations — where green reads
as confirmation in a way gold never will. Keeping the two in separate jobs is what stops
the palette turning into decoration.

**Slate** is a cool grey scale biased toward the navy rather than neutral, so surfaces read
as part of the palette instead of borrowed from it.

### Type

| Role | Face | Why |
|---|---|---|
| Headings | **Plus Jakarta Sans** | Structured geometric sans — reads as financial-platform authority where a display serif reads as editorial or luxury |
| Body | **Inter** | Long-form readability |
| Wordmark only | **Playfair Display** | The supplied logo artwork is a transitional serif, so the lockup stays true to it even though page headings do not |

---

## Deliberate decisions

The brief was "a site like unisonglobus.com". That site was audited in full first;
its content architecture is worth copying and its execution is not. Several
decisions here exist specifically to avoid failures observed live on it:

| Their failure | What we do instead |
|---|---|
| Two main-nav items 301 to the homepage | Nav and footer are generated from `lib/site.ts`; every link resolves to a real page |
| "350+ clients globally" vs "500+ UK clients" — figures hard-coded per page | All figures come from one `site_settings` row, editable in the admin |
| Counters render a literal `0 +` without JS | Unconfirmed figures render an em dash, server-side. Never a zero, never invented |
| 13 pages with no `<h1>`, 40+ with two or three | `PageBanner` owns the single `<h1>`; section headings are always `<h2>` |
| ~30 live pages missing from the sitemap, including `/contact/` | `sitemap.ts` is generated from the same data the pages render from |
| Four duplicate pages with no canonical and no noindex | Every page sets an explicit canonical |
| 7–12 FAQs per page and no `FAQPage` schema | `FaqSection` emits the markup and the schema together so they cannot drift |
| No security headers at all, while selling SOC 2 / ISO 27001 | HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` set in `next.config.mjs` |
| 55–89% of images missing alt text | Alt text required; cover-image alt is a labelled field in the CMS |
| 383–467 KB of uncompressed HTML per page | 50–150 KB, ~120–190 KB first-load JS |

### Security notes

- The `client-documents` bucket is **private**. Never set `public = true`. Admin
  downloads go through `/api/admin/download`, which checks for an authenticated
  session and returns a URL that expires in 60 seconds.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never prefix it `NEXT_PUBLIC_`.
- Blog HTML is sanitised with DOMPurify **at render**, not only on save, so a
  payload stored before a rule change still cannot execute.
- Drafts are hidden by row-level security, not merely by a query filter.
- The contact form carries an off-screen honeypot; a tripped honeypot returns
  success so the bot learns nothing.

---

## Outstanding — see [`docs/CLIENT-CONTENT-GAPS.md`](docs/CLIENT-CONTENT-GAPS.md)

The services deck covered services thoroughly but contained no statistics, team,
certifications, testimonials or contact details. Those are drafted as visible
placeholders (dev only) rather than invented. **The site should not go live until
that checklist is cleared** — particularly the certifications on `/security` and
the legal review of `/privacy-policy`.

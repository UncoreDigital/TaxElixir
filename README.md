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
| Animation | framer-motion (respects `prefers-reduced-motion`) |
| Database / Auth / Storage | Supabase |
| Rich text | TipTap |
| Transactional email | Resend |
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
3. Open **Dashboard → SQL Editor → New query**, paste the contents of
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and run it.
4. Create an admin user under **Authentication → Users → Add user** (email + password).
   There is no public sign-up: the only way to get an admin account is to create it here.
5. Sign in at `/admin/login`.

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
  (marketing)/            static/ISR public site, wrapped in Header + Footer
    page.tsx              home
    services/[slug]/      tax · back-year-tax · accounting · audit
    hire/[slug]/          six offshore roles
    about · how-we-work · security · software · faqs
    blog/ · blog/[slug]/  Insights, read from Supabase
    contact/ · upload/    lead form · secure document upload
    privacy-policy/
  admin/
    login/                unauthenticated
    (dashboard)/          guarded route group → AdminShell
      page.tsx            dashboard
      leads/ posts/ posts/[id]/ uploads/ settings/
  api/
    contact/              lead insert + Resend notification
    admin/download/       60-second signed URLs for private files
  sitemap.ts robots.ts not-found.tsx globals.css

components/               shared UI; components/sections/* compose pages
lib/
  site.ts                 brand, contact, navigation
  services-data.ts        the 4 service pillars   ← from the client's xlsx
  hire-data.ts            the 6 offshore roles    ← from the client's xlsx
  content.ts              drafted copy + stats + FAQs + security controls
  supabase/               browser + server clients, types
middleware.ts             session refresh + /admin guard
```

### Where content lives

Service and role content is transcribed from **`TaxElixir Services.xlsx`** into
`lib/services-data.ts` and `lib/hire-data.ts`. Those two files are the source of
truth — edit them, not the page components. Everything renders from the data, so
a page cannot exist without being in the sitemap and cannot drift from the nav.

---

## Design system

Colours were sampled from `logo.jpeg` by pixel clustering rather than estimated:

| Token | Hex | HSL | Where in the logo |
|---|---|---|---|
| `--navy` | `#0C2748` | `hsl(213 71% 16%)` | Wordmark, shield outline, "TE" monogram |
| `--navy-deep` | `#002448` | `hsl(210 100% 14%)` | Core of the letterforms |
| `--gold-light` | `#D8B460` | `hsl(42 61% 61%)` | Top of the shield gradient |
| `--gold` | `#CBA85A` | `hsl(43 51% 58%)` | Shield centre |
| `--gold-dark` | `#C0A854` | `hsl(47 46% 54%)` | Bottom of the shield gradient |

The shield is a vertical gradient, reproduced as `--gradient-gold`. Type pairing
is **Playfair Display** (matching the logo's transitional serif wordmark) for
headings and **Inter** for body, mirroring the logo's serif/sans split.

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

/**
 * Marketing content that is NOT in the client's services deck.
 *
 * Everything below is client-confirmed. It previously carried `needsClient`
 * flags rendered as visible dev-only markers; those are gone now that the
 * client has signed the content off. Nothing here fabricates a statistic — an
 * unset figure still renders an em dash rather than a zero.
 *
 * Headline figures live in ONE place on purpose. unisonglobus.com states
 * "350+ clients globally" on its US homepage and "500+ satisfied UK clients"
 * on its UK homepage — more clients in one country than in the world — because
 * the numbers were hard-coded per page. These are read from here, and at
 * runtime from the `site_settings` table the admin panel edits.
 */

export type Stat = { key: string; value: string | null; suffix?: string; label: string };

/**
 * The four highlighted figures, specified by the client (Website Updates sheet,
 * row 8): three-level review, licensed-CPA-led, 100% onsite operation, and
 * round-the-clock software utilisation from offshore timings.
 *
 * These describe how we operate, so unlike a client count they are ours to
 * state — no `needsClient` flag. They are still driven through `site_settings`
 * so the admin can correct one without a deploy; migration 0005 replaces the
 * old volume-counter rows with these keys.
 *
 * Two are genuine counters and animate; "CPA-Led" is a non-numeric highlight
 * that Stats echoes verbatim. Nothing here is a volume claim we cannot evidence.
 */
export const stats: Stat[] = [
  { key: "review_levels", value: "3", suffix: "-Level", label: "Review. Checked three times before your reviewer sees it." },
  { key: "cpa_led", value: "CPA-Led", label: "A licensed CPA signs off on delivery standards." },
  { key: "onsite_secure", value: "100", suffix: "%", label: "Onsite. Work stays inside our Ahmedabad facility, nothing subcontracted further." },
  { key: "software_hours", value: "24", suffix: " Hour", label: "Coverage. Your software stays active around the clock." },
];

/**
 * Section 5 of the client's website content document ("Why Firms Work With
 * Us"). Their copy, in their order — the previous seven drafted cards are gone
 * rather than merged, because a half-replaced section is how two voices end up
 * on one page.
 *
 * The lead card still carries the client's own framing (Website Updates sheet,
 * rows 7 and 12): the sale is not cheaper preparation, it is partner hours
 * moved off compliance work and onto advisory.
 */
export const whyUs = [
  {
    title: "Built Around Your Review Process",
    body: "Outsourcing only works when it fits your review steps, deadlines and client relationships. Our model is built to support the way your firm already works.",
  },
  {
    title: "More Strategy, Less Compliance",
    body: "We take on preparation and routine testing so partners and seniors can focus on planning, advisory work and client conversations.",
  },
  {
    title: "Customised Processes",
    body: "Workflows follow your review standards, file structure and engagement patterns instead of forcing you into a fixed template.",
  },
  {
    title: "System Compatibility",
    body: "We work in your tax, audit and accounting systems plus your document management and workpaper templates. Nothing new for your team to learn.",
  },
  {
    title: "Cost Efficiency",
    body: "You add offshore support at a lower cost than a fully loaded US hire, without recruiting cycles, training or bench pay in the off-season.",
  },
  {
    title: "Dedicated Resources",
    body: "You work with named people who know your files and expectations, not a rotating support queue.",
  },
  {
    title: "Data Security",
    body: "Access is limited to what each role needs, data moves through secure channels, and everyone assigned to your work signs a confidentiality commitment.",
  },
  {
    title: "Time Zone Advantage",
    body: "Work sent at the end of your business day is handled overnight offshore and ready for you the next morning.",
  },
];

/**
 * Section 6 of the client's content document ("How We Work").
 *
 * Note that step 04 changed: it was "Pilot Batch" and is now "Ongoing
 * Communication". The pilot has not disappeared from the pitch — the section
 * intro still promises nothing scales until you have reviewed one — but it is
 * no longer a numbered stage of its own.
 */
export const workflow = [
  {
    step: "01",
    title: "Discovery Call",
    body: "We learn your workflow, your standards and whether this is a fit.",
  },
  {
    step: "02",
    title: "Scope & Engagement Letter",
    body: "Services, volumes, turnaround and terms agreed upon before data moves.",
  },
  {
    step: "03",
    title: "Secure Access Setup",
    body: "Access provisioned under your controls. Least privilege, always.",
  },
  {
    step: "04",
    title: "Ongoing Communication",
    body: "Regular check-ins, status updates and a clear escalation path from day one.",
  },
  {
    step: "05",
    title: "Steady-State Delivery",
    body: "Set cadence, named contact, tracked turnaround, self-review built in.",
  },
];

/**
 * The controls a US CPA firm's due-diligence questionnaire will ask about.
 *
 * These each carried a `needsClient` flag until the client confirmed the full
 * set as in place. They are published as statements of fact now, so if any one
 * of them stops being true it has to come out of this array — a prospect's
 * security team will ask us to evidence these individually.
 */
export const securityControls = [
  { title: "Least-privilege access", body: "Role-based access to client data, provisioned per engagement and revoked on completion." },
  { title: "Controlled workstations", body: "Centrally managed workstations with external storage devices disabled." },
  { title: "Secured facility", body: "Access-controlled office floor; no client work performed from home." },
  { title: "Encrypted transfer", body: "Client data moves only over encrypted channels and approved portals." },
  { title: "Confidentiality agreements", body: "Signed NDAs covering the firm and every individual assigned to your engagements." },
  { title: "Restricted printing & egress", body: "Printing restricted and outbound channels controlled on work networks." },
  { title: "Monitored networks", body: "Firewalled, segmented networks with browsing restrictions on delivery floors." },
  { title: "Backup & continuity", body: "Automated backup with documented recovery procedures." },
];

/**
 * The platforms we work in — all client-confirmed. They previously carried a
 * `verified` flag that marked the ones drafted from the services description
 * rather than named in the audit sheet; the client has since confirmed the
 * full list, so the flag and the badge it drove are gone.
 *
 * `slug` is also the logo filename. Drop `<slug>.svg` (or .png/.webp) into
 * public/assets/software/ and the card picks it up on the next build — no code
 * change. Anything without a file renders as a wordmark card instead, so the
 * row is never half-empty. See lib/software-logos.ts.
 */
export const software = [
  { name: "CCH Axcess", slug: "cch-axcess" },
  { name: "CaseWare", slug: "caseware" },
  { name: "QuickBooks", slug: "quickbooks" },
  { name: "Xero", slug: "xero" },
  { name: "UltraTax CS", slug: "ultratax-cs" },
  { name: "Lacerte", slug: "lacerte" },
  { name: "Drake Tax", slug: "drake-tax" },
  { name: "ProConnect", slug: "proconnect" },
  { name: "Sage", slug: "sage" },
  { name: "NetSuite", slug: "netsuite" },
];

/**
 * The first six are section 10 of the client's content document, in their
 * wording. The homepage shows exactly these six (`faqs.slice(0, 6)`); /faqs
 * shows the full list, so the two entries below them are additional rather
 * than contradictory.
 *
 * One deliberate loss to note: the old "which returns" answer listed the
 * cross-border forms by number — 5471, 5472, FBAR/FinCEN 114, 1116/1118. The
 * client's replacement does not, and those form numbers are exactly the long-
 * tail queries a firm with expat clients searches for. They are still on
 * /services/tax, but this page no longer ranks for them.
 */
export const faqs: { q: string; a: string }[] = [
  {
    q: "Are you a CPA firm?",
    a: "No. TaxElixir is an outsourcing partner that serves CPA firms, EA practices and accounting teams. We prepare, organise and support. Your firm reviews, signs and issues every return and opinion.",
  },
  {
    q: "What US returns do you support?",
    a: "We support individual, partnership, S corporation, C corporation and nonprofit returns along with related calculations and schedules. We also assist with multi-year cleanups when several periods are outstanding.",
  },
  {
    q: "Do we have to move to your software?",
    a: "No. We work in the tax, audit and accounting applications and document management systems your firm already uses. Your staff keep their current workflows.",
  },
  {
    q: "How do you support audit work?",
    a: "We assist your team with workpapers, testing and documentation on audit and review engagements. Independence, risk assessment, conclusions and signing remain with your firm.",
  },
  {
    q: "Can we start with a small trial?",
    a: "Yes. We recommend starting with a defined pilot so you can see how our work lines up with your standards before committing larger volumes.",
  },
  {
    q: "How is data handled and protected?",
    a: "Access is defined by engagement, data moves through secure channels and everyone assigned to your work signs a confidentiality agreement. We can walk through our approach as part of your vendor review.",
  },
  {
    q: "What engagement models do you offer?",
    a: "Dedicated full-time resources, part-time or seasonal capacity, and per-project engagements such as back year filings or a defined batch of returns. Most firms start with one dedicated person or a pilot batch and scale from there.",
  },
  {
    q: "Who owns the client relationship?",
    a: "You do, without qualification. We work behind your firm's brand, we do not contact your clients directly unless you explicitly ask us to, and we do not offer services to end taxpayers.",
  },
];

/**
 * Client success proof points — the client's own figures (Website Updates
 * sheet, rows 10 and 17).
 *
 * One array, two consumers: the rotating hero slides and the Client Success
 * Stories block on /about. They were specified as the same three claims, so they
 * read from the same place and cannot drift apart.
 *
 * `image` is the full-bleed photograph behind each hero slide. All three are
 * composed the same way — subject in the right 40%, the left half deliberately
 * dark and empty — because the hero's navy scrim sits at 86–94% over the copy
 * column. A replacement dropped in here must hold that composition or the
 * headline will land on top of a subject. Still nullable: the hero falls back
 * to the brand's patterned surface if a path is ever cleared.
 *
 * `label` is the slide's own name. It titles the slide in the hero (Anchor-style
 * gold rule + eyebrow) and names it for the carousel dots; /about ignores it.
 */
export type SuccessProof = {
  key: string;
  label: string;
  value: string;
  headline: string;
  body: string;
  image: string | null;
};

export const successProof: SuccessProof[] = [
  {
    key: "cost",
    label: "Cost Efficiency",
    value: "55–75%",
    headline: "Lower cost per engagement",
    body: "Offshore delivery at a fraction of the fully loaded cost of a US hire, without the recruitment cycle or the off-season payroll.",
    image: "/assets/hero/hero-cost.webp",
  },
  {
    key: "turnaround",
    label: "Turnaround",
    value: "48 hrs",
    headline: "Turnaround on prepared work",
    body: "Files handed over at the end of your day come back review-ready inside two working days, with the self-review already done.",
    image: "/assets/hero/hero-turnaround.webp",
  },
  {
    key: "capacity",
    label: "Peak-Season Capacity",
    value: "Peak-Season",
    headline: "Capacity to scale into",
    body: "Go from one dedicated preparer to a full seasonal team and back again, sized to your filing calendar rather than your headcount.",
    image: "/assets/hero/hero-capacity.webp",
  },
];

/**
 * Homepage social proof. CLIENT TO SUPPLY — no testimonials were provided.
 * The carousel in components/sections/Testimonials.tsx is built and renders as
 * soon as this array has entries. Each needs a real name and a real firm; an
 * anonymous quote persuades nobody in this market.
 */
export const testimonials: { quote: string; name: string; firm: string }[] = [];

/**
 * Leadership & expertise claims — section 8 of the client's content document.
 *
 * Three of these previously carried `needsClient: true`, because they are
 * exactly the claims a prospect checks on LinkedIn before a first call and
 * being caught overstating one ends the conversation. The flags are gone now
 * that the client's own content document asserts all four in their own words —
 * that is the confirmation the flag was waiting for. If any of them is in fact
 * aspirational, it needs to come back out; see the note raised on handover.
 *
 * The Big 4 claim was withdrawn by the client (Website Updates sheet, row 9)
 * and replaced with global experience — which the About page already evidences
 * through the founder's Middle East industry exposure.
 */
export const leadership = [
  {
    title: "Global Experience",
    body: "Engagement leads who have worked across industries and markets.",
  },
  {
    title: "US GAAP & IRS Knowledge",
    body: "Day-to-day fluency in US filing rules, not general accounting applied to them.",
  },
  {
    title: "US Time Zone Contact",
    body: "A senior contact in your hours. No overnight handovers.",
  },
  {
    title: "Qualified Team",
    body: "Chartered Accountants, CPAs and Enrolled Agents assigned by engagement type.",
  },
];

/**
 * Named leadership profiles for /about.
 *
 * These were two hand-written cards of near-identical markup until the client
 * supplied the second one; they are data now so a third does not mean a third
 * copy of the same eighty lines.
 *
 * Both names and both titles are client-confirmed. If a future profile arrives
 * without a name, add it here only once the name does — a leadership profile is
 * the last place on a site to carry a guess.
 */
export type LeaderProfile = {
  key: string;
  name: string;
  title: string;
  /**
   * Qualifications, shown beside the title on the same gold line. Separate from
   * `title` because the title is the role: one changes on promotion, the other
   * on passing an exam. Only ever what the client has confirmed — a licence
   * claimed on a leadership card is the first thing a prospect verifies.
   */
  credentials?: string;
  image: string;
  /** Both portraits are square at source, so object-cover crops nothing. */
  imageSize: number;
  bio: string[];
  /** Optional pull-out. Rendered as a statement, never as a quotation. */
  statement?: string;
  /** Optional closing personal note. */
  personal?: string;
};

export const leaderProfiles: LeaderProfile[] = [
  {
    key: "founder",
    name: "Dhara Jain",
    title: "Founder",
    credentials: "US CPA · MBA Finance",
    image: "/assets/team/Owner.jpeg",
    imageSize: 1254,
    bio: [
      "Dhara Jain is a seasoned finance and accounting professional with over 20 years of experience and unparalleled expertise in delivering accurate and timely financial information. Dhara is committed to her values of accountability, financial data accuracy and continued professional growth. Her professional journey began in 2003 as an MBA Finance professional, solving complex accounts receivable challenges and handling responsibilities with diligence and precision.",
      "Over the years, Dhara has gained valuable industry exposure in the Middle East, which enriched her global perspective and strengthened her adaptability in diverse business environments. She advanced her expertise by completing her CPA certification and obtaining her license, showing her dedication to lifelong learning and professional excellence.",
      "She has also remained actively engaged in emerging developments such as AI and automation, and has contributed knowledge of R&D tax credit calculation as a member of an AI and Automation Committee within her previous organisation.",
    ],
    statement:
      "Her working approach is guided by the belief that accuracy and speed are essential to delivering timely, compliant and high-quality results.",
    personal:
      "Apart from her professional commitments, Dhara enjoys swimming, playing tennis and trekking. She believes that an active lifestyle helps sustain energy, focus and overall momentum in life.",
  },
  {
    key: "co-founder",
    name: "Chetan Jain",
    title: "Co-Founder",
    image: "/assets/team/co-founder.webp",
    imageSize: 1254,
    bio: [
      "With over three decades of executive leadership across Sales, Marketing, Operations, HR, and Administration, Chetan has built high-performing organizations from the ground up — and now brings that same rigor to helping US firms scale with confidence.",
      "As Founding Sales & Marketing Head, he led three major greenfield ventures between 2011 and 2017. At Nippon Paints India, he built the organization end-to-end — recruiting teams, setting up manufacturing facilities, and driving product development. He then launched the Dulux brand across the UAE, Bahrain, Qatar, and Kuwait, securing all government approvals and production certifications in Dubai and Oman, and establishing the brand in just 2.5 years. He later introduced and scaled the Ultra Italia PU wood-coating brand for the Jubilant Group.",
      "His career includes senior roles with global market leaders — Philips, Berger Paints, ICI (UK), Nippon Paints (Asia-Pacific’s No. 1), AkzoNobel (Netherlands), the Jubilant Bhartia Group, and Idea Cellular (Aditya Birla Group) — before founding his own luxury paint-application brand, Paint Pro, which turned profitable in its first year.",
      "This deep, B2B-focused expertise in team building and operational excellence gives him a rare edge: the ability to design offshore teams and processes that US CPA firms can trust to perform at the same standard as their in-house talent.",
    ],
  },
];

/** White-label and referral arrangements — see /partnership. */
export const partnershipModels = [
  {
    title: "White-Label Delivery",
    body: "We work entirely behind your brand. Deliverables carry your templates and your letterhead, and we do not appear to your clients at any point.",
    points: [
      "Your workpaper templates and file naming",
      "No TaxElixir branding on any deliverable",
      "We never contact your clients directly",
    ],
  },
  {
    title: "Referral Partnership",
    body: "For firms that come across work outside their own capacity or specialism and would rather refer it than decline it.",
    points: [
      "Introduce work that does not fit your practice",
      "Agreed commercial terms in writing up front",
      "You stay informed on progress throughout",
    ],
  },
  {
    title: "Capacity Partnership",
    body: "A standing arrangement for firms with predictable seasonal peaks: reserved capacity booked ahead of your busy period.",
    points: [
      "Capacity reserved before the season starts",
      "Agreed volumes and turnaround windows",
      "Scales back down without notice-period cost",
    ],
  },
];

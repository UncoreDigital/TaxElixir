/**
 * Marketing content that is NOT in the client's services deck.
 *
 * Everything below is drafted copy. Items the client must supply or verify are
 * marked `needsClient: true` and rendered with a visible placeholder in dev —
 * see components/Placeholder.tsx. Nothing here fabricates a statistic.
 *
 * Headline figures live in ONE place on purpose. unisonglobus.com states
 * "350+ clients globally" on its US homepage and "500+ satisfied UK clients"
 * on its UK homepage — more clients in one country than in the world — because
 * the numbers were hard-coded per page. These are read from here, and at
 * runtime from the `site_settings` table the admin panel edits.
 */

export type Stat = { key: string; value: string | null; suffix?: string; label: string; needsClient?: boolean };

/**
 * CLIENT TO SUPPLY — every value below is null until the client confirms it.
 * The Stats component renders a labelled placeholder rather than a zero.
 * (unisonglobus.com renders literal "0 +" for every counter without JS.)
 */
export const stats: Stat[] = [
  { key: "years", value: null, suffix: "+", label: "Years Serving US CPA Firms", needsClient: true },
  { key: "professionals", value: null, suffix: "+", label: "Accounting & Tax Professionals", needsClient: true },
  { key: "firms", value: null, suffix: "+", label: "CPA Firms Supported", needsClient: true },
  { key: "returns", value: null, suffix: "+", label: "Returns Prepared Annually", needsClient: true },
];

export const whyUs = [
  {
    title: "Built Only for CPA Firms",
    body: "We do not serve end taxpayers and we do not compete with you for your clients. Every process we run is designed around a CPA firm's review standards, engagement letters and deadlines.",
  },
  {
    title: "Review-Ready, Not Just Finished",
    body: "Work is delivered with supporting documentation and a completed self-review, so your reviewer's first pass is a review — not a repair job.",
  },
  {
    title: "We Work In Your Systems",
    body: "Your tax software, your document management, your workpaper templates, your naming conventions. Nothing to migrate and nothing new for your staff to learn.",
  },
  {
    title: "Capacity That Flexes",
    body: "Scale from a single dedicated preparer to a full seasonal team and back again, without recruitment cycles, notice periods or idle payroll in the off-season.",
  },
  {
    title: "A Named Point of Contact",
    body: "You get a specific person who knows your engagements, not a ticket queue. Escalation paths and response expectations are agreed before work starts.",
  },
  {
    title: "Time-Zone Advantage",
    body: "Work handed over at the end of your day comes back before the start of your next one, which turns an overnight gap into an extra working shift during peak season.",
  },
];

export const workflow = [
  {
    step: "01",
    title: "Discovery Call",
    body: "We establish what work you want to move, what your review standards look like, and whether we are genuinely the right fit. If we are not, we will say so.",
  },
  {
    step: "02",
    title: "Scope & Engagement Letter",
    body: "A written scope covering services, volumes, turnaround expectations, escalation path and commercial terms — agreed before any client data moves.",
  },
  {
    step: "03",
    title: "Secure Access Setup",
    body: "Access is provisioned to your systems under your firm's controls, on a least-privilege basis. Where you prefer, we work entirely inside your environment.",
  },
  {
    step: "04",
    title: "Pilot Batch",
    body: "We run an agreed first batch so you can inspect our output quality against your standards, and we can calibrate to your templates, before volume ramps.",
  },
  {
    step: "05",
    title: "Steady-State Delivery",
    body: "Agreed cadence, a named point of contact, tracked turnaround, and a structured self-review completed before anything reaches your reviewer.",
  },
];

/**
 * CLIENT TO CONFIRM — these are the controls a US CPA firm's due-diligence
 * questionnaire will ask about. Each one must be verified as actually in place
 * before the Security page goes live. Do not publish unverified claims.
 */
export const securityControls = [
  { title: "Least-privilege access", body: "Role-based access to client data, provisioned per engagement and revoked on completion.", needsClient: true },
  { title: "Controlled workstations", body: "Centrally managed workstations with external storage devices disabled.", needsClient: true },
  { title: "Secured facility", body: "Access-controlled office floor; no client work performed from home.", needsClient: true },
  { title: "Encrypted transfer", body: "Client data moves only over encrypted channels and approved portals.", needsClient: true },
  { title: "Confidentiality agreements", body: "Signed NDAs covering the firm and every individual assigned to your engagements.", needsClient: true },
  { title: "Restricted printing & egress", body: "Printing restricted and outbound channels controlled on work networks.", needsClient: true },
  { title: "Monitored networks", body: "Firewalled, segmented networks with browsing restrictions on delivery floors.", needsClient: true },
  { title: "Backup & continuity", body: "Automated backup with documented recovery procedures.", needsClient: true },
];

/**
 * CLIENT TO CONFIRM which of these TaxElixir actually holds a licence or
 * competency in. The audit sheet names CCH and CaseWare explicitly; the rest
 * are drafted from the services described and must be verified.
 */
export const software = [
  { name: "CCH Axcess", verified: true },
  { name: "CaseWare", verified: true },
  { name: "QuickBooks", verified: false },
  { name: "Xero", verified: false },
  { name: "UltraTax CS", verified: false },
  { name: "Lacerte", verified: false },
  { name: "Drake Tax", verified: false },
  { name: "ProConnect", verified: false },
  { name: "Sage", verified: false },
  { name: "NetSuite", verified: false },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Is TaxElixir a CPA firm?",
    a: "No. TaxElixir is not a CPA Firm. We are a professional outsourcing partner exclusively serving US CPA Firms. We prepare, document and support — your firm reviews, signs and issues every opinion and return. We never hold ourselves out as licensed practitioners and we do not serve end taxpayers directly.",
  },
  {
    q: "Which returns do you prepare?",
    a: "Individual (1040), expatriate (1040), non-resident individual (1040NR), partnership (1065), S corporation (1120-S), C corporation (1120) and non-profit (990) returns, along with tax calculation, validation, liability calculation and back year filings.",
  },
  {
    q: "Do we have to change our software?",
    a: "No. We work inside the systems your firm already uses — your tax software, document management and workpaper templates — so there is nothing to migrate and nothing new for your staff to learn.",
  },
  {
    q: "How does audit support work if you are not a CPA firm?",
    a: "We support your engagement team: preparing and organising workpapers, executing substantive testing and analytical procedures, and evaluating internal controls under GAAP and GAAS. Independence, judgement, review and the audit opinion remain entirely with your firm. We never issue an opinion.",
  },
  {
    q: "Can we start with a small pilot?",
    a: "Yes, and we recommend it. A pilot batch lets you inspect our output against your review standards and lets us calibrate to your templates before any volume commitment.",
  },
  {
    q: "How do you handle client data security?",
    a: "Access is least-privilege and engagement-scoped, data moves only over encrypted channels, and every individual assigned to your work is covered by a signed confidentiality agreement. Our Security & Compliance page sets out the full control set, and we are happy to complete your firm's vendor due-diligence questionnaire.",
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
 * Homepage social proof. CLIENT TO SUPPLY — no testimonials were provided.
 * The carousel in components/sections/Testimonials.tsx is built and renders as
 * soon as this array has entries. Each needs a real name and a real firm; an
 * anonymous quote persuades nobody in this market.
 */
export const testimonials: { quote: string; name: string; firm: string }[] = [];

/**
 * Leadership & expertise claims.
 *
 * Every item is `needsClient: true` on purpose. These are precisely the claims
 * a prospect checks on LinkedIn before a first call — "Big 4-trained" and
 * "US-based leadership" are verifiable, and being caught overstating either
 * ends the conversation. Confirm each, then flip the flag.
 */
export const leadership = [
  {
    title: "Big 4-trained leadership",
    body: "Engagement leads whose training came from Big 4 audit and tax practices, so your reviewers are talking to people who already know your standards.",
    needsClient: true,
  },
  {
    title: "US GAAP and IRS fluency",
    body: "Day-to-day familiarity with the filing calendar, entity types and disclosure requirements your firm works to — not a general accounting background applied to US rules.",
    needsClient: true,
  },
  {
    title: "US-based point of contact",
    body: "A senior contact in your time zone who owns the relationship, so escalation does not wait for an overnight handover.",
    needsClient: true,
  },
  {
    title: "Qualified delivery team",
    body: "Chartered Accountants, CPAs and Enrolled Agents across the delivery floor, assigned by engagement type rather than by whoever is free.",
    needsClient: true,
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
    body: "A standing arrangement for firms with predictable seasonal peaks — reserved capacity booked ahead of your busy period.",
    points: [
      "Capacity reserved before the season starts",
      "Agreed volumes and turnaround windows",
      "Scales back down without notice-period cost",
    ],
  },
];

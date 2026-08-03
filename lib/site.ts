/**
 * Single source of truth for brand, contact and navigation.
 *
 * Brand name is one token on purpose: the logo reads "TaxElixir" while the
 * client's services deck writes "TaxEliXir". Confirmed as the logo spelling —
 * if that ever changes it changes here and nowhere else.
 */

export const site = {
  name: "TaxElixir",
  legalName: "TaxElixir",
  tagline: "Where Trust Meets CPA Excellence",
  description:
    "TaxElixir is an India-based offshore outsourcing partner for US CPA firms — tax preparation, accounting, audit support and dedicated offshore staffing that scales your capacity without adding headcount.",
  /**
   * Canonical origin. Env-driven so preview and staging deploys emit their own
   * canonical tags — a preview that canonicalises to production can get itself
   * dropped from the index in production's favour.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.taxelixir.com").replace(/\/$/, ""),
  logo: "/assets/logo.jpeg",
  /**
   * The header lockup. A cleaner 3010x804 render of the same artwork as
   * logo.jpeg — same shield, same wordmark, same tagline — so it drops in at
   * the old aspect ratio (3.744 vs 3.747) with no reflow. Still a near-white
   * field, so it belongs on white surfaces only; the navy footer and the admin
   * sidebar keep the live-text Logo component.
   */
  headerLogo: "/assets/header-logo.png",
  headerLogoWidth: 3010,
  headerLogoHeight: 804,
  email: "info@taxelixir.com",
  emailHref: "mailto:info@taxelixir.com",

  /* CLIENT TO CONFIRM — no phone number was supplied in the services deck. */
  phone: null as string | null,
  phoneHref: null as string | null,

  /* CLIENT TO CONFIRM — office address not supplied. */
  address: null as string | null,

  linkedin: null as string | null,

  /**
   * Required on audit pages and in the footer. Taken verbatim from the client's
   * own services deck — it is a positioning statement AND a liability boundary.
   * Do not soften this and do not let copy elsewhere imply otherwise.
   */
  disclaimer:
    "TaxElixir is not a CPA Firm. We are a professional outsourcing partner exclusively serving US CPA Firms.",
} as const;

/**
 * Feature switches for work that is built but not being shown yet.
 *
 * `clientPortal` covers the whole secure-document-exchange path in one flag:
 * the "Client Portal" button in the top bar, the footer link, the contact-page
 * card, the public /upload page, and — on the admin side — the "Document
 * Uploads" nav item, the dashboard tile and /admin/uploads.
 *
 * Off means genuinely unreachable, not merely unlinked: both routes 404 while
 * the flag is false, so there is no URL to guess. Nothing is deleted — the
 * forms, the storage bucket, the tables and the rows all stay put. Flip this
 * to true and the entire feature comes back exactly as it was.
 */
export const features = {
  clientPortal: false,
} as const;

export type NavItem = {
  name: string;
  href: string;
  dropdown?: { name: string; href: string; blurb?: string }[];
};

export const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Services",
    href: "/services",
    dropdown: [
      { name: "Tax Preparation", href: "/services/tax", blurb: "1040, 1065, 1120, 1120-S, 990 and expat returns" },
      { name: "Back Year Tax Services", href: "/services/back-year-tax", blurb: "Bring delinquent filings current" },
      { name: "Accounting & CAAS", href: "/services/accounting", blurb: "AP/AR, month-end close, advisory reporting" },
      { name: "Bookkeeping", href: "/services/bookkeeping", blurb: "Daily transactions, reconciliations, clean books" },
      { name: "Payroll Services", href: "/services/payroll", blurb: "Processing, multi-state compliance, reporting" },
      { name: "Sales Tax Services", href: "/services/sales-tax", blurb: "Multi-state returns, reconciliation, calendars" },
      { name: "Filing 1099 & Issue Forms", href: "/services/filing-1099", blurb: "1099-NEC and MISC, TIN matching, e-filing" },
      { name: "Management Consultation", href: "/services/management-consultation", blurb: "Forecasting, break-even, cash flow modelling" },
      { name: "Audit Support", href: "/services/audit", blurb: "Workpapers, procedures, compilations, reviews" },
    ],
  },
  {
    name: "Hire Offshore Staff",
    href: "/hire",
    dropdown: [
      { name: "Offshore Accountant", href: "/hire/offshore-accountant" },
      { name: "Offshore Tax Preparer", href: "/hire/offshore-tax-preparer" },
      { name: "Offshore Bookkeeper", href: "/hire/offshore-bookkeeper" },
      { name: "Offshore Payroll Expert", href: "/hire/offshore-payroll-expert" },
      { name: "Offshore Back Year Tax Preparer", href: "/hire/offshore-back-year-tax-preparer" },
      { name: "Offshore Audit Support", href: "/hire/offshore-audit-support" },
    ],
  },
  {
    name: "Firm",
    href: "/about",
    dropdown: [
      { name: "About TaxElixir", href: "/about" },
      { name: "How We Work", href: "/how-we-work" },
      { name: "Security & Compliance", href: "/security" },
      { name: "Software We Work In", href: "/software" },
      { name: "FAQs", href: "/faqs" },
    ],
  },
  {
    name: "Resources",
    href: "/blog",
    dropdown: [
      { name: "Insights", href: "/blog", blurb: "Writing for CPA firm owners" },
      { name: "Case Studies", href: "/case-studies", blurb: "How firms use us in practice" },
      { name: "Events & Webinars", href: "/events", blurb: "Sessions we are running or speaking at" },
      { name: "Guides & Ebooks", href: "/guides", blurb: "Free downloads for firm owners" },
      { name: "Partnership", href: "/partnership", blurb: "White-label and referral arrangements" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

/** Footer column layout — every link here must resolve to a real page. */
export const footerNav = [
  {
    heading: "Services",
    links: [
      { name: "Tax Preparation", href: "/services/tax" },
      { name: "Back Year Tax Services", href: "/services/back-year-tax" },
      { name: "Accounting & CAAS", href: "/services/accounting" },
      { name: "Bookkeeping", href: "/services/bookkeeping" },
      { name: "Payroll Services", href: "/services/payroll" },
      { name: "Sales Tax Services", href: "/services/sales-tax" },
      { name: "Filing 1099 & Issue Forms", href: "/services/filing-1099" },
      { name: "Management Consultation", href: "/services/management-consultation" },
      { name: "Audit Support", href: "/services/audit" },
    ],
  },
  {
    heading: "Hire Offshore Staff",
    links: [
      { name: "Offshore Accountant", href: "/hire/offshore-accountant" },
      { name: "Offshore Tax Preparer", href: "/hire/offshore-tax-preparer" },
      { name: "Offshore Bookkeeper", href: "/hire/offshore-bookkeeper" },
      { name: "Offshore Payroll Expert", href: "/hire/offshore-payroll-expert" },
      { name: "Back Year Tax Preparer", href: "/hire/offshore-back-year-tax-preparer" },
      { name: "Offshore Audit Support", href: "/hire/offshore-audit-support" },
    ],
  },
  {
    heading: "Firm",
    links: [
      { name: "About Us", href: "/about" },
      { name: "How We Work", href: "/how-we-work" },
      { name: "Security & Compliance", href: "/security" },
      { name: "Software", href: "/software" },
      { name: "FAQs", href: "/faqs" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { name: "Insights", href: "/blog" },
      { name: "Case Studies", href: "/case-studies" },
      { name: "Events & Webinars", href: "/events" },
      { name: "Guides & Ebooks", href: "/guides" },
      { name: "Partnership", href: "/partnership" },
    ],
  },
  {
    heading: "Company",
    links: [
      // Secure upload is parked behind features.clientPortal — the route 404s
      // while it is off, so the link must not be rendered.
      ...(features.clientPortal ? [{ name: "Send Documents", href: "/upload" }] : []),
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

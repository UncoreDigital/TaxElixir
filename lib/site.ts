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
  url: "https://www.taxelixir.com",
  logo: "/assets/logo.jpeg",
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
      { name: "Accounting & Bookkeeping", href: "/services/accounting", blurb: "Bookkeeping, AP/AR, close and CAAS" },
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
  { name: "Insights", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

/** Footer column layout — every link here must resolve to a real page. */
export const footerNav = [
  {
    heading: "Services",
    links: [
      { name: "Tax Preparation", href: "/services/tax" },
      { name: "Back Year Tax Services", href: "/services/back-year-tax" },
      { name: "Accounting & Bookkeeping", href: "/services/accounting" },
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
    heading: "Company",
    links: [
      { name: "Insights", href: "/blog" },
      { name: "Send Documents", href: "/upload" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

/**
 * Service content — transcribed from the client's "TaxElixir Services.xlsx"
 * (sheets: Tax Services, Accounting Services, Audit Services, Offshore Staffing).
 *
 * Everything in `groups`, `process` and `deliver` fields is the client's own
 * wording. Intro/teaser prose is drafted copy and marked in the content-gap
 * list for client review. Nothing here invents a statistic.
 */

export type ServiceGroup = { title: string; items: string[] };
export type ProcessStep = { step: string; title: string; body: string; outcome: string };

export type Service = {
  slug: string;
  number: string;
  title: string;
  navTitle: string;
  /** <title> tag */
  metaTitle: string;
  metaDescription: string;
  /** H1 — exactly one per page */
  h1: string;
  teaser: string;
  intro: string;
  icon: string;
  groups: ServiceGroup[];
  /** Optional deeper table, used by Audit */
  deliver?: { name: string; body: string }[];
  process?: ProcessStep[];
  note?: string;
  /** Roles on /hire that pair with this service */
  relatedRoles: string[];
};

export const services: Service[] = [
  {
    slug: "tax",
    number: "01",
    title: "Tax Preparation",
    navTitle: "Tax Preparation",
    metaTitle: "Outsourced Tax Preparation for US CPA Firms",
    metaDescription:
      "Offshore tax preparation for US CPA firms — 1040, 1040NR, expat, 1065, 1120, 1120-S and 990 returns, prepared review-ready inside your own software and workflow.",
    h1: "Tax Preparation Built for US CPA Firms",
    teaser:
      "Individual, expat, non-resident, partnership, corporate and non-profit returns — prepared review-ready inside your software, on your workpaper standards.",
    intro:
      "Busy season does not scale by working longer hours. TaxElixir prepares returns as a direct extension of your team — we log into your systems, follow your engagement standards, and hand back returns that are ready for your reviewer, not ready for rework. Preparation, validation, liability calculation and record digitisation are handled as one workflow, so nothing arrives at your desk half-finished.",
    icon: "FileText",
    groups: [
      {
        title: "Individual & Expat Returns",
        items: [
          "Individuals (1040)",
          "Expatriates (1040)",
          "Non-Resident Individuals (1040NR)",
          "Non-Profit Entities (990)",
        ],
      },
      {
        title: "Business Entity Returns",
        items: ["Partnerships (1065)", "S Corporations (1120-S)", "C Corporations (1120)"],
      },
      {
        title: "Specialised Services",
        items: [
          "Tax Calculation & Return Preparation",
          "Tax Validation",
          "Liability Calculation",
          "Returns Preparation",
          "Back Year Tax Services",
          "Organization & Digitization of Financial Records",
          "Comprehensive Tax Preparation",
        ],
      },
    ],
    relatedRoles: ["offshore-tax-preparer", "offshore-back-year-tax-preparer"],
  },
  {
    slug: "back-year-tax",
    number: "02",
    title: "Back Year Tax Services",
    navTitle: "Back Year Tax Services",
    metaTitle: "Back Year Tax Return Services for CPA Firms",
    metaDescription:
      "Bring delinquent client filings current. TaxElixir examines, organises, digitises and verifies prior-year records, then prepares every outstanding return to current IRS standards.",
    h1: "Back Year Tax Services — Bringing Delinquent Filings Current",
    teaser:
      "A documented four-stage process that turns years of unfiled paperwork into a clean, verified, filing-ready set of returns.",
    intro:
      "Back year work is the engagement most firms want to help with and least want to staff. It is document-heavy, slow, and hard to quote. TaxElixir runs it as a defined four-stage process — examine, organise and digitise, verify, prepare — so a client who is several years behind ends up with an audit-ready document set and every outstanding return prepared to current IRS standards. Your firm keeps the relationship and the review; we absorb the hours.",
    icon: "Archive",
    groups: [
      {
        title: "What The Engagement Covers",
        items: [
          "Review of all prior-year documents, receipts and filings",
          "Organisation of paper records and digitisation for secure cloud storage",
          "Cross-verification of transactions against bank and source documents",
          "Preparation of all outstanding returns to current IRS standards",
        ],
      },
    ],
    process: [
      {
        step: "01",
        title: "Financial Record Examination",
        body: "Review all prior-year documents, receipts and filings.",
        outcome: "Clear picture of outstanding obligations",
      },
      {
        step: "02",
        title: "Organization & Digitization",
        body: "Organize paper records; digitize for secure cloud storage.",
        outcome: "Clean, audit-ready document set",
      },
      {
        step: "03",
        title: "Transactions Verification",
        body: "Cross-verify transactions against bank and source docs.",
        outcome: "Accurate, IRS-compliant records",
      },
      {
        step: "04",
        title: "Comprehensive Preparation",
        body: "Prepare all outstanding returns to current IRS standards.",
        outcome: "Filing-ready returns delivered",
      },
    ],
    relatedRoles: ["offshore-back-year-tax-preparer", "offshore-tax-preparer"],
  },
  {
    slug: "accounting",
    number: "03",
    title: "Accounting & Bookkeeping",
    navTitle: "Accounting & Bookkeeping",
    metaTitle: "Outsourced Accounting & Bookkeeping for CPA Firms",
    metaDescription:
      "Full-spectrum accounting support beyond tax season — bookkeeping, AP/AR, reconciliations, month-end close, financial reporting and Client Accounting Advisory Services.",
    h1: "Accounting & Bookkeeping Support, Beyond Tax Season",
    teaser:
      "Three connected tracks — everyday bookkeeping, full accounting, and Client Accounting Advisory — delivered on whatever cadence your clients need.",
    intro:
      "Tax season ends; the books do not. TaxElixir covers the year-round accounting function your firm either absorbs internally or turns away — weekly, monthly, quarterly or annual bookkeeping, payables and receivables, reconciliations, and a structured month-end close. For firms building a CAAS practice, the same team delivers the general ledger discipline and periodic reporting that advisory work depends on.",
    icon: "Calculator",
    groups: [
      {
        title: "Accounting Services",
        items: [
          "Bookkeeping (Weekly / Monthly / Quarterly / Annually)",
          "Accounts Payable & Accounts Receivable Management",
          "Budgeting and Forecasting",
          "Break-Even Analysis",
          "Cash Flow Monitoring & Management",
          "General Ledger Maintenance and Control",
          "Financial Statement Preparation & Review",
          "Revenue Reporting and Adjustments",
        ],
      },
      {
        title: "Bookkeeping Services",
        items: [
          "Everyday Bookkeeping",
          "Complete Accounts Payable Management",
          "Adequate Accounts Receivable Management",
          "Bank and Credit Card Reconciliation",
          "Refined Management of Cash Flow",
          "Financial Reporting and Analysis",
        ],
      },
      {
        title: "CAAS — Client Accounting Advisory",
        items: [
          "Month-End Close",
          "General Ledger Postings",
          "Structured Month-End Close",
          "Bank & Balance Sheet Account Reconciliations",
          "Fixed Asset & Inventory Assets Tracker Maintenance",
          "Periodic Financial Statements and Reports",
        ],
      },
    ],
    note: "All services delivered by dedicated offshore professionals integrated with your existing workflow and software.",
    relatedRoles: ["offshore-accountant", "offshore-bookkeeper", "offshore-payroll-expert"],
  },
  {
    slug: "audit",
    number: "04",
    title: "Audit Support",
    navTitle: "Audit Support",
    metaTitle: "Offshore Audit Support for US CPA Firms",
    metaDescription:
      "Offshore audit support across the engagement cycle — workpaper preparation in CCH and CaseWare, substantive testing, internal control evaluation, compilations and reviews under GAAP and GAAS.",
    h1: "Offshore Audit Support Across the Engagement Cycle",
    teaser:
      "Workpapers, substantive testing, internal control evaluation, compilations and reviews — executed to your methodology, under your firm's opinion.",
    intro:
      "TaxElixir empowers CPA firms with offshore audit support combining technical excellence, efficiency, and reliability across every stage of the audit cycle. We prepare and organise documentation, execute procedures and perform analytical review — always as support to your engagement team. The opinion, the judgement and the sign-off remain entirely yours.",
    icon: "ShieldCheck",
    groups: [
      {
        title: "Engagement Types Supported",
        items: [
          "Financial Statement Audit",
          "Compilation Services",
          "Reviewed Financial Statements",
          "Audit Documentation & Workpapers",
          "Audit Procedure Execution",
        ],
      },
    ],
    deliver: [
      {
        name: "Financial Statement Audit",
        body: "Detailed, compliant financial statement reviews customized to your firm's standards",
      },
      {
        name: "Compilation Services",
        body: "Compilation of financial statements from client-provided information without independent verification",
      },
      {
        name: "Reviewed Financial Statements",
        body: "Analytical review procedures providing limited assurance on financial statements",
      },
      {
        name: "Audit Documentation & Workpapers",
        body: "Preparation, review, and organization of audit documentation using CCH, CaseWare, and more",
      },
      {
        name: "Audit Procedure Execution",
        body: "Substantive testing, internal control evaluations and analytical procedures per GAAP & GAAS",
      },
    ],
    relatedRoles: ["offshore-audit-support", "offshore-accountant"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

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
  /**
   * True when the scope on this page is drafted from standard practice rather
   * than transcribed from the client's services deck. These pages render a
   * visible confirmation notice and are listed in the client content-gap doc.
   * Flip to false (or remove) once the client signs off on the scope.
   */
  provisional?: boolean;
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
    title: "Accounting & CAAS",
    navTitle: "Accounting & CAAS",
    metaTitle: "Outsourced Accounting & CAAS for CPA Firms",
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
    relatedRoles: ["offshore-accountant", "offshore-payroll-expert"],
  },
  {
    slug: "bookkeeping",
    number: "04",
    title: "Bookkeeping",
    navTitle: "Bookkeeping",
    metaTitle: "Outsourced Bookkeeping Services for CPA Firms",
    metaDescription:
      "Outsourced bookkeeping for US CPA firms — everyday transaction work, complete AP and AR management, bank and credit card reconciliation, cash flow management and financial reporting.",
    h1: "Bookkeeping That Keeps Your Clients' Books Current",
    teaser:
      "Everyday transaction work, complete AP and AR management, and reconciliations that land on time every month.",
    intro:
      "Bookkeeping is where client relationships quietly break. A month slips, then a quarter, and what should have been a straightforward return becomes a clean-up project billed at the wrong rate. TaxElixir takes the recurring transaction work off your team so the books stay current, the close is predictable, and tax season starts from reconciled records rather than a reconstruction exercise.",
    icon: "BookOpen",
    groups: [
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
    ],
    note: "Delivered on whatever cadence your clients need — weekly, monthly, quarterly or annually — inside the software your firm already uses.",
    relatedRoles: ["offshore-bookkeeper", "offshore-accountant"],
  },
  {
    slug: "payroll",
    number: "05",
    title: "Payroll Services",
    navTitle: "Payroll Services",
    metaTitle: "Outsourced Payroll Services for CPA Firms",
    metaDescription:
      "Outsourced payroll support for US CPA firms — accurate processing, multi-state compliance, and streamlined payroll reporting and documentation, handled by a dedicated offshore specialist.",
    h1: "Payroll Processing and Multi-State Compliance",
    teaser:
      "High-frequency, high-penalty work handled by someone who does only this — so it never competes with billable time.",
    intro:
      "Payroll runs whether or not anyone on your team has capacity for it, and multi-state rules punish approximation with penalties rather than corrections. TaxElixir handles the recurring processing and the compliance detail as a defined engagement, which frees your internal staff for work that genuinely needs your firm's judgement.",
    icon: "Users",
    groups: [
      {
        title: "What We Handle",
        items: [
          "Ensure Accurate Payroll Processing",
          "Navigate Multi-State Compliance Confidently",
          "Streamline Payroll Reporting & Documentation",
          "Free Up Internal Resources for Strategic Growth",
        ],
      },
    ],
    /*
     * The client's services deck lists payroll only as an offshore ROLE
     * ("Offshore Payroll Expert", sheet 4) — it does not describe a payroll
     * service scope. The four items above are that role's own capabilities,
     * verbatim. Do not extend this list with form numbers (940/941/W-2) or
     * filing claims until the client confirms what they actually perform.
     */
    note: "Scope shown is the remit of our Offshore Payroll Expert role. Tell us how your firm currently splits payroll work and we will scope to match.",
    relatedRoles: ["offshore-payroll-expert", "offshore-accountant"],
  },
  {
    slug: "sales-tax",
    number: "06",
    title: "Sales Tax Services",
    navTitle: "Sales Tax Services",
    metaTitle: "Outsourced Sales Tax Services for CPA Firms",
    metaDescription:
      "Multi-state sales tax support for US CPA firms — return preparation, filing calendars, reconciliation to the general ledger, exemption certificate tracking and notice handling.",
    h1: "Multi-State Sales Tax Support",
    teaser:
      "Recurring, deadline-driven filing work across many jurisdictions — the kind that quietly consumes a whole staff member.",
    intro:
      "Sales tax punishes firms twice: the returns are individually small but numerous, and the penalties for missing one are disproportionate to the revenue it represents. TaxElixir absorbs the recurring preparation, reconciliation and calendar management across your clients' jurisdictions so a filing never slips because someone was busy with a return that mattered more.",
    icon: "Receipt",
    provisional: true,
    groups: [
      {
        title: "Return Preparation",
        items: [
          "Monthly, quarterly and annual return preparation",
          "Multi-state and multi-jurisdiction filings",
          "Liability calculation from source data",
          "Filing calendar management by jurisdiction",
        ],
      },
      {
        title: "Reconciliation & Records",
        items: [
          "Reconciliation of returns to the general ledger",
          "Exemption certificate tracking",
          "Prior-period adjustments and amended returns",
          "Supporting workpapers for every filing",
        ],
      },
      {
        title: "Ongoing Support",
        items: [
          "Registration support in new jurisdictions",
          "Notice and correspondence preparation",
          "Nexus data gathering for your review",
          "Audit-ready documentation retention",
        ],
      },
    ],
    note: "Nexus determination and any position taken on taxability remain your firm's call. We prepare, reconcile and document; you review and sign.",
    relatedRoles: ["offshore-accountant", "offshore-bookkeeper"],
  },
  {
    slug: "filing-1099",
    number: "07",
    title: "Filing 1099 & Issue Forms",
    navTitle: "Filing 1099 & Issue Forms",
    metaTitle: "1099 Preparation & Filing for CPA Firms",
    metaDescription:
      "1099 season support for US CPA firms — vendor data collection and validation, TIN matching, 1099-NEC and 1099-MISC preparation, recipient copies, e-filing support and corrections.",
    h1: "1099 Season, Absorbed",
    teaser:
      "A short, brutal window with a hard deadline and high volume — exactly the work that should not sit with your senior staff.",
    intro:
      "1099 season lands in the worst possible month: high volume, a fixed deadline, and work that is tedious rather than technical. TaxElixir handles the vendor data gathering, validation and preparation so your team is not spending late January chasing W-9s instead of starting returns.",
    icon: "FileCheck",
    provisional: true,
    groups: [
      {
        title: "Data Preparation",
        items: [
          "Vendor and contractor data collection",
          "W-9 tracking and follow-up lists",
          "TIN matching and validation checks",
          "Payment data extraction from the accounting system",
        ],
      },
      {
        title: "Forms Prepared",
        items: [
          "1099-NEC — non-employee compensation",
          "1099-MISC — rents, royalties and other income",
          "Recipient copies prepared for distribution",
          "Corrected forms where errors are identified",
        ],
      },
      {
        title: "Filing Support",
        items: [
          "E-filing preparation and submission support",
          "State filing requirements where applicable",
          "Reconciliation to the general ledger",
          "Retained documentation for each recipient",
        ],
      },
    ],
    note: "We prepare, validate and reconcile. Submission under your firm's credentials, and every filing position, stays with you.",
    relatedRoles: ["offshore-accountant", "offshore-bookkeeper"],
  },
  {
    /*
     * Unlike sales-tax and filing-1099, this one is NOT provisional. Every scope
     * item below appears verbatim in the client's services deck (sheet 2,
     * "Accounting Services") — budgeting, break-even, cash flow, financial
     * statement review and revenue reporting are all their own wording. This
     * page reframes work they already described rather than inventing a service.
     */
    slug: "management-consultation",
    number: "08",
    title: "Management Consultation",
    navTitle: "Management Consultation",
    metaTitle: "Management Consultation Support for CPA Firms",
    metaDescription:
      "Advisory-grade analysis your firm can deliver under its own name — budgeting and forecasting, break-even analysis, cash flow modelling and management reporting, prepared offshore.",
    h1: "Advisory Work Your Firm Delivers, Prepared by Us",
    teaser:
      "The modelling and analysis behind advisory engagements — built to your assumptions, presented under your name.",
    intro:
      "Advisory is the work firms most want to sell and least often have the hours to prepare. The analysis underneath it — the forecast, the break-even model, the cash flow projection — is time-consuming to build and rarely billable at advisory rates. TaxElixir prepares that layer so your partners spend their hours on the conversation with the client rather than on the spreadsheet behind it.",
    icon: "TrendingUp",
    groups: [
      {
        title: "Planning & Analysis",
        items: [
          "Budgeting and Forecasting",
          "Break-Even Analysis",
          "Cash Flow Monitoring & Management",
        ],
      },
      {
        title: "Reporting",
        items: [
          "Financial Statement Preparation & Review",
          "Revenue Reporting and Adjustments",
          "Periodic Financial Statements and Reports",
        ],
      },
      {
        title: "Delivered To Your Standards",
        items: [
          "Built to your assumptions and your model conventions",
          "Presented in your templates, under your firm's name",
          "Supporting schedules attached for your review",
        ],
      },
    ],
    note: "Every scope item above is taken from the TaxElixir services schedule. The judgement, the recommendation and the client conversation remain entirely yours.",
    relatedRoles: ["offshore-accountant"],
  },
  {
    slug: "audit",
    number: "09",
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

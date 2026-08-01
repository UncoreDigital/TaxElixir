/**
 * The six offshore roles — transcribed verbatim from sheet 4 ("Offshore
 * Staffing") of the client's services deck. Each role's `capabilities` are the
 * client's own bullets; `intro` and `whoFor` are drafted copy.
 *
 * These six pages are the main long-tail SEO play: unisonglobus.com ships only
 * two "hire" pages, so role-specific landing pages are open ground.
 */

export type Role = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  icon: string;
  teaser: string;
  intro: string;
  capabilities: string[];
  whoFor: string[];
  relatedService: string;
};

export const roles: Role[] = [
  {
    slug: "offshore-accountant",
    title: "Offshore Accountant",
    metaTitle: "Hire an Offshore Accountant for Your CPA Firm",
    metaDescription:
      "Hire a dedicated offshore accountant — end-to-end bookkeeping, custom financial reporting, US tax support and accounts workflow management, integrated with your firm's systems.",
    h1: "Hire a Dedicated Offshore Accountant",
    icon: "Calculator",
    teaser:
      "A full accounting function in one hire — books, reporting, tax support and workflow ownership.",
    intro:
      "An offshore accountant from TaxElixir works your engagements the way an in-house hire would: in your software, on your calendar, reporting to your manager. The difference is that you can add one in weeks rather than months, and scale the arrangement up or down as your client base moves.",
    capabilities: [
      "End-to-End Bookkeeping",
      "Custom Financial Reporting",
      "U.S. Tax Support Services",
      "Accounts Workflow Management",
    ],
    whoFor: [
      "Firms carrying more monthly write-up work than their team can absorb",
      "Practices building a recurring accounting or CAAS offering",
      "Partners spending review time on preparation-level work",
    ],
    relatedService: "accounting",
  },
  {
    slug: "offshore-tax-preparer",
    title: "Offshore Tax Preparer",
    metaTitle: "Hire an Offshore Tax Preparer for Your CPA Firm",
    metaDescription:
      "Hire a dedicated offshore tax preparer — return preparation, tax document review, business data handling and e-filing support for 1040, 1065, 1120 and 1120-S engagements.",
    h1: "Hire a Dedicated Offshore Tax Preparer",
    icon: "FileText",
    teaser:
      "Season capacity that arrives review-ready — preparation, document review and e-filing support.",
    intro:
      "Adding preparation capacity in January is the hardest hire in the profession. An offshore tax preparer gives your firm a trained pair of hands who works inside your tax software, follows your review standards, and takes the volume that would otherwise land on a partner's desk at midnight.",
    capabilities: [
      "Tax Return Preparation",
      "Tax Document Review",
      "Business Data Handling",
      "E-Filing & Submission Support",
    ],
    whoFor: [
      "Firms turning away returns because the season is already full",
      "Practices whose reviewers are preparing rather than reviewing",
      "Teams that need seasonal capacity without a seasonal payroll",
    ],
    relatedService: "tax",
  },
  {
    slug: "offshore-bookkeeper",
    title: "Offshore Bookkeeper",
    metaTitle: "Hire an Offshore Bookkeeper for Your CPA Firm",
    metaDescription:
      "Hire a dedicated offshore bookkeeper — daily transaction management, bank and credit card reconciliations, AP/AR tracking and monthly closing support.",
    h1: "Hire a Dedicated Offshore Bookkeeper",
    icon: "BookOpen",
    teaser:
      "Daily transaction discipline, clean reconciliations and a close that lands on time every month.",
    intro:
      "Bookkeeping is where client relationships quietly break — a month falls behind, then a quarter, and suddenly the tax return is a clean-up project. A dedicated offshore bookkeeper keeps the transaction work current so your close is predictable and your tax team starts from clean books.",
    capabilities: [
      "Daily Transaction Management",
      "Bank & Credit Card Reconciliations",
      "Accounts Payable & Receivable Tracking",
      "Monthly Closing Support",
    ],
    whoFor: [
      "Firms whose monthly close keeps slipping",
      "Practices inheriting clients with messy or backlogged books",
      "Teams that want tax season to start from reconciled records",
    ],
    relatedService: "accounting",
  },
  {
    slug: "offshore-payroll-expert",
    title: "Offshore Payroll Expert",
    metaTitle: "Hire an Offshore Payroll Expert for Your CPA Firm",
    metaDescription:
      "Hire a dedicated offshore payroll expert — accurate payroll processing, confident multi-state compliance, and streamlined payroll reporting and documentation.",
    h1: "Hire a Dedicated Offshore Payroll Expert",
    icon: "Users",
    teaser:
      "Accurate processing and multi-state compliance, handled by someone who does only this.",
    intro:
      "Payroll is high-frequency, high-penalty work: it runs whether or not anyone has time for it, and multi-state rules punish approximation. A dedicated offshore payroll expert takes the recurring processing and the compliance detail off your team, and frees internal staff for work that actually needs your firm's judgement.",
    capabilities: [
      "Ensure Accurate Payroll Processing",
      "Navigate Multi-State Compliance Confidently",
      "Streamline Payroll Reporting & Documentation",
      "Free Up Internal Resources for Strategic Growth",
    ],
    whoFor: [
      "Firms running payroll for clients across several states",
      "Practices where payroll interrupts higher-value work every cycle",
      "Teams exposed to filing-deadline penalties",
    ],
    relatedService: "accounting",
  },
  {
    slug: "offshore-back-year-tax-preparer",
    title: "Offshore Back Year Tax Preparer",
    metaTitle: "Hire an Offshore Back Year Tax Preparer",
    metaDescription:
      "Hire a dedicated offshore back year tax preparer — accurate, compliant prior-year returns that minimise audit risk and regulatory penalties while digitising the client's records.",
    h1: "Hire a Dedicated Offshore Back Year Tax Preparer",
    icon: "Archive",
    teaser:
      "Specialist capacity for delinquent filings — the engagement most firms accept reluctantly.",
    intro:
      "Back year engagements are profitable and unpopular for the same reason: they are slow, document-heavy and hard to staff. A dedicated back year preparer works through the backlog methodically — reconstructing, verifying and digitising as they go — so your firm can say yes to the work without losing a senior to it for a month.",
    capabilities: [
      "Accurate & Compliant Back Year Returns",
      "Minimize Audit Risk & Regulatory Penalties",
      "Streamline and Digitize Tax Records",
      "Expand Capacity Without Hiring Internally",
    ],
    whoFor: [
      "Firms with clients several years behind on filings",
      "Practices declining back year work for lack of capacity",
      "Teams needing prior-year records reconstructed and digitised",
    ],
    relatedService: "back-year-tax",
  },
  {
    slug: "offshore-audit-support",
    title: "Offshore Audit Support",
    metaTitle: "Hire Offshore Audit Support Staff for Your CPA Firm",
    metaDescription:
      "Hire dedicated offshore audit support — execute audit procedures accurately, improve workpaper management and documentation, and deliver engagements on time without adding staff.",
    h1: "Hire Dedicated Offshore Audit Support",
    icon: "ShieldCheck",
    teaser:
      "Procedure execution and workpaper discipline that keeps engagements on schedule.",
    intro:
      "Audit capacity is the hardest to flex, because the work is methodology-bound and the deadlines are immovable. Offshore audit support gives your engagement teams trained hands for procedure execution and documentation, working to your methodology — while every element of judgement, review and opinion stays inside your firm.",
    capabilities: [
      "Execute Audit Procedures with Accuracy",
      "Improve Audit Documentation & Workpaper Management",
      "Ensure Timely Audit Delivery",
      "Expand Capacity Without Adding Full-Time Staff",
    ],
    whoFor: [
      "Firms with audit engagements clustered around the same deadlines",
      "Practices where seniors are preparing workpapers rather than reviewing them",
      "Teams that need to flex audit capacity by season",
    ],
    relatedService: "audit",
  },
];

export const getRole = (slug: string) => roles.find((r) => r.slug === slug);

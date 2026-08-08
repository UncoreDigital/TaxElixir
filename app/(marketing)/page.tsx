import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import BuiltFor from "@/components/sections/BuiltFor";
import CoreServices from "@/components/sections/CoreServices";
import Stats from "@/components/sections/Stats";
import WhyUs from "@/components/sections/WhyUs";
import Workflow from "@/components/sections/Workflow";
import StaffingTabs from "@/components/sections/StaffingTabs";
import Leadership from "@/components/sections/Leadership";
import Software from "@/components/sections/Software";
import FaqSection from "@/components/sections/FaqSection";
import CTA from "@/components/sections/CTA";
import { faqs } from "@/lib/content";

/*
 * Title is set in full rather than through the layout's `%s | TaxElixir`
 * template: the client's document specifies the whole string including the
 * suffix, and letting the template append would produce it twice.
 */
export const metadata: Metadata = {
  title: {
    absolute: "Outsourced Tax, Accounting & Audit Support for US CPA Firms | TaxElixir",
  },
  description:
    "TaxElixir helps US CPA firms outsource tax preparation, bookkeeping, audit support and offshore staffing. CPA led delivery, built inside your own systems.",
  alternates: { canonical: "/" },
  openGraph: {
    description:
      "TaxElixir is an India based outsourcing partner for US CPA firms. Tax prep, accounting, audit support and dedicated offshore staff, working in your software.",
  },
};

/**
 * Section order follows the client's website content document exactly: hero,
 * trust figures, services, delivery standard, why, how we work, staffing,
 * leadership, technology, FAQs, closing CTA.
 *
 * Section 2 is split across two components. Its three proof figures live in the
 * hero, one to each slide, at the client's request; BuiltFor carries the
 * qualifying statement that followed them.
 *
 * Testimonials is gone — the document has no testimonials section, and the
 * array behind it has been empty since launch, so the homepage was rendering a
 * "client to supply" state to every visitor. It stays in the codebase and drops
 * back in the moment there are real quotes to put in it.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <BuiltFor />
      <CoreServices />
      <Stats />
      <WhyUs />
      <Workflow />
      <StaffingTabs />
      <Leadership />
      <Software />
      <FaqSection items={faqs.slice(0, 6)} />
      <CTA />
    </>
  );
}

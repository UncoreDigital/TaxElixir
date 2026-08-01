import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import CoreServices from "@/components/sections/CoreServices";
import Stats from "@/components/sections/Stats";
import WhyUs from "@/components/sections/WhyUs";
import Workflow from "@/components/sections/Workflow";
import HireRoles from "@/components/sections/HireRoles";
import Software from "@/components/sections/Software";
import FaqSection from "@/components/sections/FaqSection";
import CTA from "@/components/sections/CTA";
import DisclaimerBand from "@/components/DisclaimerBand";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Outsourced Tax, Accounting & Audit for CPA Firms",
  description:
    "TaxElixir is an India-based offshore outsourcing partner for US CPA firms — tax preparation, back year filings, bookkeeping, audit support and dedicated offshore staffing, delivered inside your own systems.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CoreServices />
      <Stats />
      <WhyUs />
      <Workflow />
      <HireRoles />
      <Software />
      <FaqSection items={faqs.slice(0, 6)} />
      <DisclaimerBand />
      <CTA />
    </>
  );
}

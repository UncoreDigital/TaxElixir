import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import CoreServices from "@/components/sections/CoreServices";
import Stats from "@/components/sections/Stats";
import WhyUs from "@/components/sections/WhyUs";
import Workflow from "@/components/sections/Workflow";
import StaffingTabs from "@/components/sections/StaffingTabs";
import Leadership from "@/components/sections/Leadership";
import Testimonials from "@/components/sections/Testimonials";
import Software from "@/components/sections/Software";
import FaqSection from "@/components/sections/FaqSection";
import CTA from "@/components/sections/CTA";
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
      <StaffingTabs />
      <Leadership />
      <Testimonials />
      <Software />
      <FaqSection items={faqs.slice(0, 6)} />
      <CTA />
    </>
  );
}

import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Software from "@/components/sections/Software";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Software We Work In",
  description:
    "TaxElixir works inside the platforms your firm already uses — CCH Axcess, CaseWare, QuickBooks, Xero, UltraTax, Lacerte, Drake and more. Nothing to migrate, nothing new for your staff to learn.",
  alternates: { canonical: "/software" },
};

const principles = [
  {
    title: "We adapt to you",
    body: "Your licences, your environment, your folder structure and naming conventions. We are the ones who learn a new system at the start of an engagement, not your team.",
  },
  {
    title: "No platform lock-in",
    body: "There is no TaxElixir portal you are required to adopt and no proprietary tool that holds your data. If we part ways, your files are exactly where they always were.",
  },
  {
    title: "Access on your terms",
    body: "Remote access into your environment, VPN, virtual desktop or your document portal — whatever your IT policy prescribes, provisioned least-privilege.",
  },
];

export default function SoftwarePage() {
  return (
    <>
      <PageBanner
        eyebrow="Technology"
        title="We work in your software, not ours"
        crumbs={[{ name: "Software" }]}
        intro="The most common reason outsourcing fails is that the provider makes the firm adopt their tooling. We do the opposite — there is nothing to migrate and nothing new for your staff to learn."
      />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="How We Approach Tooling"
            title="Three principles"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {principles.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="h-full rounded-xl border border-border bg-white p-7 shadow-soft">
                  <h3 className="text-lg">{item.title}</h3>
                  <span className="rule-gold mt-4" aria-hidden="true" />
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Software />
      <CTA />
    </>
  );
}

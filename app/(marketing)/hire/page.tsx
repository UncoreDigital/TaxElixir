import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import HireRoles from "@/components/sections/HireRoles";
import Workflow from "@/components/sections/Workflow";
import WhyUs from "@/components/sections/WhyUs";
import CTA from "@/components/sections/CTA";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Hire Offshore Staff for Your CPA Firm",
  description:
    "Hire dedicated offshore accountants, tax preparers, bookkeepers, payroll experts, back year preparers and audit support staff — full-time, part-time or seasonal, integrated with your firm's systems.",
  alternates: { canonical: "/hire" },
};

const models = [
  {
    title: "Full-Time Dedicated",
    body: "One named professional working your business hours, on your engagements only. The closest equivalent to an in-house hire, without the recruitment cycle or the notice period.",
  },
  {
    title: "Part-Time or Seasonal",
    body: "Agreed hours per week, or a ramp that follows your season. You carry capacity when you need it and nothing when you do not.",
  },
  {
    title: "Project-Based",
    body: "A defined piece of work — a back year backlog, a batch of returns, a bookkeeping clean-up — scoped and priced as a project rather than a headcount.",
  },
];

export default function HirePage() {
  return (
    <>
      <PageBanner
        eyebrow="Offshore Staffing"
        title="Dedicated offshore professionals who become an extension of your team"
        crumbs={[{ name: "Hire Offshore Staff" }]}
        intro="Six roles covering the work that consumes a CPA firm's capacity. You get a named individual who learns your standards and stays on your engagements — not an anonymous pool of hours."
      />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Engagement Models"
            title="Three ways to bring someone on"
            intro="Most firms start with one dedicated person or a defined pilot project, then scale once the working relationship is proven."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {models.map((model, i) => (
              <Reveal key={model.title} delay={i * 0.06}>
                <div className="h-full rounded-xl border border-border bg-white p-7 shadow-soft">
                  <span className="rule-gold" aria-hidden="true" />
                  <h3 className="mt-5 text-lg">{model.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{model.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <HireRoles />
      <Workflow />
      <WhyUs />
      <CTA
        title="Tell us which role you need"
        body="Describe the work you want covered and we will propose the right role, the right model and a pilot you can judge us on."
      />
    </>
  );
}

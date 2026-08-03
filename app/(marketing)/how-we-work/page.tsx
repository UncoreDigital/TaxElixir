import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Workflow from "@/components/sections/Workflow";
import Software from "@/components/sections/Software";
import FaqSection from "@/components/sections/FaqSection";
import CTA from "@/components/sections/CTA";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "How We Work — Engagement Process for CPA Firms",
  description:
    "How TaxElixir engages: discovery call, written scope, secure access under your controls, a pilot batch you inspect, then steady-state delivery with a named point of contact.",
  alternates: { canonical: "/how-we-work" },
};

const models = [
  {
    title: "Dedicated Resource",
    body: "A named professional working only on your engagements, full-time or part-time, aligned to your business hours.",
    best: "Firms with continuous, predictable volume",
  },
  {
    title: "Seasonal Capacity",
    body: "A team that ramps for busy season and stands down afterwards, so you are not carrying preparation payroll in July.",
    best: "Firms whose workload is sharply seasonal",
  },
  {
    title: "Project Engagement",
    body: "A defined scope — a back year backlog, a batch of returns, a bookkeeping clean-up — priced as a project.",
    best: "One-off or clearly bounded work",
  },
];

const commitments = [
  { title: "Named point of contact", body: "A specific person who knows your engagements. Not a shared inbox and not a ticket queue." },
  { title: "Self-review before delivery", body: "Work is checked against your standards before it reaches your reviewer, with the supporting documentation attached." },
  { title: "Agreed turnaround", body: "Turnaround expectations are set in the scope document, per work type, before anything starts." },
  { title: "Defined escalation path", body: "You know who to call when something is urgent, and what response time to expect." },
  { title: "Your systems, your conventions", body: "Your software, your folder structure, your file naming, your workpaper templates." },
  { title: "No client contact without approval", body: "We do not approach your clients. If you want us client-facing, that is your call and it is written into scope." },
];

export default function HowWeWorkPage() {
  return (
    <>
      <PageBanner
        eyebrow="How We Work"
        title="A working relationship you can inspect before you commit"
        crumbs={[{ name: "How We Work" }]}
        intro="No client data moves before scope and terms are agreed in writing, and no volume ramps before you have judged a pilot batch against your own review standards."
      />

      <Workflow />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Engagement Models"
            title="Three ways to work with us"
            intro="Most firms begin with a project or a single dedicated resource, then expand once output quality is proven against their standards."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {models.map((model, i) => (
              <Reveal key={model.title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-xl border border-border bg-white p-7 shadow-soft">
                  <h3 className="text-lg">{model.title}</h3>
                  <span className="rule-gold mt-4" aria-hidden="true" />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">{model.body}</p>
                  <p className="mt-5 border-t border-border pt-4 text-xs">
                    <span className="font-semibold uppercase tracking-wide text-gold-dark">Best for </span>
                    <span className="text-ink-muted">{model.best}</span>
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-muted/50">
        <div className="container">
          <SectionHeading
            eyebrow="What You Can Expect"
            title="Six things we commit to in writing"
            intro="These are not aspirations. Each one is written into the scope document before work starts, so there is something to hold us to."
          />
          <div className="mt-14 grid gap-x-10 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {commitments.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="border-t border-border pt-6">
                  <span className="mb-4 block h-0.5 w-10 bg-gradient-gold-x" aria-hidden="true" />
                  <h3 className="text-base">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Software />
      <FaqSection items={faqs} />
      <CTA />
    </>
  );
}

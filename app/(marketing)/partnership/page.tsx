import type { Metadata } from "next";
import { Check, Handshake } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Workflow from "@/components/sections/Workflow";
import FaqSection from "@/components/sections/FaqSection";
import CTA from "@/components/sections/CTA";
import DisclaimerBand from "@/components/DisclaimerBand";
import { partnershipModels } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partnership — White-Label & Referral",
  description:
    "White-label delivery, referral and reserved-capacity partnerships for US CPA firms. We work behind your brand and never contact your clients directly.",
  alternates: { canonical: "/partnership" },
};

const partnershipFaqs = [
  {
    q: "Will our clients know you are involved?",
    a: "Not unless you tell them. Under a white-label arrangement, deliverables carry your templates and your letterhead, nothing we produce is branded, and we do not contact your clients directly. If you would rather introduce us openly, that works too — it is your call and it goes into the scope document either way.",
  },
  {
    q: "Do you ever compete with us for our clients?",
    a: "No. TaxElixir works exclusively with CPA firms and does not sell services to end taxpayers. Your client relationships are the thing we are least willing to put at risk, because our whole model depends on firms trusting us with them.",
  },
  {
    q: "How are partnership terms structured?",
    a: "In writing, before any work starts. Scope, volumes, turnaround expectations, escalation path and commercial terms are agreed up front. Reserved-capacity arrangements also fix the volume and the window ahead of your busy season.",
  },
  {
    q: "Can we start small?",
    a: "Yes, and we recommend it. Most partnerships begin as a single pilot engagement or one dedicated resource, and expand once you have judged our output against your own review standards.",
  },
];

export default function PartnershipPage() {
  return (
    <>
      <PageBanner
        eyebrow="Partnership"
        title="Work with us behind your brand"
        crumbs={[{ name: "Partnership" }]}
        intro="Three ways firms partner with TaxElixir — white-label delivery, referral arrangements, and reserved seasonal capacity. In all three, the client relationship stays entirely yours."
      />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Models"
            title="Three arrangements, one principle"
            intro="We do not sell to end taxpayers and we do not approach the firms you serve. That is not a courtesy — it is the only reason a firm would hand us their client work in the first place."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {partnershipModels.map((model, i) => (
              <Reveal key={model.title} delay={i * 0.07}>
                <div className="flex h-full flex-col rounded-xl border border-border bg-white p-8 shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-gold-x text-navy">
                    <Handshake className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <h2 className="mt-6 text-xl">{model.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{model.body}</p>

                  <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
                    {model.points.map((point) => (
                      <li key={point} className="flex gap-2.5 text-sm leading-snug text-ink-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Workflow />
      <FaqSection
        items={partnershipFaqs}
        eyebrow="Partnership FAQs"
        title="What firms ask before partnering"
      />
      <DisclaimerBand />
      <CTA
        title="Let's talk about how this would work"
        body="Tell us how your firm is structured and what you would want covered. We will come back with a model, terms and a pilot."
        secondary={{ href: "/how-we-work", label: "See How We Work" }}
      />
    </>
  );
}

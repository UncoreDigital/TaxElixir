import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Handshake } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Workflow from "@/components/sections/Workflow";
import CTA from "@/components/sections/CTA";
import { partnershipModels } from "@/lib/content";
import { features } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partnership — White-Label & Referral",
  description:
    "White-label delivery, referral and reserved-capacity partnerships for US CPA firms. We work behind your brand and never contact your clients directly.",
  alternates: { canonical: "/partnership" },
};

/*
  The partnership-specific FAQ block was removed here per the client's Website
  Updates sheet, row 15: FAQ sections belong only on the home page, /software
  and /faqs. The four questions it carried — white-label visibility, whether we
  compete for their clients, how terms are structured, and starting small — are
  answered by the shared set on /faqs, and the copy is recoverable from git if
  the client wants it reinstated.
*/

export default function PartnershipPage() {
  // Parked with the rest of the Resources group — see features.resources. It
  // sits in that dropdown, so it goes dark with the group rather than being
  // orphaned into the top-level nav.
  if (!features.resources) notFound();

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
      <CTA
        title="Let's talk about how this would work"
        body="Tell us how your firm is structured and what you would want covered. We will come back with a model, terms and a pilot."
        secondary={{ href: "/how-we-work", label: "See How We Work" }}
      />
    </>
  );
}

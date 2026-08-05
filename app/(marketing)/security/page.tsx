import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import CTA from "@/components/sections/CTA";
import { securityControls } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Security & Compliance",
  description:
    "How TaxElixir protects CPA firm and client data: least-privilege access, controlled workstations, encrypted transfer, signed confidentiality agreements and monitored networks.",
  alternates: { canonical: "/security" },
};

export default function SecurityPage() {
  return (
    <>
      <PageBanner
        eyebrow="Security & Compliance"
        title="Your clients' data, under controls you can audit"
        crumbs={[{ name: "Security & Compliance" }]}
        intro="Every firm that outsources has to answer to its own clients for how their data is handled. This page exists so you can answer that question with specifics, and so your vendor due-diligence process has somewhere to start."
      />

      <section className="section">
        <div className="container">
          {/* The opening sentence — "These are the controls a US CPA firm's
              vendor questionnaire will ask about." — was struck by the client
              (Website Updates sheet, row 16). The offer to complete the
              questionnaire stays: that is the useful half of the paragraph, and
              the due-diligence block further down depends on it. */}
          <SectionHeading
            eyebrow="Controls"
            title="The control set we operate"
            intro="We are happy to complete your vendor questionnaire in full and to walk your IT or risk lead through any of the controls below."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {securityControls.map((control, i) => (
              <Reveal key={control.title} delay={i * 0.04}>
                <div className="h-full rounded-xl border border-border bg-white p-6 shadow-soft">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/5 text-navy">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base leading-snug">{control.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{control.body}</p>
                  {control.needsClient && <Placeholder label="verify before launch" className="mt-3" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/*
        The "Independent certifications" section was removed at the client's
        request (Website Updates sheet, row 16). It held no claim — only a note
        that certifications would be listed once evidenced — so nothing factual
        is lost with it.

        The original reasoning still stands and should govern anything that
        replaces it: certifications are not to be claimed here until they can be
        evidenced. Publishing an unverified ISO 27001 or SOC 2 badge on a page
        selling data security to CPA firms is the fastest way to fail a
        due-diligence review.
      */}

      <section className="section bg-muted/50">
        <div className="container">
          <div className="rounded-2xl border border-border bg-white p-8 shadow-soft md:p-12">
            <SectionHeading
              eyebrow="Due Diligence"
              title="Running a vendor assessment on us?"
              intro="Send your security questionnaire, DPA or third-party risk assessment and we will complete it. If you need a call with whoever owns security on our side, ask for it."
            />
            <a
              href={site.emailHref}
              className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-navy underline decoration-gold/60 underline-offset-4 hover:decoration-gold"
            >
              {site.email}
            </a>
          </div>
        </div>
      </section>
      <CTA
        title="Questions about how we handle your data?"
        body="We would rather answer them properly before an engagement than be asked about them during one."
        secondary={{ href: "/how-we-work", label: "See How We Work" }}
      />
    </>
  );
}

import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import AvatarPlaceholder from "@/components/AvatarPlaceholder";
import Stats from "@/components/sections/Stats";
import WhyUs from "@/components/sections/WhyUs";
import CoreServices from "@/components/sections/CoreServices";
import CTA from "@/components/sections/CTA";
import DisclaimerBand from "@/components/DisclaimerBand";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About TaxElixir — Offshore Partner to US CPA Firms",
  description:
    "TaxElixir is an India-based outsourcing partner working exclusively with US CPA firms — tax preparation, accounting, audit support and dedicated offshore staffing delivered inside your own systems.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Trust",
    body: "Client data and client relationships are yours. We work behind your brand, under your controls, and we do not approach the firms you serve.",
  },
  {
    title: "Precision",
    body: "Accounting is a profession where 'nearly right' is wrong. Work leaves us with a completed self-review, not with a note asking you to check it.",
  },
  {
    title: "Clarity",
    body: "Scope, turnaround, escalation and price are written down before work starts. Surprises belong in other industries.",
  },
  {
    title: "Excellence",
    body: "The tagline is 'Where Trust Meets CPA Excellence' and it sets the bar we are measured against — your review standards, not our internal ones.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner
        eyebrow="About Us"
        title="Where trust meets CPA excellence"
        crumbs={[{ name: "About" }]}
        intro="TaxElixir is an India-based offshore outsourcing partner built for one market: US CPA firms. We are not a marketplace, not a software platform, and not a competitor for your clients."
      />

      <section className="section">
        <div className="container grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <SectionHeading
              eyebrow="Our Company"
              title="One market, served properly"
              intro={
                <>
                  <p>
                    Most outsourcing providers sell to everyone and specialise in
                    nobody. TaxElixir works exclusively with US CPA firms, which
                    means our processes are shaped by the things that actually
                    govern your practice: engagement letters, review hierarchies,
                    IRS deadlines and the fact that your name goes on the return.
                  </p>
                  <p className="mt-4">
                    We cover four connected service lines — tax preparation, back
                    year filings, accounting and bookkeeping, and audit support —
                    plus dedicated offshore staffing across six roles. Firms
                    typically start with one of these and expand once the working
                    relationship is proven.
                  </p>
                </>
              }
            />
          </div>

          <div className="rounded-2xl border border-border bg-muted/50 p-8">
            <h2 className="text-lg">At a glance</h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-semibold text-navy">Who we serve</dt>
                <dd className="mt-1 text-ink-muted">US CPA firms and accounting practices — exclusively.</dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">Where we work</dt>
                <dd className="mt-1 text-ink-muted">
                  India-based delivery teams working US business hours.{" "}
                  <Placeholder label="office locations needed" />
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">How we engage</dt>
                <dd className="mt-1 text-ink-muted">Dedicated full-time, part-time or seasonal staffing, and project-based work.</dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">Contact</dt>
                <dd className="mt-1">
                  <a href={site.emailHref} className="text-navy underline decoration-gold/60 underline-offset-2">
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <Stats />

      <section className="section bg-muted/50">
        <div className="container">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Four commitments we are willing to be held to"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.06}>
                <div className="h-full rounded-xl border border-border bg-white p-7 shadow-soft">
                  <h3 className="text-lg">{value.title}</h3>
                  <span className="rule-gold mt-4" aria-hidden="true" />
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">{value.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/*
        Leadership and team are deliberately absent rather than filled with
        stock photography — see the content-gap list in README.md.
      */}
      <section className="section">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Leadership"
            title="Meet the team"
            intro="Firms outsourcing offshore want to know who is accountable. Leadership profiles are being prepared."
          />

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <AvatarPlaceholder />
                <div className="mt-4 space-y-2">
                  <div className="h-3.5 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted/70" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Placeholder label="client to supply: names, titles, bios, photos" />
          </div>
        </div>
      </section>

      <CoreServices />
      <WhyUs />
      <DisclaimerBand />
      <CTA />
    </>
  );
}

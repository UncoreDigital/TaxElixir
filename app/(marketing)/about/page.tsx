import type { Metadata } from "next";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import Stats from "@/components/sections/Stats";
import SuccessStories from "@/components/sections/SuccessStories";
import WhyUs from "@/components/sections/WhyUs";
import CoreServices from "@/components/sections/CoreServices";
import CTA from "@/components/sections/CTA";
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

/**
 * Drawn only from what the client wrote — nothing here is inferred.
 *
 * "In practice since 2003" is the client's own start date, not 2026 minus the
 * "20+ years" figure: the two are stated separately in the bio and would only
 * agree by coincidence.
 */
const credentials = [
  "Licensed CPA",
  "MBA, Finance",
  "In practice since 2003",
  "Middle East industry exposure",
  "AI & Automation Committee member",
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
      <SuccessStories />

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
        The founder profile the client supplied. The rest of the leadership team
        is still outstanding — content-gap #12 — but one real, named, accountable
        person beats four dashed frames, so the empty slots are gone rather than
        sitting next to a genuine profile. Still no stock photography.
      */}
      <section className="section">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Leadership"
            title="Who is accountable"
            intro="Firms sending work offshore ask one question before any other: who stands behind it. This is where that answer starts."
          />

          {/*
            Three grid children with explicit placement, for two reasons.

            `self-start` on the photo keeps it square: grid children stretch by
            default, which would pull this 1:1 headshot to the height of a
            400-word bio and let object-cover crop it to roughly 1:2 — a hard
            zoom into her face.

            The explicit rows put the name above the photo when the grid
            collapses to one column. In source order the photo comes second, so
            a phone reads name → photo → credentials → bio instead of meeting a
            stranger's photograph and a credential list before her name.
          */}
          <Reveal>
            <article className="mx-auto mt-14 max-w-5xl rounded-2xl border border-border bg-white p-8 shadow-soft md:p-10 lg:p-12">
              <div className="grid gap-y-8 md:grid-cols-[minmax(0,19rem)_1fr] md:gap-x-12">
                <div className="md:col-start-2 md:row-start-1">
                  <h3 className="text-2xl md:text-3xl">Dhara Jain</h3>
                  <p className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">
                    Founder
                    <Placeholder label="confirm title" className="tracking-wide" />
                  </p>
                </div>

                {/* Credentials sit under the photo rather than beside the name:
                    the bio runs ~400 words, so a photo-only column would leave a
                    tall empty gutter next to it. */}
                <div className="mx-auto w-full max-w-[19rem] self-start md:col-start-1 md:row-span-2 md:row-start-1 md:mx-0 md:max-w-none">
                  <Image
                    src="/assets/team/Owner.jpeg"
                    alt="Dhara Jain"
                    width={1254}
                    height={1254}
                    // Source is 1254x1254 into a square box, so object-cover
                    // crops nothing at all.
                    sizes="(min-width: 768px) 304px, 304px"
                    className="aspect-square w-full rounded-2xl object-cover shadow-soft"
                  />

                  <span className="rule-gold mt-7" aria-hidden="true" />

                  <ul className="mt-5 space-y-3">
                    {credentials.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-snug text-ink-muted">
                        <span
                          className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="min-w-0 md:col-start-2 md:row-start-2">
                  <span className="rule-gold" aria-hidden="true" />

                  <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-muted md:text-base">
                    <p>
                      Dhara Jain is a seasoned finance and accounting professional with
                      over 20 years of experience and unparalleled expertise in delivering
                      accurate and timely financial information. Dhara is committed to her
                      values of accountability, financial data accuracy and continued
                      professional growth. Her professional journey began in 2003 as an MBA
                      Finance professional, solving complex accounts receivable challenges
                      and handling responsibilities with diligence and precision.
                    </p>
                    <p>
                      Over the years, Dhara has gained valuable industry exposure in the
                      Middle East, which enriched her global perspective and strengthened
                      her adaptability in diverse business environments. She advanced her
                      expertise by completing her CPA certification and obtaining her
                      license, showing her dedication to lifelong learning and professional
                      excellence.
                    </p>
                    <p>
                      She has also remained actively engaged in emerging developments such
                      as AI and automation, and has contributed knowledge of R&amp;D tax
                      credit calculation as a member of an AI and Automation Committee
                      within her previous organisation.
                    </p>
                  </div>

                  {/*
                    Rendered as a statement about her, not a quotation. The client
                    described her approach in the third person and we are not putting
                    invented words inside quote marks beside a real person's photograph.
                  */}
                  <p className="mt-7 border-l-2 border-gold bg-gold/[0.06] py-4 pl-5 pr-4 text-sm leading-relaxed text-navy md:text-base">
                    Her working approach is guided by the belief that accuracy and speed
                    are essential to delivering timely, compliant and high-quality results.
                  </p>

                  <p className="mt-7 text-sm leading-relaxed text-ink-muted">
                    Apart from her professional commitments, Dhara enjoys swimming, playing
                    tennis and trekking. She believes that an active lifestyle helps
                    sustain energy, focus and overall momentum in life.
                  </p>
                </div>
              </div>
            </article>
          </Reveal>

          <p className="mt-8 text-center">
            <Placeholder label="client to supply: remaining leadership profiles" />
          </p>
        </div>
      </section>

      <CoreServices />
      <WhyUs />
      <CTA />
    </>
  );
}

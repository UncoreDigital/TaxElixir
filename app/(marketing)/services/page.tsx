import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Workflow from "@/components/sections/Workflow";
import CTA from "@/components/sections/CTA";
import { services } from "@/lib/services-data";
import { getIcon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Services for US CPA Firms",
  description:
    "Outsourced tax preparation, back year filings, accounting, bookkeeping, CAAS and audit support for US CPA firms — delivered by dedicated offshore professionals inside your own workflow and software.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        eyebrow="Services"
        title="Outsourced support across the full CPA engagement cycle"
        crumbs={[{ name: "Services" }]}
        intro="Four service lines covering the work that fills your team's calendar — returns, books, close and audit fieldwork. All delivered by dedicated offshore professionals integrated with your existing workflow and software."
      />

      <section className="section">
        <div className="container space-y-6">
          {services.map((service, i) => {
            const Icon = getIcon(service.icon);
            return (
              <Reveal key={service.slug} delay={i * 0.05}>
                <article className="grid gap-8 rounded-2xl border border-border bg-white p-8 shadow-soft md:grid-cols-[1fr_1.3fr] md:p-10">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-gold-x text-navy">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-display text-3xl text-border">
                        {service.number}
                      </span>
                    </div>

                    <h2 className="mt-6 text-2xl md:text-3xl">{service.title}</h2>
                    <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                      {service.teaser}
                    </p>

                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy"
                    >
                      Full {service.navTitle} detail
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 md:border-l md:border-border md:pl-10">
                    {service.groups.map((group) => (
                      <div key={group.title}>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-dark">
                          {group.title}
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {group.items.slice(0, 6).map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-sm leading-snug text-ink-muted"
                            >
                              <Check
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                                aria-hidden="true"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {group.items.length > 6 && (
                          <p className="mt-2 text-xs text-ink-muted">
                            +{group.items.length - 6} more
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Software block removed — see the client's Website Updates sheet, row
          15. It lives on the home page and /software. */}
      <Workflow />
      <CTA />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Workflow from "@/components/sections/Workflow";
import CTA from "@/components/sections/CTA";
import ProvisionalNotice from "@/components/ProvisionalNotice";
import { services, getService } from "@/lib/services-data";
import { getRole } from "@/lib/hire-data";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getService(params.slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `${site.url}/services/${service.slug}`,
    },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();

  const related = service.relatedRoles
    .map((slug) => getRole(slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${site.url}/services/${service.slug}` },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: { "@type": "Country", name: "United States" },
    audience: { "@type": "Audience", audienceType: "US CPA firms and accounting practices" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} — scope`,
      itemListElement: service.groups.flatMap((g) =>
        g.items.map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item, category: g.title },
        }))
      ),
    },
  };

  return (
    <>
      <PageBanner
        eyebrow={`Service ${service.number}`}
        title={service.h1}
        crumbs={[{ name: "Services", href: "/services" }, { name: service.title }]}
        intro={service.intro}
      />

      {service.provisional && <ProvisionalNotice service={service.title} />}

      {/*
        Feature image. Sits between the banner and the scope grid so the page
        has something to look at before it asks the reader to work through
        three columns of checklists.

        Decorative — empty alt. The <h1> and intro immediately above name the
        service; a description of the photograph would only repeat them.

        `priority` because at this position it is the page's LCP candidate on
        most viewports, and the aspect box reserves its height either way.

        It lifts into the navy banner rather than sitting in the white gap
        below it. `relative z-10` is load-bearing, not decoration: PageBanner is
        itself a positioned element, so an unpositioned sibling would paint
        underneath it and the overlapping strip would simply vanish. The lift
        (40px, 64px at md) stays inside the banner's own bottom padding
        (64px/96px), so it never reaches the intro text.
      */}
      <div className="container relative z-10 -mt-10 md:-mt-16">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted shadow-soft">
          <Image
            src={service.image}
            alt=""
            fill
            priority
            sizes="(min-width: 1320px) 1256px, 100vw"
            className="object-cover"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Scope */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Scope of Work"
            title={`What ${service.title.toLowerCase()} covers`}
            intro="Taken directly from our service schedule — if something you need is not listed, ask. The list describes our standard scope, not its limits."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {service.groups.map((group, i) => (
              <Reveal key={group.title} delay={i * 0.06}>
                <div className="h-full rounded-xl border border-border bg-white p-7 shadow-soft">
                  <h3 className="text-lg">{group.title}</h3>
                  <span className="rule-gold mt-4" aria-hidden="true" />
                  <ul className="mt-5 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-snug text-ink-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          {service.note && (
            <p className="mt-10 rounded-lg border-l-2 border-gold bg-muted/60 px-6 py-4 text-sm leading-relaxed text-ink">
              {service.note}
            </p>
          )}
        </div>
      </section>

      {/* What we deliver — audit only */}
      {service.deliver && (
        <section className="section bg-muted/50">
          <div className="container">
            <SectionHeading
              eyebrow="Deliverables"
              title="What we deliver on each engagement type"
            />
            <div className="scroll-x mt-12">
              <table className="w-full min-w-[42rem] border-collapse overflow-hidden rounded-xl bg-white shadow-soft">
                <thead>
                  <tr className="bg-navy text-left text-white">
                    <th scope="col" className="w-16 px-5 py-4 text-sm font-semibold">#</th>
                    <th scope="col" className="w-1/3 px-5 py-4 text-sm font-semibold">Engagement Type</th>
                    <th scope="col" className="px-5 py-4 text-sm font-semibold">What We Deliver</th>
                  </tr>
                </thead>
                <tbody>
                  {service.deliver.map((row, i) => (
                    <tr key={row.name} className="border-b border-border last:border-0">
                      <td className="px-5 py-4 font-display text-lg text-gold-dark">{i + 1}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-navy">{row.name}</td>
                      <td className="px-5 py-4 text-sm leading-relaxed text-ink-muted">{row.body}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Process — back year tax only */}
      {service.process && (
        <section className="section bg-muted/50">
          <div className="container">
            <SectionHeading
              eyebrow="The Process"
              title="Four stages from shoebox to filing-ready"
              intro="Every stage has a defined output, so you always know exactly where an engagement stands."
            />
            <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step, i) => (
                <Reveal key={step.step} delay={i * 0.06}>
                  <li className="h-full rounded-xl border border-border bg-white p-7 shadow-soft">
                    <span className="font-display text-3xl text-gradient-gold">{step.step}</span>
                    <h3 className="mt-4 text-base leading-snug">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{step.body}</p>
                    <p className="mt-4 border-t border-border pt-4 text-xs font-semibold uppercase tracking-wide text-gold-dark">
                      {step.outcome}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Related roles */}
      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Staff This Work"
              title="Prefer a dedicated person to a project engagement?"
              intro="The same work, delivered by a named individual who becomes part of your team rather than a batch you send out."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {related.map((role) => (
                <Link
                  key={role.slug}
                  href={`/hire/${role.slug}`}
                  className="group flex items-center justify-between gap-6 rounded-xl border border-border bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
                >
                  <span>
                    <span className="block font-display text-lg font-bold text-navy">
                      {role.title}
                    </span>
                    <span className="mt-1.5 block text-sm leading-snug text-ink-muted">
                      {role.teaser}
                    </span>
                  </span>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-gold transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Software and FAQ blocks removed per the client's Website Updates
          sheet, row 15: both belong only on the home page, /software and /faqs.
          Repeating them under every service page pushed the CTA below two
          sections the reader had already scrolled past elsewhere. */}
      <Workflow />
      <CTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
    </>
  );
}

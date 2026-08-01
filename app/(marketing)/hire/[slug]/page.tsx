import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Workflow from "@/components/sections/Workflow";
import FaqSection from "@/components/sections/FaqSection";
import CTA from "@/components/sections/CTA";
import DisclaimerBand from "@/components/DisclaimerBand";
import { ButtonLink } from "@/components/ui/Button";
import { roles, getRole } from "@/lib/hire-data";
import { getService } from "@/lib/services-data";
import { getIcon } from "@/lib/icons";
import { faqs } from "@/lib/content";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return roles.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const role = getRole(params.slug);
  if (!role) return {};

  return {
    title: role.metaTitle,
    description: role.metaDescription,
    alternates: { canonical: `/hire/${role.slug}` },
    openGraph: {
      title: role.metaTitle,
      description: role.metaDescription,
      url: `${site.url}/hire/${role.slug}`,
    },
  };
}

export default function RolePage({ params }: { params: { slug: string } }) {
  const role = getRole(params.slug);
  if (!role) notFound();

  const Icon = getIcon(role.icon);
  const service = getService(role.relatedService);
  const others = roles.filter((r) => r.slug !== role.slug).slice(0, 3);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Hire Offshore Staff", item: `${site.url}/hire` },
      { "@type": "ListItem", position: 3, name: role.title, item: `${site.url}/hire/${role.slug}` },
    ],
  };

  return (
    <>
      <PageBanner
        eyebrow="Offshore Staffing"
        title={role.h1}
        crumbs={[{ name: "Hire Offshore Staff", href: "/hire" }, { name: role.title }]}
        intro={role.intro}
      >
        <ButtonLink href="/contact" variant="gold" size="lg">
          Discuss this role
        </ButtonLink>
      </PageBanner>

      <section className="section">
        <div className="container grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-gold-x text-navy">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <SectionHeading
              className="mt-7"
              eyebrow="Core Responsibilities"
              title={`What your ${role.title.toLowerCase()} handles`}
              intro="The four responsibilities below are the role's standard remit. Anything adjacent can be folded in once we understand your workflow."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {role.capabilities.map((cap, i) => (
              <Reveal key={cap} delay={i * 0.06}>
                <div className="h-full rounded-xl border border-border bg-white p-6 shadow-soft">
                  <span className="font-display text-sm font-bold text-gold-dark">
                    0{i + 1}
                  </span>
                  <p className="mt-3 text-base font-semibold leading-snug text-navy">
                    {cap}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-muted/50">
        <div className="container grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Is This You?"
              title="Firms that hire this role"
            />
            <ul className="mt-8 space-y-4">
              {role.whoFor.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-relaxed text-ink-muted">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {service && (
            <div className="rounded-2xl border border-border bg-white p-8 shadow-soft">
              <p className="eyebrow">Related Service</p>
              <h2 className="mt-3 text-2xl">{service.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {service.teaser}
              </p>
              <p className="mt-6 text-sm leading-relaxed text-ink-muted">
                Prefer to send work out as a project rather than bring someone
                on? The same scope is available as a managed service.
              </p>
              <Link
                href={`/services/${service.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy"
              >
                View {service.title}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Workflow />

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Other Roles" title="Also available" />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/hire/${other.slug}`}
                className="group rounded-xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
              >
                <span className="block font-display text-base font-bold text-navy">
                  {other.title}
                </span>
                <span className="mt-2 block text-sm leading-snug text-ink-muted">
                  {other.teaser}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection items={faqs.slice(0, 5)} />
      <DisclaimerBand />
      <CTA
        title={`Ready to add a ${role.title.toLowerCase()}?`}
        body="Tell us about the work and your review standards. We will propose a candidate profile, an engagement model and a pilot you can judge us on."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

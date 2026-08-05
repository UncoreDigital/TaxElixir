import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { ArrowLeft } from "lucide-react";
import CTA from "@/components/sections/CTA";
import { getResourceBySlug, getResources } from "@/lib/resources";
import { features, site } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  // No params while the Resources group is parked — every one of these routes
  // 404s, and prerendering them would build pages nothing can reach.
  if (!features.resources) return [];

  const studies = await getResources("case_study");
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const study = await getResourceBySlug(params.slug);
  if (!study || study.kind !== "case_study") return { title: "Case study not found" };

  return {
    title: study.meta_title || study.title,
    description: study.meta_description || study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      type: "article",
      title: study.meta_title || study.title,
      description: study.meta_description || study.summary,
      url: `${site.url}/case-studies/${study.slug}`,
      images: study.cover_url ? [{ url: study.cover_url }] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  // Parked with the rest of the Resources group — see features.resources.
  if (!features.resources) notFound();

  const study = await getResourceBySlug(params.slug);
  if (!study || study.kind !== "case_study") notFound();

  const safeHtml = DOMPurify.sanitize(study.content, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"],
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Case Studies", item: `${site.url}/case-studies` },
      { "@type": "ListItem", position: 3, name: study.title, item: `${site.url}/case-studies/${study.slug}` },
    ],
  };

  return (
    <>
      <article>
        <header className="bg-gradient-navy">
          <div className="container max-w-3xl py-16 md:py-20">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All case studies
            </Link>

            <p className="eyebrow mt-8 text-gold-light">
              {study.client_name ?? "Anonymised"}
              {study.industry ? ` · ${study.industry}` : ""}
            </p>
            <h1 className="mt-4 text-3xl leading-[1.15] text-white md:text-4xl">
              {study.title}
            </h1>
            <span className="rule-gold mt-6" aria-hidden="true" />

            {study.outcome && (
              <p className="mt-6 font-display text-3xl font-bold text-gradient-gold">
                {study.outcome}
              </p>
            )}
          </div>
        </header>

        {study.cover_url && (
          <div className="container max-w-4xl">
            <div className="relative -mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted shadow-card">
              <Image
                src={study.cover_url}
                alt={study.cover_alt ?? ""}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <div className="container max-w-3xl py-14 md:py-20">
          {study.summary && (
            <p className="mb-10 border-l-2 border-gold pl-5 text-lg leading-relaxed text-ink">
              {study.summary}
            </p>
          )}
          <div className="prose-brand" dangerouslySetInnerHTML={{ __html: safeHtml }} />
        </div>
      </article>
      <CTA
        title="Want the same arrangement for your firm?"
        body="Tell us what work you would move first. We will propose a pilot you can judge us on before anything scales."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

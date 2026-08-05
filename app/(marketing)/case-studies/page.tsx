import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2 } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import CoverFallback from "@/components/CoverFallback";
import CTA from "@/components/sections/CTA";
import Placeholder from "@/components/Placeholder";
import { getResources } from "@/lib/resources";
import { features } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "How US CPA firms use TaxElixir in practice — what they moved offshore, how the engagement was structured, and what changed.",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesPage() {
  // Parked with the rest of the Resources group — see features.resources. The
  // client-success figures the client asked to lead with now live on /about.
  if (!features.resources) notFound();

  const studies = await getResources("case_study");

  return (
    <>
      <PageBanner
        eyebrow="Case Studies"
        title="How firms actually use us"
        crumbs={[{ name: "Case Studies" }]}
        intro="What each firm moved offshore, how the engagement was structured, and what changed as a result. Anonymised where the client preferred it."
      />

      <section className="section">
        <div className="container">
          {studies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-14 text-center">
              <Building2 className="mx-auto h-9 w-9 text-border" aria-hidden="true" />
              <h2 className="mt-5 text-2xl">No case studies published yet</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                Case studies written in the admin panel appear here as soon as
                they are published. Even one anonymised study — &ldquo;a
                twelve-partner firm in Ohio&rdquo; — is enough to start.
              </p>
              <Placeholder label="client to supply: at least one case study" className="mt-5" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {studies.map((study) => (
                <Link
                  key={study.id}
                  href={`/case-studies/${study.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {study.cover_url ? (
                      <Image
                        src={study.cover_url}
                        alt={study.cover_alt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <CoverFallback label={study.industry ?? "Case Study"} />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    {study.outcome && (
                      <p className="font-display text-2xl font-bold text-gradient-gold">
                        {study.outcome}
                      </p>
                    )}
                    <h2 className="mt-3 text-xl leading-snug">{study.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                      {study.summary}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        {study.client_name ?? "Anonymised"}
                        {study.industry ? ` · ${study.industry}` : ""}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}

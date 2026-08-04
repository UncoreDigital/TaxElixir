import type { Metadata } from "next";
import Image from "next/image";
import { BookMarked, Download, Lock } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import CoverFallback from "@/components/CoverFallback";
import CTA from "@/components/sections/CTA";
import Placeholder from "@/components/Placeholder";
import GuideDownloadButton from "@/components/GuideDownloadButton";
import { getResources } from "@/lib/resources";
import { features } from "@/lib/site";
import { notFound } from "next/navigation";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Free Guides & Ebooks",
  description:
    "Free downloads for US CPA firm owners — practical guides on capacity planning, offshore onboarding, busy-season workflow and back year engagements.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage() {
  // Parked, not deleted — see features.guides. 404s rather than rendering an
  // empty shelf, and the sitemap drops the URL to match.
  if (!features.guides) notFound();

  const guides = await getResources("guide");

  return (
    <>
      <PageBanner
        eyebrow="Free Guides & Ebooks"
        title="Downloads worth the email address"
        crumbs={[{ name: "Guides & Ebooks" }]}
        intro="Practical material for firm owners weighing up capacity, offshore delivery and busy-season workflow. No drip sequence, no sales call unless you ask for one."
      />

      <section className="section">
        <div className="container">
          {guides.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-14 text-center">
              <BookMarked className="mx-auto h-9 w-9 text-border" aria-hidden="true" />
              <h2 className="mt-5 text-2xl">No guides published yet</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                Guides uploaded in the admin panel appear here. Gated downloads
                capture the requester&rsquo;s details into the Leads area; ungated
                ones download straight away.
              </p>
              <Placeholder label="client to supply: guides / ebooks" className="mt-5" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <article
                  key={guide.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-soft"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {guide.cover_url ? (
                      <Image
                        src={guide.cover_url}
                        alt={guide.cover_alt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <CoverFallback label="Guide" />
                    )}
                    {guide.gated && (
                      <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-navy/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-light">
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        Email required
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-lg leading-snug">{guide.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                      {guide.summary}
                    </p>

                    <div className="mt-6">
                      {guide.file_url ? (
                        <GuideDownloadButton
                          resourceId={guide.id}
                          title={guide.title}
                          fileUrl={guide.file_url}
                          gated={guide.gated}
                        />
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
                          <Download className="h-4 w-4" aria-hidden="true" />
                          File not attached yet
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}

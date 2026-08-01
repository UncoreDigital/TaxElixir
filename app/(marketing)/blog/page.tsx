import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import CoverFallback from "@/components/CoverFallback";
import CTA from "@/components/sections/CTA";
import { getPublishedPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Insights for US CPA Firms",
  description:
    "Practical writing for CPA firm owners on capacity, offshore delivery, tax season workflow, back year engagements and audit support.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageBanner
        eyebrow="Insights"
        title="Writing for firm owners, not for search engines"
        crumbs={[{ name: "Insights" }]}
        intro="Notes on capacity, delivery and the practical mechanics of outsourcing — written by the people who do the work."
      />

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-14 text-center">
              <h2 className="text-2xl">No articles published yet</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                Articles written in the admin panel appear here as soon as they
                are published. In the meantime, our{" "}
                <Link href="/faqs" className="text-navy underline decoration-gold/60 underline-offset-2">
                  FAQs
                </Link>{" "}
                answer most of what firms ask us.
              </p>
            </div>
          ) : (
            <>
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid gap-8 overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all hover:shadow-card md:grid-cols-2"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted md:aspect-auto md:h-full">
                    {featured.cover_url ? (
                      <Image
                        src={featured.cover_url}
                        alt={featured.cover_alt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        priority
                      />
                    ) : (
                      <CoverFallback label={featured.category} />
                    )}
                  </div>

                  <div className="flex flex-col justify-center p-8 md:py-12 md:pr-12">
                    <p className="eyebrow">
                      {featured.category} · {featured.published_at ? formatDate(featured.published_at) : ""}
                    </p>
                    <h2 className="mt-4 text-2xl leading-snug md:text-3xl">{featured.title}</h2>
                    <p className="mt-4 text-sm leading-relaxed text-ink-muted">{featured.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                      Read article
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                        {post.cover_url ? (
                          <Image
                            src={post.cover_url}
                            alt={post.cover_alt ?? ""}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <CoverFallback label={post.category} />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className="eyebrow">
                          {post.category} · {post.published_at ? formatDate(post.published_at) : ""}
                        </p>
                        <h2 className="mt-3 text-lg leading-snug">{post.title}</h2>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CTA />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import PostCard from "@/components/PostCard";
import CTA from "@/components/sections/CTA";
import { getPublishedPosts } from "@/lib/posts";
import { features } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Insights for US CPA Firms",
  description:
    "Practical writing for CPA firm owners on capacity, offshore delivery, tax season workflow, back year engagements and audit support.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  // See features.blog. Parked, it 404s rather than rendering an empty shelf, and
  // the sitemap drops the URL to match.
  if (!features.blog) notFound();

  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageBanner
        eyebrow="Insights"
        title="Writing for firm owners, not for search engines"
        crumbs={[{ name: "Insights" }]}
        intro="Notes on capacity, delivery and the practical mechanics of outsourcing, written by the people who do the work."
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
              {featured && <PostCard post={featured} variant="featured" priority />}

              {rest.length > 0 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} />
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

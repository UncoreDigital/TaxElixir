import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PostCard from "@/components/PostCard";
import SectionHeading from "@/components/SectionHeading";
import { getPublishedPosts } from "@/lib/posts";
import { features } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The three most recent articles, on the homepage.
 *
 * Renders nothing at all with no published articles — the same rule as
 * Testimonials. An "articles coming soon" block on the homepage is the empty
 * shelf the blog was parked to avoid in the first place.
 *
 * The layout follows the count rather than assuming three. One article gets the
 * wide plate, because a single card in a three-column grid reads as two that
 * failed to load. The "All insights" link waits for a second article for the
 * same reason: beside one, it leads to a page showing that one again.
 *
 * Fresh without a deploy: the marketing tree is ISR, and saving an article in
 * the admin purges it (lib/revalidate.ts), so a publish reaches this block as
 * soon as it reaches /blog.
 */
export default async function LatestInsights() {
  if (!features.blog) return null;

  const posts = await getPublishedPosts(3);
  if (posts.length === 0) return null;

  return (
    <section className="section bg-muted/50">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Insights"
            title="Latest writing for CPA firm owners"
            intro="Notes on capacity, delivery and the practical mechanics of outsourcing."
          />

          {posts.length > 1 && (
            <Link
              href="/blog"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-navy"
            >
              All insights
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>

        {posts.length === 1 ? (
          <div className="mt-12">
            <PostCard post={posts[0]} variant="featured" as="h3" />
          </div>
        ) : (
          <div
            className={cn(
              "mt-12 grid gap-6 md:grid-cols-2",
              posts.length > 2 && "lg:grid-cols-3"
            )}
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} as="h3" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

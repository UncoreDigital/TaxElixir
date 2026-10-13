import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CoverFallback from "@/components/CoverFallback";
import type { Post } from "@/lib/supabase/types";
import { cn, formatDate } from "@/lib/utils";

/**
 * One article, as a link to it.
 *
 * This was inline markup on /blog until the homepage needed the same two cards.
 * It is shared rather than copied so an article cannot look one way on the
 * index and another on the homepage.
 *
 * `featured` is the wide two-column plate — the lead article on /blog, and the
 * homepage block when there is only one article to show. `grid` is the stacked
 * card used everywhere there are several.
 *
 * `as` exists because the heading level depends on the page, not the card: on
 * /blog the titles are <h2> under the banner's <h1>; on the homepage they sit
 * under a section <h2> and have to be <h3>.
 */
export default function PostCard({
  post,
  variant = "grid",
  as: Tag = "h2",
  priority = false,
}: {
  post: Post;
  variant?: "featured" | "grid";
  as?: "h2" | "h3";
  /** Only for a cover that is above the fold on first paint. */
  priority?: boolean;
}) {
  const featured = variant === "featured";
  const meta = [post.category, post.published_at ? formatDate(post.published_at) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group overflow-hidden border border-border bg-white shadow-soft transition-all hover:shadow-card",
        featured
          ? "grid gap-8 rounded-2xl md:grid-cols-2"
          : "flex flex-col rounded-xl hover:-translate-y-0.5 hover:border-gold/40"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          featured ? "aspect-[16/10] md:aspect-auto md:h-full" : "aspect-[16/9]"
        )}
      >
        {post.cover_url ? (
          <Image
            src={post.cover_url}
            alt={post.cover_alt ?? ""}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={priority}
          />
        ) : (
          <CoverFallback label={post.category} />
        )}
      </div>

      {featured ? (
        <div className="flex flex-col justify-center p-8 md:py-12 md:pr-12">
          <p className="eyebrow">{meta}</p>
          <Tag className="mt-4 text-2xl leading-snug md:text-3xl">{post.title}</Tag>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
            Read article
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      ) : (
        <div className="flex flex-1 flex-col p-6">
          <p className="eyebrow">{meta}</p>
          <Tag className="mt-3 text-lg leading-snug">{post.title}</Tag>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
        </div>
      )}
    </Link>
  );
}

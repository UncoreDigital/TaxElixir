import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { ArrowLeft } from "lucide-react";
import CTA from "@/components/sections/CTA";
import DisclaimerBand from "@/components/DisclaimerBand";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { formatDate, readingTime } from "@/lib/utils";
import { site } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [post.author],
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  // Editor output is sanitised at render, not only on save — a stored payload
  // from before a rule change must never execute.
  const safeHtml = DOMPurify.sanitize(post.content, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"],
  });

  const related = (await getPublishedPosts(4)).filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@id": `${site.url}/#organization` },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    ...(post.cover_url ? { image: post.cover_url } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${site.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${site.url}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <article>
        <header className="bg-gradient-navy">
          <div className="container max-w-3xl py-16 md:py-20">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All insights
            </Link>

            <p className="eyebrow mt-8 text-gold-light">{post.category}</p>
            <h1 className="mt-4 text-3xl leading-[1.15] text-white md:text-4xl">
              {post.title}
            </h1>
            <span className="rule-gold mt-6" aria-hidden="true" />

            <p className="mt-6 text-sm text-white/60">
              {post.author}
              {post.published_at && <> · {formatDate(post.published_at)}</>}
              {" · "}
              {readingTime(post.content)} min read
            </p>
          </div>
        </header>

        {post.cover_url && (
          <div className="container max-w-4xl">
            <div className="relative -mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted shadow-card">
              <Image
                src={post.cover_url}
                alt={post.cover_alt ?? ""}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <div className="container max-w-3xl py-14 md:py-20">
          {post.excerpt && (
            <p className="mb-10 border-l-2 border-gold pl-5 text-lg leading-relaxed text-ink">
              {post.excerpt}
            </p>
          )}
          <div className="prose-brand" dangerouslySetInnerHTML={{ __html: safeHtml }} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="section bg-muted/50">
          <div className="container">
            <h2 className="text-2xl">More insights</h2>
            <span className="rule-gold mt-4" aria-hidden="true" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="group rounded-xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
                >
                  <p className="eyebrow">{item.category}</p>
                  <h3 className="mt-3 text-base leading-snug">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{item.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <DisclaimerBand />
      <CTA />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  );
}

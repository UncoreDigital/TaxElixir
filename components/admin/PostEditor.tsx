"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { Post, PostStatus } from "@/lib/supabase/types";
import { postSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

// TipTap touches the DOM on mount; keep it out of the server bundle.
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[26rem] rounded-md border border-input bg-white p-5 text-sm text-ink-muted">
      Loading editor…
    </div>
  ),
});

const inputBase =
  "w-full rounded-md border border-input bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

const CATEGORIES = ["Insights", "Tax Season", "Offshore Delivery", "Audit", "Bookkeeping", "Firm Growth"];

export default function PostEditor({ post }: { post: Post | null }) {
  const router = useRouter();
  const supabase = createClient();
  const isNew = !post;

  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    category: post?.category ?? "Insights",
    author: post?.author ?? "TaxElixir",
    cover_url: post?.cover_url ?? "",
    cover_alt: post?.cover_alt ?? "",
    meta_title: post?.meta_title ?? "",
    meta_description: post?.meta_description ?? "",
    is_featured: post?.is_featured ?? false,
    status: (post?.status ?? "draft") as PostStatus,
  });

  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onTitleChange(title: string) {
    set("title", title);
    // Auto-slug only until the user edits the slug themselves — changing the
    // slug of a published post breaks its live URL.
    if (!slugTouched) set("slug", slugify(title));
  }

  async function save(nextStatus?: PostStatus) {
    setBusy(true);
    setFormError(null);
    setErrors({});

    const status = nextStatus ?? form.status;
    const candidate = { ...form, status, cover_url: form.cover_url || null };

    const parsed = postSchema.safeParse(candidate);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
      setFormError("Please fix the highlighted fields.");
      setBusy(false);
      return;
    }

    const payload = {
      ...parsed.data,
      cover_url: parsed.data.cover_url || null,
      cover_alt: parsed.data.cover_alt || null,
      meta_title: parsed.data.meta_title || null,
      meta_description: parsed.data.meta_description || null,
      // Stamp published_at on first publish and keep it stable afterwards.
      published_at:
        status === "published"
          ? post?.published_at ?? new Date().toISOString()
          : post?.published_at ?? null,
    };

    const { error } = isNew
      ? await supabase.from("posts").insert(payload)
      : await supabase.from("posts").update(payload).eq("id", post.id);

    if (error) {
      setFormError(
        error.code === "23505"
          ? "That slug is already used by another article."
          : error.message
      );
      setBusy(false);
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  const fieldError = (name: string) => errors[name]?.[0];

  return (
    <>
      <Link
        href="/admin/posts"
        className="mb-6 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All articles
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl md:text-3xl">{isNew ? "New article" : "Edit article"}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="md" onClick={() => save("draft")} disabled={busy}>
            Save as draft
          </Button>
          <Button variant="gold" size="md" onClick={() => save("published")} disabled={busy}>
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4" aria-hidden="true" />
            )}
            Publish
          </Button>
        </div>
      </div>

      {formError && (
        <p role="alert" className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-navy">
              Title <span className="text-gold-dark">*</span>
            </label>
            <input
              id="title" type="text" value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className={inputBase}
              placeholder="Why mid-year clean-up saves your busy season"
            />
            {fieldError("title") && <p className="mt-1.5 text-xs text-destructive">{fieldError("title")}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-navy">
              URL slug <span className="text-gold-dark">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-sm text-ink-muted">/blog/</span>
              <input
                id="slug" type="text" value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
                className={inputBase}
                placeholder="mid-year-cleanup-busy-season"
              />
            </div>
            {fieldError("slug") && <p className="mt-1.5 text-xs text-destructive">{fieldError("slug")}</p>}
            {!isNew && post?.status === "published" && (
              <p className="mt-1.5 text-xs text-amber-700">
                This article is live. Changing the slug breaks its existing URL and any links to it.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="excerpt" className="mb-1.5 block text-sm font-medium text-navy">
              Excerpt
            </label>
            <textarea
              id="excerpt" rows={3} value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              className={`${inputBase} resize-y`}
              placeholder="One or two sentences shown on the Insights index and in search results."
            />
            <p className="mt-1.5 text-xs text-ink-muted">{form.excerpt.length}/400</p>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-navy">Content</span>
            <RichTextEditor value={form.content} onChange={(html) => set("content", html)} />
          </div>
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="text-base">Publishing</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-navy">Category</label>
                <select
                  id="category" value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={inputBase}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="author" className="mb-1.5 block text-sm font-medium text-navy">Author</label>
                <input
                  id="author" type="text" value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  className={inputBase}
                />
              </div>

              <label className="flex items-center gap-2.5 text-sm text-ink">
                <input
                  type="checkbox" checked={form.is_featured}
                  onChange={(e) => set("is_featured", e.target.checked)}
                  className="h-4 w-4 rounded border-input text-navy focus:ring-gold"
                />
                Feature at the top of Insights
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="text-base">Cover image</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="cover_url" className="mb-1.5 block text-sm font-medium text-navy">Image URL</label>
                <input
                  id="cover_url" type="url" value={form.cover_url}
                  onChange={(e) => set("cover_url", e.target.value)}
                  className={inputBase}
                  placeholder="https://…/cover.jpg"
                />
                {fieldError("cover_url") && <p className="mt-1.5 text-xs text-destructive">{fieldError("cover_url")}</p>}
              </div>
              <div>
                <label htmlFor="cover_alt" className="mb-1.5 block text-sm font-medium text-navy">
                  Alt text
                </label>
                <input
                  id="cover_alt" type="text" value={form.cover_alt}
                  onChange={(e) => set("cover_alt", e.target.value)}
                  className={inputBase}
                  placeholder="Describe the image for screen readers"
                />
                <p className="mt-1.5 text-xs text-ink-muted">
                  Leave empty only if the image is purely decorative.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="text-base">Search appearance</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="meta_title" className="mb-1.5 block text-sm font-medium text-navy">
                  Meta title
                </label>
                <input
                  id="meta_title" type="text" value={form.meta_title}
                  onChange={(e) => set("meta_title", e.target.value)}
                  className={inputBase}
                  placeholder="Defaults to the article title"
                />
                <p className="mt-1.5 text-xs text-ink-muted">{form.meta_title.length}/70</p>
              </div>
              <div>
                <label htmlFor="meta_description" className="mb-1.5 block text-sm font-medium text-navy">
                  Meta description
                </label>
                <textarea
                  id="meta_description" rows={3} value={form.meta_description}
                  onChange={(e) => set("meta_description", e.target.value)}
                  className={`${inputBase} resize-y`}
                  placeholder="Defaults to the excerpt"
                />
                <p className="mt-1.5 text-xs text-ink-muted">{form.meta_description.length}/165</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

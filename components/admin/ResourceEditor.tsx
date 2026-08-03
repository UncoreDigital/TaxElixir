"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import MediaUpload from "@/components/admin/MediaUpload";
import { createClient } from "@/lib/supabase/client";
import type { Resource, ResourceKind, PostStatus } from "@/lib/supabase/types";
import { slugify } from "@/lib/utils";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[22rem] rounded-md border border-input bg-white p-5 text-sm text-ink-muted">
      Loading editor…
    </div>
  ),
});

const inputBase =
  "w-full rounded-md border border-input bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

const KINDS: { value: ResourceKind; label: string; hint: string }[] = [
  { value: "case_study", label: "Case Study", hint: "Appears on /case-studies with its own page" },
  { value: "event", label: "Event / Webinar", hint: "Sorts into Upcoming or Past by its date" },
  { value: "guide", label: "Guide / Ebook", hint: "Appears on /guides with a download" },
];

export default function ResourceEditor({ resource }: { resource: Resource | null }) {
  const router = useRouter();
  const supabase = createClient();
  const isNew = !resource;

  const [form, setForm] = useState({
    kind: (resource?.kind ?? "case_study") as ResourceKind,
    title: resource?.title ?? "",
    slug: resource?.slug ?? "",
    summary: resource?.summary ?? "",
    content: resource?.content ?? "",
    cover_url: resource?.cover_url ?? "",
    cover_alt: resource?.cover_alt ?? "",
    client_name: resource?.client_name ?? "",
    industry: resource?.industry ?? "",
    outcome: resource?.outcome ?? "",
    starts_at: resource?.starts_at ? resource.starts_at.slice(0, 16) : "",
    location: resource?.location ?? "",
    registration_url: resource?.registration_url ?? "",
    file_url: resource?.file_url ?? "",
    gated: resource?.gated ?? false,
    meta_title: resource?.meta_title ?? "",
    meta_description: resource?.meta_description ?? "",
    is_featured: resource?.is_featured ?? false,
    status: (resource?.status ?? "draft") as PostStatus,
  });

  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onTitleChange(title: string) {
    set("title", title);
    if (!slugTouched) set("slug", slugify(title));
  }

  async function save(nextStatus?: PostStatus) {
    setBusy(true);
    setError(null);

    const status = nextStatus ?? form.status;

    if (!form.title.trim() || !form.slug.trim()) {
      setError("Title and slug are both required.");
      setBusy(false);
      return;
    }

    const payload = {
      kind: form.kind,
      title: form.title.trim(),
      slug: form.slug.trim(),
      summary: form.summary,
      content: form.content,
      cover_url: form.cover_url || null,
      cover_alt: form.cover_alt || null,
      client_name: form.kind === "case_study" ? form.client_name || null : null,
      industry: form.kind === "case_study" ? form.industry || null : null,
      outcome: form.kind === "case_study" ? form.outcome || null : null,
      starts_at: form.kind === "event" && form.starts_at ? new Date(form.starts_at).toISOString() : null,
      location: form.kind === "event" ? form.location || null : null,
      registration_url: form.kind === "event" ? form.registration_url || null : null,
      file_url: form.kind === "guide" ? form.file_url || null : null,
      gated: form.kind === "guide" ? form.gated : false,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      is_featured: form.is_featured,
      status,
      published_at:
        status === "published"
          ? resource?.published_at ?? new Date().toISOString()
          : resource?.published_at ?? null,
    };

    const { error: saveError } = isNew
      ? await supabase.from("resources").insert(payload)
      : await supabase.from("resources").update(payload).eq("id", resource.id);

    if (saveError) {
      setError(
        saveError.code === "23505"
          ? "That slug is already used by another resource."
          : saveError.message
      );
      setBusy(false);
      return;
    }

    router.push("/admin/resources");
    router.refresh();
  }

  return (
    <>
      <Link
        href="/admin/resources"
        className="mb-6 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All resources
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl md:text-3xl">{isNew ? "New resource" : "Edit resource"}</h1>
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

      {error && (
        <p role="alert" className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-navy">Type</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {KINDS.map((k) => (
                <label
                  key={k.value}
                  className={`cursor-pointer rounded-lg border p-3 text-sm transition-colors ${
                    form.kind === k.value
                      ? "border-gold bg-gold/10"
                      : "border-border bg-white hover:border-gold/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="kind"
                    value={k.value}
                    checked={form.kind === k.value}
                    onChange={() => set("kind", k.value)}
                    className="sr-only"
                  />
                  <span className="block font-semibold text-navy">{k.label}</span>
                  <span className="mt-1 block text-xs leading-snug text-ink-muted">{k.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="r-title" className="mb-1.5 block text-sm font-medium text-navy">
              Title <span className="text-gold-dark">*</span>
            </label>
            <input id="r-title" type="text" value={form.title} onChange={(e) => onTitleChange(e.target.value)} className={inputBase} />
          </div>

          <div>
            <label htmlFor="r-slug" className="mb-1.5 block text-sm font-medium text-navy">
              URL slug <span className="text-gold-dark">*</span>
            </label>
            <input
              id="r-slug" type="text" value={form.slug}
              onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }}
              className={inputBase}
            />
          </div>

          <div>
            <label htmlFor="r-summary" className="mb-1.5 block text-sm font-medium text-navy">Summary</label>
            <textarea id="r-summary" rows={3} value={form.summary} onChange={(e) => set("summary", e.target.value)} className={`${inputBase} resize-y`} />
          </div>

          {form.kind !== "guide" && (
            <div>
              <span className="mb-1.5 block text-sm font-medium text-navy">Content</span>
              <RichTextEditor value={form.content} onChange={(html) => set("content", html)} />
            </div>
          )}
        </div>

        <aside className="space-y-5">
          {form.kind === "case_study" && (
            <section className="rounded-xl border border-border bg-white p-5">
              <h2 className="text-base">Case study details</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="r-client" className="mb-1.5 block text-sm font-medium text-navy">Client firm</label>
                  <input id="r-client" type="text" value={form.client_name} onChange={(e) => set("client_name", e.target.value)} className={inputBase} placeholder="Leave empty to anonymise" />
                  <p className="mt-1.5 text-xs text-ink-muted">Empty shows as &ldquo;Anonymised&rdquo;.</p>
                </div>
                <div>
                  <label htmlFor="r-industry" className="mb-1.5 block text-sm font-medium text-navy">Industry / firm size</label>
                  <input id="r-industry" type="text" value={form.industry} onChange={(e) => set("industry", e.target.value)} className={inputBase} placeholder="12-partner firm, Ohio" />
                </div>
                <div>
                  <label htmlFor="r-outcome" className="mb-1.5 block text-sm font-medium text-navy">Headline outcome</label>
                  <input id="r-outcome" type="text" value={form.outcome} onChange={(e) => set("outcome", e.target.value)} className={inputBase} placeholder="400 returns absorbed in one season" />
                </div>
              </div>
            </section>
          )}

          {form.kind === "event" && (
            <section className="rounded-xl border border-border bg-white p-5">
              <h2 className="text-base">Event details</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="r-starts" className="mb-1.5 block text-sm font-medium text-navy">Date &amp; time</label>
                  <input id="r-starts" type="datetime-local" value={form.starts_at} onChange={(e) => set("starts_at", e.target.value)} className={inputBase} />
                  <p className="mt-1.5 text-xs text-ink-muted">Past dates move to &ldquo;Past sessions&rdquo; automatically.</p>
                </div>
                <div>
                  <label htmlFor="r-location" className="mb-1.5 block text-sm font-medium text-navy">Location</label>
                  <input id="r-location" type="text" value={form.location} onChange={(e) => set("location", e.target.value)} className={inputBase} placeholder="Leave empty for online" />
                </div>
                <div>
                  <label htmlFor="r-reg" className="mb-1.5 block text-sm font-medium text-navy">Registration / recording URL</label>
                  <input id="r-reg" type="url" value={form.registration_url} onChange={(e) => set("registration_url", e.target.value)} className={inputBase} />
                </div>
              </div>
            </section>
          )}

          {form.kind === "guide" && (
            <section className="rounded-xl border border-border bg-white p-5">
              <h2 className="text-base">Download</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-navy">Guide file</span>
                  <MediaUpload
                    value={form.file_url}
                    onChange={(url) => set("file_url", url)}
                    bucket="resource-files"
                    accept="application/pdf"
                    kind="file"
                    hint="PDF"
                  />
                </div>
                <label className="flex items-start gap-2.5 text-sm text-ink">
                  <input type="checkbox" checked={form.gated} onChange={(e) => set("gated", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-input text-navy focus:ring-gold" />
                  <span>
                    Require name and email first
                    <span className="mt-0.5 block text-xs text-ink-muted">Captured into Guide downloads.</span>
                  </span>
                </label>
              </div>
            </section>
          )}

          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="text-base">Cover image</h2>
            <div className="mt-4 space-y-4">
              <div>
                <span className="mb-1.5 block text-sm font-medium text-navy">Image</span>
                <MediaUpload
                  value={form.cover_url}
                  onChange={(url) => set("cover_url", url)}
                  bucket="post-media"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  kind="image"
                />
                <p className="mt-1.5 text-xs text-ink-muted">Empty falls back to a branded plate.</p>
              </div>
              <div>
                <label htmlFor="r-alt" className="mb-1.5 block text-sm font-medium text-navy">Alt text</label>
                <input id="r-alt" type="text" value={form.cover_alt} onChange={(e) => set("cover_alt", e.target.value)} className={inputBase} />
              </div>
              <label className="flex items-center gap-2.5 text-sm text-ink">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} className="h-4 w-4 rounded border-input text-navy focus:ring-gold" />
                Feature this item
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="text-base">Search appearance</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="r-mt" className="mb-1.5 block text-sm font-medium text-navy">Meta title</label>
                <input id="r-mt" type="text" value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)} className={inputBase} placeholder="Defaults to the title" />
              </div>
              <div>
                <label htmlFor="r-md" className="mb-1.5 block text-sm font-medium text-navy">Meta description</label>
                <textarea id="r-md" rows={3} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} className={`${inputBase} resize-y`} placeholder="Defaults to the summary" />
              </div>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

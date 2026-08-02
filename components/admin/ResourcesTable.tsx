"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Resource, ResourceKind } from "@/lib/supabase/types";
import { cn, formatDate } from "@/lib/utils";

const KIND_LABEL: Record<ResourceKind, string> = {
  case_study: "Case Study",
  event: "Event",
  guide: "Guide",
};

const KIND_PATH: Record<ResourceKind, string> = {
  case_study: "/case-studies",
  event: "/events",
  guide: "/guides",
};

export default function ResourcesTable({
  initialResources,
}: {
  initialResources: Resource[];
}) {
  const supabase = createClient();
  const [items, setItems] = useState(initialResources);
  const [filter, setFilter] = useState<ResourceKind | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((r) => r.kind === filter)),
    [items, filter]
  );

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const previous = items;
    setItems((prev) => prev.filter((r) => r.id !== id));
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) {
      console.error("[resources] delete failed:", error.message);
      setItems(previous);
    }
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", "case_study", "event", "guide"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              filter === k
                ? "border-navy bg-navy text-white"
                : "border-border bg-white text-ink-muted hover:border-gold/50"
            )}
          >
            {k === "all" ? "All" : KIND_LABEL[k]}
            <span className="ml-1.5 opacity-60">
              {k === "all" ? items.length : items.filter((r) => r.kind === k).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <h2 className="text-lg">Nothing here yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
            Case studies, events and guides you add appear on the public site as
            soon as they are published.
          </p>
          <Link
            href="/admin/resources/new"
            className="mt-5 inline-block text-sm font-semibold text-navy underline underline-offset-4"
          >
            Add the first one
          </Link>
        </div>
      ) : (
        <div className="scroll-x">
          <table className="w-full min-w-[52rem] overflow-hidden rounded-xl border border-border bg-white text-left">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Title</th>
                <th scope="col" className="px-5 py-3 font-semibold">Type</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="text-sm">
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-2 font-medium text-navy">
                      {item.is_featured && (
                        <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-label="Featured" />
                      )}
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-muted">
                      {KIND_PATH[item.kind]}/{item.slug}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-muted">{KIND_LABEL[item.kind]}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                        item.status === "published"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-border bg-muted text-ink-muted"
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-muted">
                    {item.kind === "event"
                      ? item.starts_at
                        ? formatDate(item.starts_at)
                        : "—"
                      : item.published_at
                        ? formatDate(item.published_at)
                        : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {item.status === "published" && item.kind === "case_study" && (
                        <a
                          href={`/case-studies/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`View ${item.title} on the live site`}
                          className="rounded p-1.5 text-ink-muted transition-colors hover:text-navy"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Link
                        href={`/admin/resources/${item.id}`}
                        aria-label={`Edit ${item.title}`}
                        className="rounded p-1.5 text-ink-muted transition-colors hover:text-navy"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(item.id, item.title)}
                        aria-label={`Delete ${item.title}`}
                        className="rounded p-1.5 text-ink-muted transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

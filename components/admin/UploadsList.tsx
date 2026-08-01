"use client";

import { useState } from "react";
import { ChevronDown, Download, FileText, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { DocumentSubmission, UploadStatus } from "@/lib/supabase/types";
import { cn, formatDate } from "@/lib/utils";

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const statusStyle: Record<UploadStatus, string> = {
  new: "bg-gold/20 text-gold-dark border-gold/40",
  downloaded: "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived: "bg-muted text-ink-muted border-border",
};

export default function UploadsList({
  initialSubmissions,
}: {
  initialSubmissions: DocumentSubmission[];
}) {
  const supabase = createClient();
  const [items, setItems] = useState(initialSubmissions);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function download(path: string, filename: string, submissionId: string) {
    setDownloading(path);
    setError(null);
    try {
      const res = await fetch("/api/admin/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not generate link.");

      const link = document.createElement("a");
      link.href = json.url;
      link.download = filename;
      link.rel = "noopener";
      link.click();

      // Mark as downloaded so the team can see what has been collected.
      const target = items.find((i) => i.id === submissionId);
      if (target && target.status === "new") {
        await supabase.from("document_submissions").update({ status: "downloaded" }).eq("id", submissionId);
        setItems((prev) =>
          prev.map((i) => (i.id === submissionId ? { ...i, status: "downloaded" as UploadStatus } : i))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setDownloading(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this submission record? The stored files are not removed by this action.")) return;
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== id));
    const { error: deleteError } = await supabase.from("document_submissions").delete().eq("id", id);
    if (deleteError) {
      console.error("[uploads] delete failed:", deleteError.message);
      setItems(previous);
    }
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-sm text-ink-muted">
        No documents have been submitted yet.
      </p>
    );
  }

  return (
    <>
      {error && (
        <p role="alert" className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <ul className="divide-y divide-border">
          {items.map((item) => {
            const isOpen = expanded === item.id;
            const files = Array.isArray(item.files) ? item.files : [];

            return (
              <li key={item.id}>
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <ChevronDown
                      className={cn("h-4 w-4 shrink-0 text-ink-muted transition-transform", isOpen && "rotate-180")}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-navy">
                        {item.name}
                        {item.company && <span className="font-normal text-ink-muted"> · {item.company}</span>}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-ink-muted">
                        {files.length} file{files.length === 1 ? "" : "s"} · {humanSize(item.total_size)} ·{" "}
                        {formatDate(item.created_at)}
                      </span>
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium capitalize",
                        statusStyle[item.status]
                      )}
                    >
                      {item.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={`Delete submission from ${item.name}`}
                      className="rounded p-1.5 text-ink-muted transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-border bg-muted/40 px-5 py-5 sm:pl-12">
                    <dl className="mb-5 grid gap-4 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Email</dt>
                        <dd className="mt-1">
                          <a href={`mailto:${item.email}`} className="text-navy underline underline-offset-2">
                            {item.email}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Phone</dt>
                        <dd className="mt-1 text-ink">{item.phone || "—"}</dd>
                      </div>
                      {item.notes && (
                        <div className="sm:col-span-2">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Notes</dt>
                          <dd className="mt-1 whitespace-pre-wrap leading-relaxed text-ink">{item.notes}</dd>
                        </div>
                      )}
                    </dl>

                    <ul className="space-y-2">
                      {files.map((file) => (
                        <li
                          key={file.path}
                          className="flex items-center justify-between gap-4 rounded-md border border-border bg-white px-4 py-2.5"
                        >
                          <span className="flex min-w-0 flex-1 items-center gap-2.5">
                            <FileText className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden="true" />
                            <span className="truncate text-sm text-ink">{file.name}</span>
                          </span>
                          <span className="shrink-0 text-xs text-ink-muted">{humanSize(file.size)}</span>
                          <button
                            type="button"
                            onClick={() => download(file.path, file.name, item.id)}
                            disabled={downloading === file.path}
                            className="flex shrink-0 items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold text-navy transition-colors hover:bg-muted disabled:opacity-50"
                          >
                            {downloading === file.path ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              <Download className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            Download
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

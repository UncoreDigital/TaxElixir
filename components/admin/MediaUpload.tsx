"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, ImageIcon, Loader2, Trash2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * Upload control for cover images and downloadable files.
 *
 * Three ways in, because people reach for different ones:
 *   - click to browse from the machine
 *   - drag a file onto the box
 *   - paste from the clipboard while the box has focus
 *
 * A URL field stays underneath. Uploading is the common path, but a client who
 * hosts assets elsewhere should not be forced to re-upload them here.
 *
 * Bucket limits mirror the migrations: post-media 10 MB, resource-files 25 MB.
 * They are checked before upload so the user gets a useful message instead of
 * an opaque storage error.
 */

const BUCKET_LIMITS: Record<string, number> = {
  "post-media": 10 * 1024 * 1024,
  "resource-files": 25 * 1024 * 1024,
};

/**
 * Mirrors `allowed_mime_types` on each bucket in the migrations. Checked here
 * because the `accept` attribute only constrains the file picker — a dropped or
 * pasted file bypasses it entirely, and the storage API's rejection message is
 * not something you would want to show a user.
 *
 * SVG is deliberately excluded even though post-media permits it: an SVG can
 * carry script, and there is no reason a cover image needs to be one.
 */
const BUCKET_TYPES: Record<string, string[]> = {
  "post-media": ["image/jpeg", "image/png", "image/webp", "image/avif"],
  "resource-files": ["application/pdf", "image/jpeg", "image/png", "image/webp"],
};

const friendlyTypes = (types: string[]) =>
  types.map((t) => t.split("/")[1].toUpperCase().replace("JPEG", "JPG")).join(", ");

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaUpload({
  value,
  onChange,
  bucket = "post-media",
  accept = "image/*",
  kind = "image",
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  bucket?: "post-media" | "resource-files";
  accept?: string;
  kind?: "image" | "file";
  hint?: string;
}) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  // Counter, not a boolean: dragging over a child fires dragleave on the parent,
  // which makes a boolean flicker the highlight on and off.
  const dragDepth = useRef(0);

  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const limit = BUCKET_LIMITS[bucket] ?? 10 * 1024 * 1024;

  const upload = useCallback(
    async (file: File) => {
      setError(null);

      const allowed = BUCKET_TYPES[bucket] ?? [];
      if (allowed.length && !allowed.includes(file.type)) {
        setError(
          `${file.type || "That file type"} is not accepted here. Use ${friendlyTypes(allowed)}.`
        );
        return;
      }
      if (file.size > limit) {
        setError(`${humanSize(file.size)} is over the ${humanSize(limit)} limit. Please compress it and try again.`);
        return;
      }

      setBusy(true);
      const ext = file.name.split(".").pop() ?? "bin";
      const safe = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(safe, file, { cacheControl: "31536000", upsert: false });

      if (uploadError || !data) {
        setError(uploadError?.message ?? "Upload failed.");
        setBusy(false);
        return;
      }

      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(data.path);
      if (pub?.publicUrl) {
        onChange(pub.publicUrl);
        setFileName(file.name);
      }
      setBusy(false);
    },
    [bucket, kind, limit, onChange, supabase]
  );

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  function onPaste(event: React.ClipboardEvent) {
    const item = Array.from(event.clipboardData.items).find((i) =>
      kind === "image" ? i.type.startsWith("image/") : i.kind === "file"
    );
    const file = item?.getAsFile();
    if (file) {
      event.preventDefault();
      upload(file);
    }
  }

  const isImage = kind === "image";

  return (
    <div className="space-y-3">
      {value ? (
        /* Filled state — preview with replace / remove */
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          {isImage ? (
            <div className="relative bg-slate-50">
              {/*
                Plain <img>, not next/image: an admin can paste a URL from any
                host, and next/image would reject anything not in remotePatterns.
              */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Selected cover preview"
                className="max-h-56 w-full object-contain"
                onError={() => setError("That URL did not load as an image.")}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <FileText className="h-5 w-5 shrink-0 text-gold-dark" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-sm text-ink">
                {fileName ?? value.split("/").pop()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-3 py-2">
            <span className="truncate text-xs text-ink-muted">{fileName ?? "Attached"}</span>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="rounded px-2.5 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-slate-200 disabled:opacity-50"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setFileName(null);
                  setError(null);
                }}
                aria-label="Remove"
                className="rounded p-1.5 text-ink-muted transition-colors hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state — the dropzone */
        <div
          role="button"
          tabIndex={0}
          onClick={() => !busy && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onPaste={onPaste}
          onDragEnter={(e) => {
            e.preventDefault();
            dragDepth.current += 1;
            setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            dragDepth.current -= 1;
            if (dragDepth.current <= 0) setDragging(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
            dragging
              ? "border-gold bg-gold/10"
              : "border-slate-200 bg-slate-50 hover:border-gold/50",
            busy && "pointer-events-none opacity-60"
          )}
        >
          {busy ? (
            <>
              <Loader2 className="h-7 w-7 animate-spin text-gold-dark" aria-hidden="true" />
              <p className="mt-3 text-sm text-ink-muted">Uploading…</p>
            </>
          ) : (
            <>
              {isImage ? (
                <ImageIcon className="h-7 w-7 text-gold-dark" aria-hidden="true" />
              ) : (
                <Upload className="h-7 w-7 text-gold-dark" aria-hidden="true" />
              )}
              <p className="mt-3 text-sm font-medium text-navy">
                {dragging ? "Drop to upload" : "Click to choose a file"}
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                or drag it here{isImage ? ", or paste from the clipboard" : ""}
              </p>
              <p className="mt-2 text-xs text-ink-muted">
                {hint ?? (isImage ? "JPG, PNG, WebP or AVIF" : "PDF")} · up to {humanSize(limit)}
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
        >
          <X className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Manual URL entry stays available for externally-hosted assets. */}
      <details className="group">
        <summary className="cursor-pointer list-none text-xs text-ink-muted underline underline-offset-2 hover:text-navy">
          Or paste a URL instead
        </summary>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          aria-label="Asset URL"
          className="mt-2 w-full rounded-md border border-input bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </details>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

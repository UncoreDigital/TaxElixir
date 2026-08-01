"use client";

import { useRef, useState } from "react";
import { CheckCircle2, FileUp, Loader2, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { uploadMetaSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

const MAX_FILE_BYTES = 50 * 1024 * 1024; // must not exceed the bucket limit
const MAX_FILES = 20;
const ACCEPT =
  ".pdf,.xls,.xlsx,.doc,.docx,.csv,.jpg,.jpeg,.png";

const inputBase =
  "w-full rounded-md border border-input bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DocumentUploadForm() {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    setError(null);

    const next = [...files];
    for (const file of Array.from(incoming)) {
      if (file.size > MAX_FILE_BYTES) {
        setError(`"${file.name}" is larger than ${humanSize(MAX_FILE_BYTES)} and was skipped.`);
        continue;
      }
      if (next.length >= MAX_FILES) {
        setError(`You can attach up to ${MAX_FILES} files per submission.`);
        break;
      }
      if (!next.some((f) => f.name === file.name && f.size === file.size)) {
        next.push(file);
      }
    }
    setFiles(next);
  }

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const meta = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      phone: String(form.get("phone") ?? ""),
      notes: String(form.get("notes") ?? ""),
    };

    const parsed = uploadMetaSchema.safeParse(meta);
    if (!parsed.success) {
      setError("Please check your name and email address.");
      return;
    }
    if (files.length === 0) {
      setError("Please attach at least one file.");
      return;
    }

    setState("uploading");
    setProgress(0);

    try {
      const stamp = Date.now();
      const folder = `${stamp}-${parsed.data.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
      const uploaded: { name: string; path: string; size: number; type: string }[] = [];

      for (const [i, file] of files.entries()) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${folder}/${i}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("client-documents")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw new Error(uploadError.message);

        uploaded.push({ name: file.name, path, size: file.size, type: file.type });
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      const { error: insertError } = await supabase.from("document_submissions").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company || null,
        phone: parsed.data.phone || null,
        notes: parsed.data.notes || null,
        files: uploaded,
        total_size: uploaded.reduce((sum, f) => sum + f.size, 0),
      });

      if (insertError) throw new Error(insertError.message);

      setState("done");
    } catch (err) {
      console.error("[upload]", err);
      setError(
        err instanceof Error
          ? `Upload failed: ${err.message}`
          : "Upload failed. Please try again or email us directly."
      );
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-gold/[0.06] p-10 text-center">
        <CheckCircle2 className="mx-auto h-11 w-11 text-gold-dark" aria-hidden="true" />
        <h2 className="mt-5 text-2xl">Documents received securely</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
          {files.length} file{files.length === 1 ? "" : "s"} uploaded to our private
          store. We will confirm by email shortly. Questions in the meantime:{" "}
          <a href={site.emailHref} className="font-medium text-navy underline decoration-gold/60 underline-offset-2">
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  const busy = state === "uploading";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="u-name" className="mb-1.5 block text-sm font-medium text-navy">
            Name <span className="text-gold-dark">*</span>
          </label>
          <input id="u-name" name="name" type="text" required className={inputBase} placeholder="Jane Whitfield" />
        </div>
        <div>
          <label htmlFor="u-email" className="mb-1.5 block text-sm font-medium text-navy">
            Work email <span className="text-gold-dark">*</span>
          </label>
          <input id="u-email" name="email" type="email" required className={inputBase} placeholder="jane@yourfirm.com" />
        </div>
        <div>
          <label htmlFor="u-company" className="mb-1.5 block text-sm font-medium text-navy">Firm name</label>
          <input id="u-company" name="company" type="text" className={inputBase} placeholder="Whitfield & Associates CPAs" />
        </div>
        <div>
          <label htmlFor="u-phone" className="mb-1.5 block text-sm font-medium text-navy">Phone</label>
          <input id="u-phone" name="phone" type="tel" className={inputBase} placeholder="+1 (555) 000-0000" />
        </div>
      </div>

      <div>
        <label htmlFor="u-notes" className="mb-1.5 block text-sm font-medium text-navy">
          What are these documents for?
        </label>
        <textarea id="u-notes" name="notes" rows={3} className={cn(inputBase, "resize-y")} placeholder="e.g. 2025 partnership returns for review, or prior-year records for a back year engagement." />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-navy">
          Files <span className="text-gold-dark">*</span>
        </span>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
          className="rounded-lg border-2 border-dashed border-input bg-muted/40 p-8 text-center transition-colors hover:border-gold/50"
        >
          <FileUp className="mx-auto h-8 w-8 text-gold-dark" aria-hidden="true" />
          <p className="mt-3 text-sm text-ink-muted">
            Drag files here, or{" "}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-semibold text-navy underline decoration-gold/60 underline-offset-2"
            >
              browse
            </button>
          </p>
          <p className="mt-1.5 text-xs text-ink-muted">
            PDF, Excel, Word, CSV or images · up to {humanSize(MAX_FILE_BYTES)} each · max {MAX_FILES} files
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center justify-between gap-4 rounded-md border border-border bg-white px-4 py-2.5"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-ink">{file.name}</span>
                <span className="shrink-0 text-xs text-ink-muted">{humanSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  disabled={busy}
                  aria-label={`Remove ${file.name}`}
                  className="shrink-0 rounded p-1 text-ink-muted hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {busy && (
        <div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-gold-x transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-ink-muted">Uploading… {progress}%</p>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <p className="flex items-start gap-2.5 rounded-md bg-muted/60 px-4 py-3 text-xs leading-relaxed text-ink-muted">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-dark" aria-hidden="true" />
        Files upload directly to a private, access-controlled store. They are not
        publicly readable and are never served from a shareable link.
      </p>

      <Button type="submit" variant="gold" size="lg" disabled={busy} className="w-full sm:w-auto">
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Uploading…
          </>
        ) : (
          "Upload securely"
        )}
      </Button>
    </form>
  );
}

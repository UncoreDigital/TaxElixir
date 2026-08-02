"use client";

import { useState } from "react";
import { Download, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

const inputBase =
  "w-full rounded-md border border-input bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

/**
 * Ungated guides download immediately. Gated ones capture name, email and firm
 * first — and the file still downloads even if the capture write fails, because
 * a broken CRM is our problem, not a reason to withhold a promised download.
 */
export default function GuideDownloadButton({
  resourceId,
  title,
  fileUrl,
  gated,
}: {
  resourceId: string;
  title: string;
  fileUrl: string;
  gated: boolean;
}) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  function startDownload() {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }

  if (!gated) {
    return (
      <Button variant="gold" size="md" onClick={startDownload} className="w-full">
        <Download className="h-4 w-4" aria-hidden="true" />
        Download
      </Button>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);

    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from("guide_downloads").insert({
      resource_id: resourceId,
      title,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? "") || null,
      phone: String(form.get("phone") ?? "") || null,
    });

    if (error) console.error("[guide download] capture failed:", error.message);

    setBusy(false);
    setOpen(false);
    startDownload();
  }

  return (
    <>
      <Button variant="gold" size="md" onClick={() => setOpen(true)} className="w-full">
        <Download className="h-4 w-4" aria-hidden="true" />
        Get the guide
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-lift">
            <div className="flex items-start justify-between gap-4">
              <h2 id="guide-dialog-title" className="text-xl leading-snug">
                {title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded p-1 text-ink-muted hover:text-navy"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-sm text-ink-muted">
              Tell us where to send it. We will not add you to a drip sequence.
            </p>

            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <input name="name" type="text" required placeholder="Name" className={inputBase} aria-label="Name" />
              <input name="email" type="email" required placeholder="Work email" className={inputBase} aria-label="Work email" />
              <input name="company" type="text" placeholder="Firm name" className={inputBase} aria-label="Firm name" />
              <input name="phone" type="tel" placeholder="Phone (optional)" className={inputBase} aria-label="Phone" />

              <Button type="submit" variant="gold" size="md" disabled={busy} className="w-full">
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Preparing…
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download now
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

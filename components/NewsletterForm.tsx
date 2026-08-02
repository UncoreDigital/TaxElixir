"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError(null);

    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          company: String(form.get("company") ?? ""),
          sourcePage: pathname,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Something went wrong.");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setError("We could not reach the server.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="flex items-center gap-2.5 rounded-lg border border-emerald/40 bg-emerald/10 px-4 py-3.5 text-sm text-white">
        <Check className="h-4 w-4 shrink-0 text-emerald-light" aria-hidden="true" />
        You&rsquo;re on the list. We send rarely and never sell your address.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Work email
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@yourfirm.com"
          aria-invalid={state === "error"}
          className="min-w-0 flex-1 rounded-md border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />

        {/* Honeypot */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="newsletter-company">Leave empty</label>
          <input id="newsletter-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <button
          type="submit"
          disabled={state === "sending"}
          data-cursor="grow"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-gradient-gold-x px-5 py-3 text-sm font-semibold text-navy transition-shadow hover:shadow-gold disabled:opacity-60"
        >
          {state === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <>
              Subscribe
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-rose-300">
          {error}
        </p>
      )}
      <p className="mt-2.5 text-xs text-white/45">
        Occasional notes on capacity and busy-season workflow. No drip sequence.
      </p>
    </form>
  );
}

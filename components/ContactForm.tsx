"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { serviceOptions } from "@/lib/validation";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<string, string[]>>;

const inputBase =
  "w-full rounded-md border border-input bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

export default function ContactForm() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);

  const toggleService = (value: string) =>
    setServices((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setErrors({});
    setFormError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? ""),
      website: String(form.get("website") ?? ""),
      consent: form.get("consent") === "on",
      services,
      sourcePage: pathname,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrors(json.issues ?? {});
        setFormError(json.error ?? "Something went wrong.");
        setState("error");
        return;
      }

      setState("sent");
    } catch {
      setFormError("We could not reach the server. Please email us directly.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-gold/[0.06] p-10 text-center">
        <CheckCircle2 className="mx-auto h-11 w-11 text-gold-dark" aria-hidden="true" />
        <h2 className="mt-5 text-2xl">Thank you — your message is with us</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
          Someone who actually does the work will reply, usually within one
          business day. If it is urgent, email{" "}
          <a href={site.emailHref} className="font-medium text-navy underline decoration-gold/60 underline-offset-2">
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  const fieldError = (name: string) => errors[name]?.[0];

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-navy">
            Name <span className="text-gold-dark">*</span>
          </label>
          <input
            id="name" name="name" type="text" required autoComplete="name"
            placeholder="Jane Whitfield"
            aria-invalid={Boolean(fieldError("name"))}
            className={cn(inputBase, fieldError("name") && "border-destructive")}
          />
          {fieldError("name") && <p className="mt-1.5 text-xs text-destructive">{fieldError("name")}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
            Work email <span className="text-gold-dark">*</span>
          </label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            placeholder="jane@yourfirm.com"
            aria-invalid={Boolean(fieldError("email"))}
            className={cn(inputBase, fieldError("email") && "border-destructive")}
          />
          {fieldError("email") && <p className="mt-1.5 text-xs text-destructive">{fieldError("email")}</p>}
        </div>

        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-navy">
            Firm name
          </label>
          <input
            id="company" name="company" type="text" autoComplete="organization"
            placeholder="Whitfield & Associates CPAs"
            className={inputBase}
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-navy">
            Phone
          </label>
          <input
            id="phone" name="phone" type="tel" autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            className={inputBase}
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2.5 text-sm font-medium text-navy">
          What are you interested in?
        </legend>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map((option) => {
            const active = services.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleService(option)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  active
                    ? "border-gold bg-gold/15 font-medium text-navy"
                    : "border-input bg-white text-ink-muted hover:border-gold/50"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
          What work are you looking to move? <span className="text-gold-dark">*</span>
        </label>
        <textarea
          id="message" name="message" required rows={5}
          placeholder="Roughly how many returns, what entity types, which software you use, and when you need capacity."
          aria-invalid={Boolean(fieldError("message"))}
          className={cn(inputBase, "resize-y", fieldError("message") && "border-destructive")}
        />
        {fieldError("message") && <p className="mt-1.5 text-xs text-destructive">{fieldError("message")}</p>}
      </div>

      {/* Honeypot — positioned off-screen rather than display:none so bots fill it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent" name="consent" type="checkbox" required
          className="mt-1 h-4 w-4 shrink-0 rounded border-input text-navy focus:ring-gold"
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-ink-muted">
          I agree to be contacted about this enquiry and have read the{" "}
          <a href="/privacy-policy" className="text-navy underline decoration-gold/60 underline-offset-2">
            privacy policy
          </a>
          . <span className="text-gold-dark">*</span>
        </label>
      </div>
      {fieldError("consent") && <p className="text-xs text-destructive">{fieldError("consent")}</p>}

      {formError && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" variant="gold" size="lg" disabled={state === "sending"} className="w-full sm:w-auto">
        {state === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Send enquiry"
        )}
      </Button>
    </form>
  );
}

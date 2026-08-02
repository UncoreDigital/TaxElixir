import { AlertTriangle } from "lucide-react";

/**
 * Shown on service pages whose scope was drafted from standard practice rather
 * than taken from the client's own services deck.
 *
 * Dev only — it is a note to us and to the client during review, not something
 * a prospect should ever read. In production the page renders normally; the
 * outstanding confirmation is tracked in docs/CLIENT-CONTENT-GAPS.md.
 */
export default function ProvisionalNotice({ service }: { service: string }) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="border-y border-amber-300 bg-amber-50">
      <div className="container flex items-start gap-3.5 py-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-amber-900">
          <strong className="font-semibold">Scope needs client confirmation.</strong>{" "}
          {service} does not appear in the TaxElixir services deck. The scope below
          is drafted from standard practice so the page exists and can be reviewed —
          it must be confirmed, corrected or removed before launch. No filing,
          deadline or form-number claim has been made that the client has not
          already stated elsewhere.
        </p>
      </div>
    </div>
  );
}

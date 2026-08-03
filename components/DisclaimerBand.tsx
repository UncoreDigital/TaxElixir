import { Info } from "lucide-react";
import { site } from "@/lib/site";

/**
 * The client's own boundary statement, surfaced in-page (not only in the
 * footer) on audit and service pages where a reader might otherwise assume
 * TaxElixir signs opinions. Verbatim from the services deck.
 *
 * CURRENTLY UNUSED — the client asked for the in-page band to come off every
 * page. The statement still appears in the footer of every page (Footer.tsx),
 * in the FAQ answers and in the page JSON-LD, so the boundary is still stated;
 * only the repeated mid-page strip is gone. Kept here rather than deleted
 * because "put the band back" is a one-line change per page.
 */
export default function DisclaimerBand() {
  return (
    <section className="border-y border-gold/25 bg-gold/[0.07]">
      <div className="container py-6">
        <div className="flex items-start gap-3.5">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-ink">
            {site.disclaimer} Independence, professional judgement, review and
            the issuing of any opinion remain entirely with your firm.
          </p>
        </div>
      </div>
    </section>
  );
}

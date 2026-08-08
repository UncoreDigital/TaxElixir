import Reveal from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";

/**
 * The second half of section 2 of the client's content document: who the firm
 * is for.
 *
 * The three proof figures that opened this section have moved into the hero,
 * one to each slide, at the client's request — so what remains here is the
 * qualifying statement. It reads as a filter rather than a pitch, which is why
 * the CTA under it asks about fit instead of asking for a meeting.
 */
export default function BuiltFor() {
  return (
    <section className="section bg-muted/50">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl">
              Built for US CPA, EA and accounting firms
            </h2>
            <span className="rule-gold mx-auto mt-6" aria-hidden="true" />
            <p className="mt-6 text-sm leading-relaxed text-ink-muted md:text-base">
              TaxElixir works best with US CPA firms, EA practices, accounting
              firms and in-house finance teams that treat compliance and quality
              as non-negotiable. These teams need tax preparation outsourcing
              support during busy season and throughout the year, want reliable
              US tax and audit outsourcing without adding permanent staff, and
              are growing their client base to a point where an offshore tax and
              audit team makes sense. When partners and managers want more time
              for planning, advisory work and client relationships, TaxElixir
              takes on the recurring tax, audit and accounting work through a
              trained offshore team that fits into the way the firm already
              operates.
            </p>

            <ButtonLink href="/contact" variant="gold" size="lg" className="mt-9">
              See If TaxElixir Is A Fit
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

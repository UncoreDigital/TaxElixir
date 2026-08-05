import { Building2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Placeholder from "@/components/Placeholder";
import { successProof } from "@/lib/content";

/**
 * Client success stories — the figures now, the named stories when they exist.
 *
 * Requested by the client (Website Updates sheet, row 10) with four things to
 * carry: industry, the 55–75% cost difference, the 48-hour turnaround, and the
 * capacity to absorb a season. Three of those are the proof figures in
 * lib/content, shared with the hero carousel so the two cannot drift.
 *
 * The fourth — industry — needs an actual engagement to name, and none has been
 * supplied. That is called out rather than filled in: "a mid-size firm in the
 * Midwest" invented here would be the one line on the page a prospect could
 * catch us on. The /case-studies route that used to hold this is parked with
 * the rest of the Resources group, which is why the figures live here on the
 * Firm side instead.
 */
export default function SuccessStories() {
  // White, not muted: it lands between Stats and "What We Stand For" on /about,
  // both of which are muted, and three tinted bands in a row read as one long
  // section.
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Client Success"
          title="What changes when firms move work to us"
          intro="The pattern across our engagements, stated as ranges rather than best cases. We will walk you through the arithmetic behind any of these on a call."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {successProof.map((proof, i) => (
            <Reveal key={proof.key} delay={i * 0.07}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-white p-8 shadow-soft">
                <p className="font-display text-4xl font-bold text-gradient-gold md:text-5xl">
                  {proof.value}
                </p>
                <span className="rule-gold mt-5" aria-hidden="true" />
                <h3 className="mt-5 text-lg leading-snug">{proof.headline}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  {proof.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center">
            <Building2 className="h-8 w-8 text-border" aria-hidden="true" />
            <p className="max-w-lg text-sm leading-relaxed text-ink-muted">
              Named engagements sit behind these figures. We publish one only
              with the firm&rsquo;s agreement and its industry stated, because a
              success story with no industry attached tells you nothing about
              whether it resembles yours.
            </p>
            <Placeholder label="client to supply: 3 engagements — industry, what moved, what changed" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

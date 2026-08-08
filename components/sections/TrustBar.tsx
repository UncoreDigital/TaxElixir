import Reveal from "@/components/Reveal";
import { successProof } from "@/lib/content";

/**
 * The three commercial figures, in their own bar directly under the hero.
 *
 * They have been in and out of the hero; this is where the client settled. It
 * is the better place for them: all three are visible at once instead of one
 * every six seconds, so a partner scanning the page sees the whole case rather
 * than whichever third the timer happened to be showing.
 *
 * Values come from `successProof` — the same array /about reads — so the
 * headline figures cannot drift between the two pages.
 */
export default function TrustBar() {
  return (
    <section className="section bg-muted/50">
      <div className="container">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {successProof.map((proof, i) => (
            <Reveal key={proof.key} delay={i * 0.07}>
              <div className="flex h-full flex-col bg-white px-7 py-9">
                <p className="font-display text-3xl font-bold text-gradient-gold md:text-4xl">
                  {proof.value}
                </p>
                <p className="mt-3 font-display text-base font-bold text-navy">
                  {proof.headline}
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                  {proof.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

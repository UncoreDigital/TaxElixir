import { Award, Globe2, ScrollText, Users2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import { leadership } from "@/lib/content";

/** Positional, so the order tracks lib/content.ts → leadership. */
const iconFor = [Globe2, ScrollText, Users2, Award];

/**
 * Leadership & expertise block.
 *
 * Credential claims here are exactly the kind a prospect verifies on LinkedIn
 * before a first call, so every one is flagged for client confirmation rather
 * than asserted. A wrong "Big 4-trained" claim is worse than no claim.
 */
export default function Leadership() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Leadership & Expertise"
          title="Who is actually accountable for your work"
          intro="Offshore engagements live or die on whether there is a senior person who owns the relationship. These are the credentials that answer that question — each one confirmed before it goes live."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leadership.map((item, i) => {
            const Icon = iconFor[i % iconFor.length];
            return (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-xl border border-border bg-white p-7 shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy/5 text-navy">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg leading-snug">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                  {item.needsClient && (
                    <Placeholder label="verify before launch" className="mt-4 self-start" />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

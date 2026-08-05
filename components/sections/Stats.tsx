import CountUp from "@/components/CountUp";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getStats } from "@/lib/settings";

/**
 * Headline figures — the four operational facts the client chose to lead with
 * (Website Updates sheet, row 8).
 *
 * Values come from one source (lib/content.ts, mirrored by the site_settings
 * table the admin edits) so they cannot contradict each other page to page.
 *
 * A numeric figure is server-rendered and then animated by CountUp. A
 * non-numeric one ("CPA-Led") is echoed verbatim, and an unset one renders an
 * em dash — never a zero, never an invented number.
 */
export default async function Stats({
  heading = true,
}: {
  heading?: boolean;
}) {
  // Values come from the `site_settings` table via Admin → Site Settings,
  // falling back to the definitions in lib/content.ts when unset.
  const stats = await getStats();

  return (
    <section className="section bg-muted/50">
      <div className="container">
        {heading && (
          <SectionHeading
            align="center"
            eyebrow="How We Deliver"
            title="The standard behind every file"
            intro="Four things that are true of every engagement, not averages across a good year. Ask us to evidence any of them before you send us work."
          />
        )}

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            /*
             * Guard against Number("") === 0.
             *
             * Stripping non-digits from a value like "**" or "TBC" leaves an
             * empty string, and Number("") is 0 — which would render "0+" and
             * reproduce exactly the failure this component exists to prevent.
             * Only treat a value as a counter when it actually contains digits;
             * otherwise show what was entered verbatim, never a fabricated zero.
             */
            const digits = stat.value ? stat.value.replace(/[^\d.]/g, "") : "";
            const numeric = digits ? Number(digits) : NaN;
            const isNumeric = Number.isFinite(numeric);

            return (
              <Reveal key={stat.key} delay={i * 0.07}>
                <div className="flex h-full flex-col items-center bg-white px-6 py-10 text-center">
                  <p
                    className={`font-display font-bold ${
                      // A word sits a step down from a numeral: "CPA-Led" set at
                      // the counters' size is wider than its column and breaks
                      // the row's shared baseline.
                      isNumeric ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
                    } ${stat.value ? "text-gradient-gold" : "text-border"}`}
                  >
                    {isNumeric ? (
                      <CountUp value={numeric} suffix={stat.suffix ?? ""} />
                    ) : stat.value ? (
                      // Non-numeric: echo it back verbatim. No suffix appended —
                      // a suffix is defined against a number, not a word.
                      <>{stat.value}</>
                    ) : (
                      <span aria-label="Figure to be confirmed">—</span>
                    )}
                  </p>

                  <span className="rule-gold mt-4" aria-hidden="true" />

                  <p className="mt-4 text-sm leading-snug text-ink-muted">{stat.label}</p>

                  {stat.needsClient && !stat.value && (
                    <Placeholder label="client to supply" className="mt-3" />
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

import CountUp from "@/components/CountUp";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getStats } from "@/lib/settings";

/**
 * Headline figures — "by the numbers".
 *
 * Values come from one source (lib/content.ts, mirrored by the site_settings
 * table the admin edits) so they cannot contradict each other page to page.
 *
 * A confirmed figure is server-rendered and then animated by CountUp. An
 * unconfirmed one renders an em dash — never a zero, never an invented number.
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
            eyebrow="By The Numbers"
            title="Capacity, measured"
            intro="Figures we are willing to put a name to. Where a number is not shown, it is because we have not yet published it — not because it is being rounded up."
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
                    className={`font-display text-4xl font-bold md:text-5xl ${
                      stat.value ? "text-gradient-gold" : "text-border"
                    }`}
                  >
                    {isNumeric ? (
                      <CountUp value={numeric} suffix={stat.suffix ?? ""} />
                    ) : stat.value ? (
                      // Non-numeric: echo it back so a placeholder is visibly a
                      // placeholder. No suffix — we do not know what it means.
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

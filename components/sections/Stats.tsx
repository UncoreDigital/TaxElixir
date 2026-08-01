import Placeholder from "@/components/Placeholder";
import { stats } from "@/lib/content";

/**
 * Headline figures.
 *
 * Rendered server-side from a single source. Two failure modes deliberately
 * avoided, both observed live on unisonglobus.com:
 *   1. Numbers hard-coded per page, which drifted into contradicting each other
 *      ("350+ clients globally" vs "500+ UK clients").
 *   2. Counters whose real value exists only in a JS attribute, so crawlers and
 *      no-JS users are served a literal "0 +".
 * A figure we do not have yet renders as an em dash, never as zero.
 */
export default function Stats({ invert = false }: { invert?: boolean }) {
  return (
    <section className={invert ? "" : "section"}>
      <div className="container">
        <div
          className={
            invert
              ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
              : "grid gap-8 rounded-2xl border border-border bg-white p-10 shadow-soft sm:grid-cols-2 lg:grid-cols-4"
          }
        >
          {stats.map((stat) => (
            <div key={stat.key} className="text-center">
              <p
                className={`font-display text-4xl font-bold md:text-5xl ${
                  stat.value ? "text-gradient-gold" : "text-border"
                }`}
              >
                {stat.value ? (
                  <>
                    {stat.value}
                    {stat.suffix}
                  </>
                ) : (
                  <span aria-label="Figure to be confirmed">—</span>
                )}
              </p>
              <p
                className={`mt-2 text-sm ${
                  invert ? "text-white/70" : "text-ink-muted"
                }`}
              >
                {stat.label}
              </p>
              {stat.needsClient && !stat.value && (
                <Placeholder label="client to supply" className="mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

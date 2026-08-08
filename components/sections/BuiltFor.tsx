import Image from "next/image";
import Reveal from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { sectionArt } from "@/lib/section-art";

/**
 * "Built for US CPA, EA and accounting firms" — the qualifying half of section
 * 2 of the client's content document.
 *
 * Two columns from lg: copy left, photograph right. Left-aligned rather than
 * centred, because the paragraph runs ~110 words and centred text that long is
 * hard to track back to the start of each line.
 *
 * The photograph is decorative — the heading and paragraph beside it carry the
 * whole meaning, and a description of an office would only repeat them to a
 * screen reader. It falls back to the brand's patterned surface until the file
 * lands in public/assets/home/, so a preview never shows a broken image.
 */
export default function BuiltFor() {
  const art = sectionArt("built-for");

  return (
    <section className="section">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="max-w-xl">
              <p className="eyebrow text-gold-dark">Who We Work With</p>

              <h2 className="mt-4 text-2xl md:text-3xl lg:text-[2.25rem] lg:leading-tight">
                Built for US CPA, EA and accounting firms
              </h2>

              <span className="rule-gold mt-6" aria-hidden="true" />

              <p className="mt-6 text-sm leading-relaxed text-ink-muted md:text-base">
                TaxElixir works best with US CPA firms, EA practices, accounting
                firms and in-house finance teams that treat compliance and
                quality as non-negotiable. These teams need tax preparation
                outsourcing support during busy season and throughout the year,
                want reliable US tax and audit outsourcing without adding
                permanent staff, and are growing their client base to a point
                where an offshore tax and audit team makes sense. When partners
                and managers want more time for planning, advisory work and
                client relationships, TaxElixir takes on the recurring tax, audit
                and accounting work through a trained offshore team that fits
                into the way the firm already operates.
              </p>

              <ButtonLink href="/contact" variant="gold" size="lg" className="mt-8">
                See If TaxElixir Is A Fit
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-soft">
              {art ? (
                <Image
                  src={art}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="absolute inset-0 bg-navy-deep bg-[url('/assets/patterns/grid-gold.svg')] bg-repeat"
                  aria-hidden="true"
                >
                  <span className="absolute -right-10 -top-10 block h-64 w-64 bg-[url('/assets/patterns/shield-watermark.svg')] bg-contain bg-no-repeat opacity-60" />
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

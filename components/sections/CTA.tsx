import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

/**
 * The closing call-to-action band, used at the foot of almost every page.
 *
 * Laid out as a bar, not a panel: title left, buttons right, vertically
 * centred against each other. The earlier centred-stack version ran ~400px
 * tall and repeated on fifteen pages, so by the third or fourth page a reader
 * scrolled past a screenful of navy to reach the same two buttons. The bar is
 * roughly half the height and puts the buttons on the same line as the ask.
 *
 * `body` has no default. Most pages want the bar with nothing between the
 * heading and the buttons, and a paragraph is what made the old block tall.
 * Pages that genuinely need to qualify the ask (FAQs, partnership, the hire
 * and case-study detail pages) pass their own, and it renders under the title
 * in the left column — the layout holds either way. The gold rule belongs to
 * that paragraph rather than the title, because with no body it would be a
 * separator with nothing on the far side of it.
 *
 * The blurred gold circles are sized to the bar. They were h-72 against the
 * taller block; at the reduced height that reads as a wash over the whole
 * panel instead of light catching two corners.
 */
export default function CTA({
  title = "Add capacity without adding headcount",
  body,
  primary = { href: "/contact", label: "Book a Discovery Call" },
  secondary = { href: "/how-we-work", label: "See How We Work" },
}: {
  title?: string;
  body?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
}) {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-navy px-6 py-9 md:px-10 md:py-10 lg:px-12">
            <div
              className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="max-w-xl">
                <h2 className="text-2xl text-white md:text-3xl">{title}</h2>
                {body && (
                  <>
                    <span className="rule-gold mt-5" aria-hidden="true" />
                    <p className="mt-5 text-base leading-relaxed text-white/75">{body}</p>
                  </>
                )}
              </div>

              {/* shrink-0 so the buttons keep their intrinsic width and the
                  heading takes the squeeze — the reverse wraps "Book a
                  Discovery Call" onto two lines before the title has given up
                  any of its own. */}
              <div className="shrink-0 lg:text-right">
                <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                  <ButtonLink href={primary.href} variant="gold" size="lg">
                    {primary.label}
                  </ButtonLink>
                  {secondary && (
                    <ButtonLink
                      href={secondary.href}
                      size="lg"
                      className="border border-white/25 bg-transparent text-white hover:bg-white hover:text-navy"
                    >
                      {secondary.label}
                    </ButtonLink>
                  )}
                </div>

                <a
                  href={site.emailHref}
                  className="mt-4 inline-block text-sm text-white/60 transition-colors hover:text-gold-light"
                >
                  or email {site.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

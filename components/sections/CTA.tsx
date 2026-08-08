import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

/**
 * The closing call-to-action band, used at the foot of almost every page.
 *
 * Laid out as a bar, not a panel: title left, buttons right, the two centred
 * against each other and the email centred beneath the buttons. The earlier
 * centred-stack version ran ~400px
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

            {/*
              A two-row grid from lg, not a flex row, and the email is a grid
              child rather than a sibling of the buttons.

              As a flex row the right-hand column was heading-height plus
              buttons plus the email line, and `items-center` centred the
              heading against all of that — so the heading sat about 18px below
              the buttons it is meant to read alongside. Here the heading and
              the buttons share row 1 and centre against each other; the email
              drops into row 2 under the buttons, where it no longer pulls on
              the alignment above it.

              The email is centred on the button pair rather than flushed right:
              it belongs to the buttons, and hanging it off the right edge left
              it looking like a stray line of the footer.
            */}
            <div className="relative flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-x-12 lg:gap-y-4">
              <div className="max-w-xl lg:col-start-1 lg:row-start-1">
                <h2 className="text-2xl text-white md:text-3xl">{title}</h2>
                {body && (
                  <>
                    <span className="rule-gold mt-5" aria-hidden="true" />
                    <p className="mt-5 text-base leading-relaxed text-white/75">{body}</p>
                  </>
                )}
              </div>

              {/* The column keeps the buttons' intrinsic width (`auto` track)
                  and the heading takes the squeeze — the reverse wraps "Book a
                  Discovery Call" onto two lines before the title has given up
                  any of its own. */}
              <div className="flex flex-col gap-3 sm:flex-row lg:col-start-2 lg:row-start-1">
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
                className="block text-center text-sm text-white/60 transition-colors hover:text-gold-light lg:col-start-2 lg:row-start-2"
              >
                or email {site.email}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

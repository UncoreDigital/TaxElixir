import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export default function CTA({
  title = "Add capacity without adding headcount",
  body = "Tell us what work you want to move off your team's desk. If we are not the right fit, we will tell you on the first call.",
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
          <div className="relative overflow-hidden rounded-2xl bg-gradient-navy px-6 py-14 text-center md:px-16 md:py-20">
            <div
              className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl text-white md:text-4xl">{title}</h2>
              <span className="rule-gold mx-auto mt-6" aria-hidden="true" />
              <p className="mt-6 text-base leading-relaxed text-white/75 md:text-lg">{body}</p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
                className="mt-6 inline-block text-sm text-white/60 transition-colors hover:text-gold-light"
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

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/lib/services-data";

const proofPoints = [
  "We work inside your software and workpaper standards",
  "Review-ready output, with a self-review already done",
  "Scale from one preparer to a seasonal team",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-navy">
      {/* Blueprint grid + an oversized shield watermark, both from the brand mark. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/assets/patterns/grid-gold.svg')] bg-repeat"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 -top-24 h-[46rem] w-[46rem] bg-[url('/assets/patterns/shield-watermark.svg')] bg-contain bg-no-repeat opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-20 h-[26rem] w-[26rem] rounded-full bg-gold/[0.07] blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative grid gap-14 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="eyebrow text-gold-light">
            Offshore Support for US CPA Firms
          </p>

          {/* The page's only <h1>. */}
          <h1 className="mt-4 text-4xl leading-[1.1] text-white md:text-5xl lg:text-[3.4rem]">
            Add capacity to your firm{" "}
            <span className="text-gradient-gold">without adding headcount</span>
          </h1>

          <span className="rule-gold mt-7" aria-hidden="true" />

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">
            TaxElixir prepares returns, keeps books and supports audit engagements
            as a direct extension of your team — in your systems, on your
            standards, delivered ready for your reviewer.
          </p>

          <ul className="mt-8 space-y-3">
            {proofPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-white/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20">
                  <Check className="h-3 w-3 text-gold-light" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="gold" size="lg">
              Book a Discovery Call
            </ButtonLink>
            <ButtonLink
              href="/services"
              size="lg"
              className="border border-white/25 bg-transparent text-white hover:bg-white hover:text-navy"
            >
              Explore Services
            </ButtonLink>
          </div>
        </div>

        {/* Service index — gives the hero a job beyond decoration. */}
        <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-2 backdrop-blur-sm">
          {services.map((service, i) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group flex items-center gap-5 rounded-xl px-5 py-5 transition-colors hover:bg-white/[0.07]"
            >
              <span className="font-display text-2xl text-gold/70">{service.number}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg text-white">
                  {service.title}
                </span>
                <span className="mt-1 block text-sm leading-snug text-white/60">
                  {service.teaser}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-gold opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { services } from "@/lib/services-data";
import { getIcon } from "@/lib/icons";

export default function CoreServices() {
  return (
    <section className="section bg-muted/50">
      <div className="container">
        <SectionHeading
          eyebrow="What We Do"
          title="Four service lines, one delivery standard"
          intro="Everything below is delivered by dedicated offshore professionals working inside your existing workflow and software — not on a platform of ours that your team has to learn."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {services.map((service, i) => {
            const Icon = getIcon(service.icon);
            return (
              <Reveal key={service.slug} delay={i * 0.07}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-white p-8 shadow-soft transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors group-hover:bg-gradient-gold-x group-hover:text-navy">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-3xl text-border">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                    {service.teaser}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                    Explore {service.navTitle}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

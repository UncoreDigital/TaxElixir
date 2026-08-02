"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { services } from "@/lib/services-data";
import { getIcon } from "@/lib/icons";
import { gridCard, gridContainer, noMotion, viewportOnce } from "@/lib/motion";

/**
 * Service grid.
 *
 * The hover border is a gradient, which CSS cannot apply to `border-color`
 * directly. The card sits on a gradient-filled parent with 1px of padding; the
 * inner surface covers all but that edge, so the "border" is the parent showing
 * through. Fading the parent's opacity animates a gradient border cheaply and
 * without a second paint layer.
 */
export default function CoreServices() {
  const reduced = useReducedMotion();

  return (
    <section className="section bg-slate-50">
      <div className="container">
        <SectionHeading
          eyebrow="What We Do"
          title="Nine service lines, one delivery standard"
          intro="Everything below is delivered by dedicated offshore professionals working inside your existing workflow and software — not on a platform of ours that your team has to learn."
        />

        <motion.div
          variants={reduced ? noMotion : gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <motion.div key={service.slug} variants={reduced ? noMotion : gridCard}>
                <Link
                  href={`/services/${service.slug}`}
                  data-cursor="grow"
                  className="group relative block h-full rounded-xl p-px transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Gradient edge, revealed on hover. */}
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    style={{ background: "var(--gradient-edge)" }}
                    aria-hidden="true"
                  />

                  <span className="relative flex h-full flex-col rounded-[calc(0.75rem-1px)] border border-slate-200 bg-white p-8 shadow-soft transition-shadow duration-300 group-hover:border-transparent group-hover:shadow-card">
                    <span className="flex items-start justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors duration-300 group-hover:bg-gradient-gold-x">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-display text-3xl text-slate-200 transition-colors duration-300 group-hover:text-gold/40">
                        {service.number}
                      </span>
                    </span>

                    <span className="mt-6 block font-display text-xl font-bold text-navy">
                      {service.title}
                    </span>
                    <span className="mt-3 block flex-1 text-sm leading-relaxed text-ink-muted">
                      {service.teaser}
                    </span>

                    {/* "View Details" slides in from the left on hover. */}
                    <span className="relative mt-6 block h-5 overflow-hidden">
                      <span className="absolute inset-0 flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
                        Explore {service.navTitle}
                      </span>
                      <span className="absolute inset-0 flex translate-y-full items-center gap-1.5 text-sm font-semibold text-navy opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        View Details
                        <ArrowRight className="h-4 w-4 text-gold-dark" aria-hidden="true" />
                      </span>
                    </span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

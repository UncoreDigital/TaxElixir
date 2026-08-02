"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { roles } from "@/lib/hire-data";
import { getIcon } from "@/lib/icons";
import { listItem, noMotion, tabPanel } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Offshore staffing, as a tabbed interface.
 *
 * Implemented against the WAI-ARIA tabs pattern rather than as styled buttons:
 * roving tabindex, arrow-key navigation, Home/End, and correct
 * role/aria-selected/aria-controls wiring. A tab strip that only responds to a
 * mouse is a keyboard trap dressed as an interaction.
 *
 * The active indicator is a shared `layoutId`, so Framer Motion animates it
 * between tabs instead of cross-fading two separate bars.
 */
export default function StaffingTabs() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const role = roles[active];
  const Icon = getIcon(role.icon);

  function onKeyDown(event: React.KeyboardEvent) {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (active + 1) % roles.length;
    if (event.key === "ArrowLeft") next = (active - 1 + roles.length) % roles.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = roles.length - 1;
    if (next === null) return;

    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="section relative overflow-hidden bg-gradient-navy">
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/assets/patterns/grid-gold.svg')] bg-repeat opacity-40"
        aria-hidden="true"
      />

      <div className="container relative">
        <SectionHeading
          invert
          eyebrow="Offshore Staffing Solutions"
          title="Dedicated professionals who become part of your team"
          intro="Hire a named individual rather than buying anonymous hours. Six roles, each scoped to a specific part of a CPA firm's workload."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[19rem_1fr] lg:gap-12">
          {/* Tab strip */}
          <div
            role="tablist"
            aria-label="Offshore roles"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {roles.map((r, i) => {
              const selected = i === active;
              return (
                <button
                  key={r.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`role-tab-${r.slug}`}
                  aria-selected={selected}
                  aria-controls={`role-panel-${r.slug}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  data-cursor="grow"
                  className={cn(
                    "relative shrink-0 rounded-lg px-5 py-4 text-left text-sm font-medium transition-colors lg:w-full",
                    selected ? "text-white" : "text-white/55 hover:text-white/85"
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId={reduced ? undefined : "staffing-tab-active"}
                      className="absolute inset-0 rounded-lg border border-gold/40 bg-white/[0.08]"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative flex items-center gap-3">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                        selected ? "bg-gold" : "bg-white/25"
                      )}
                      aria-hidden="true"
                    />
                    {r.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role.slug}
              role="tabpanel"
              id={`role-panel-${role.slug}`}
              aria-labelledby={`role-tab-${role.slug}`}
              tabIndex={0}
              variants={reduced ? noMotion : tabPanel}
              initial="hidden"
              animate="visible"
              exit={reduced ? undefined : "exit"}
              className="rounded-2xl border border-white/12 bg-white/[0.05] p-8 backdrop-blur-sm md:p-10"
            >
              <div className="flex items-start gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-gold-x text-navy">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-2xl text-white">{role.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {role.teaser}
                  </p>
                </div>
              </div>

              <motion.ul
                variants={
                  reduced ? noMotion : { visible: { transition: { staggerChildren: 0.06 } } }
                }
                initial="hidden"
                animate="visible"
                className="mt-8 grid gap-3 sm:grid-cols-2"
              >
                {role.capabilities.map((cap) => (
                  <motion.li
                    key={cap}
                    variants={reduced ? noMotion : listItem}
                    className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3.5"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-light" aria-hidden="true" />
                    <span className="text-sm leading-snug text-white/85">{cap}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-white/55">
                  Full-time, part-time or seasonal — scoped to your workload.
                </p>
                <div className="flex gap-3">
                  <Link
                    href={`/hire/${role.slug}`}
                    data-cursor="grow"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-light transition-colors hover:text-white"
                  >
                    Role detail
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <ButtonLink href="/contact" variant="gold" size="sm" data-cursor="grow">
                    Discuss this role
                  </ButtonLink>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

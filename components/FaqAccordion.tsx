"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Native <details> would be simpler, but we need the single-open behaviour and
 * an animated chevron. Content stays in the DOM either way so it remains
 * crawlable — the FAQPage JSON-LD is emitted separately by the page.
 */
export default function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span className="font-display text-base font-bold text-navy md:text-lg">
                  {item.q}
                </span>
                <Plus
                  className={cn(
                    "mt-0.5 h-5 w-5 shrink-0 text-gold-dark transition-transform duration-200",
                    isOpen && "rotate-45"
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              className={cn("grid transition-all duration-200", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-10 text-sm leading-relaxed text-ink-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

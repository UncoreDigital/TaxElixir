"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { testimonials, type Testimonial } from "@/lib/content";
import { cn } from "@/lib/utils";

const EYEBROW = "Client Voices";
/* Count-neutral on purpose: "what firms say" over a single quote is a plural
   the page cannot back up, and this site does not round up. */
const TITLE = "What it is like to work with us";

/**
 * Who said it. The firm is always there; the person only where one is named, in
 * which case they lead and the firm drops to the second line.
 */
function Attribution({ item }: { item: Testimonial }) {
  return (
    <>
      <span className="block font-display text-base font-bold text-navy">
        {item.name ?? item.firm}
      </span>
      {item.name && (
        <span className="mt-0.5 block text-sm text-ink-muted">{item.firm}</span>
      )}
    </>
  );
}

/**
 * Testimonials, laid out by how many there are.
 *
 * One quote is a single featured block. A carousel of one is a card with two
 * dead arrows beside it, which reads as a slider that failed to load the rest.
 *
 * Two or more become a scroll-snap track with drag, arrows and keyboard. Built
 * on native overflow scrolling rather than a slider library: it is swipeable on
 * touch for free, remains keyboard- and screen-reader-navigable, and degrades
 * to a plain scrolling list if JavaScript never runs.
 *
 * With `lib/content.ts → testimonials` empty the section renders a labelled
 * empty state in dev and nothing in production — an invented testimonial is
 * worth less than none.
 */
export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [paused, setPaused] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  /**
   * Autoplay, with the pauses that make it tolerable: it stops on hover, on
   * keyboard focus anywhere inside the carousel, when the tab is hidden, and
   * entirely under prefers-reduced-motion. At the end it rewinds rather than
   * jumping, so the loop never snaps.
   */
  useEffect(() => {
    if (testimonials.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (paused) return;

    const id = window.setInterval(() => {
      const el = trackRef.current;
      if (!el || document.hidden) return;
      const ended = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (ended) el.scrollTo({ left: 0, behavior: "smooth" });
      else scrollBy(1);
    }, 5200);

    return () => window.clearInterval(id);
  }, [paused, scrollBy]);

  if (testimonials.length === 0) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <section className="section">
        <div className="container">
          <SectionHeading align="center" eyebrow={EYEBROW} title={TITLE} />
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/40 p-12 text-center">
            <Quote className="mx-auto h-8 w-8 text-border" aria-hidden="true" />
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
              Testimonials appear here as soon as they are added. Each needs the
              quote and the firm it came from, plus a named person where the
              firm has agreed to one.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 1) {
    const [item] = testimonials;

    return (
      <section className="section">
        <div className="container">
          <SectionHeading align="center" eyebrow={EYEBROW} title={TITLE} />

          <Reveal className="mx-auto mt-12 max-w-4xl">
            <figure className="relative overflow-hidden rounded-2xl border border-border bg-white px-7 py-10 shadow-card md:px-14 md:py-14">
              <span
                className="absolute inset-x-0 top-0 h-1 bg-gradient-gold-x"
                aria-hidden="true"
              />
              <Quote className="h-9 w-9 text-gold" aria-hidden="true" />
              <blockquote className="mt-6 font-display text-lg font-medium leading-relaxed text-navy md:text-[1.375rem] md:leading-[1.6]">
                {item.quote}
              </blockquote>
              <figcaption className="mt-8 border-t border-border pt-6">
                <Attribution item={item} />
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={EYEBROW}
            title={TITLE}
            intro="From the firms we work with, in their own words."
          />

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Previous testimonials"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-navy transition-all",
                atStart ? "cursor-not-allowed opacity-35" : "hover:border-gold hover:shadow-soft"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Next testimonials"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-navy transition-all",
                atEnd ? "cursor-not-allowed opacity-35" : "hover:border-gold hover:shadow-soft"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-label="Client testimonials, scrollable"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((item, i) => (
            <figure
              key={`${item.firm}-${i}`}
              data-card
              className="flex w-[min(88vw,26rem)] shrink-0 snap-start flex-col rounded-2xl border border-border bg-white p-8 shadow-soft"
            >
              <Quote className="h-7 w-7 shrink-0 text-gold" aria-hidden="true" />
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-ink">
                {item.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-5">
                <Attribution item={item} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

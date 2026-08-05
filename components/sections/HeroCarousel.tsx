"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Placeholder from "@/components/Placeholder";
import type { SuccessProof } from "@/lib/content";
import { cn } from "@/lib/utils";

const INTERVAL = 6000;

/**
 * The rotating panel beside the hero headline.
 *
 * Replaces the static service index that used to sit here — the client's point
 * (Website Updates sheet, rows 5 and 17) was that the nav already lists every
 * service, so the most valuable slot on the page was spending itself repeating
 * the menu. It now carries the three proof figures instead.
 *
 * One slide is visible at a time and cross-fades. This is a marketing panel
 * rather than a content list, so unlike the software and testimonial rows it is
 * not a scroll container: there is nothing here to find-in-page, and a fading
 * stack reads as a "changing screen" in a way a horizontal track does not.
 *
 * ALL THREE slides are in the DOM at all times, stacked and toggled with
 * opacity. Mounting only the active one — which is what AnimatePresence would
 * do — puts a single slide in the server HTML and leaves the other two figures
 * invisible to a crawler and to anyone whose JS never runs. That is the same
 * failure this codebase already guards against in CountUp, and two thirds of
 * the panel's content is not worth losing to an animation convenience.
 *
 * Autoplay stops on hover, on focus anywhere inside, when the tab is hidden,
 * and entirely under prefers-reduced-motion — where the dots become the only
 * way to move, which is the correct outcome rather than a degraded one.
 */
export default function HeroCarousel({ slides }: { slides: SuccessProof[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (slides.length < 2 || paused || reduced) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL);

    return () => window.clearInterval(id);
  }, [paused, reduced, slides.length]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="What working with TaxElixir changes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] backdrop-blur-sm"
    >
      {/*
        Fixed aspect box. The slides are absolutely positioned so they can
        cross-fade over one another, which takes them out of flow — without a
        sized parent the panel would collapse to zero height and the hero's
        two-column grid would go with it.
      */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
        {slides.map((slide, i) => {
          const isActive = i === index;

          return (
            <div
              key={slide.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity ease-in-out",
                // Inactive slides stay in the DOM but must not intercept a
                // pointer aimed at the dots stacked above them.
                isActive ? "opacity-100" : "pointer-events-none opacity-0",
                reduced ? "duration-0" : "duration-700"
              )}
            >
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                  aria-hidden="true"
                />
              ) : (
                /*
                  No photography supplied yet. Rather than an empty box or a
                  stock photograph, the slide falls back to the brand's own
                  surface — the gold grid and shield watermark already used
                  across the site. It reads as designed rather than unfinished,
                  and a real image drops in behind this the moment `image` is
                  set in lib/content.
                */
                <span
                  className="absolute inset-0 bg-navy-deep/40 bg-[url('/assets/patterns/grid-gold.svg')] bg-repeat"
                  aria-hidden="true"
                >
                  <span className="absolute -right-10 -top-10 block h-64 w-64 bg-[url('/assets/patterns/shield-watermark.svg')] bg-contain bg-no-repeat opacity-60" />
                </span>
              )}

              {/* Legibility scrim — the copy sits on it whether or not there is
                  a photograph underneath, so contrast does not depend on the
                  art. */}
              <span
                className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/20"
                aria-hidden="true"
              />

              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                <p className="font-display text-5xl font-bold leading-none text-gradient-gold sm:text-6xl">
                  {slide.value}
                </p>
                <p className="mt-4 font-display text-xl text-white sm:text-2xl">
                  {slide.headline}
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                  {slide.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/*
        Dots are real buttons, not decoration. `aria-current` rather than a
        disabled state on the active one: the slide is still a valid target, and
        disabling it would drop it out of the tab order mid-rotation.
      */}
      <div className="absolute right-6 top-6 flex gap-2 sm:right-7 sm:top-7">
        {slides.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            onClick={() => go(i)}
            aria-current={i === index}
            aria-label={`Show ${slide.headline}`}
            data-cursor="grow"
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-7 bg-gold" : "w-1.5 bg-white/35 hover:bg-white/60"
            )}
          />
        ))}
      </div>

      {slides.some((slide) => !slide.image) && (
        <span className="absolute left-6 top-6 sm:left-7 sm:top-7">
          <Placeholder label="client to supply: 3 slide images" />
        </span>
      )}
    </div>
  );
}

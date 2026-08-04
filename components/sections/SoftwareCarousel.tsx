"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import Placeholder from "@/components/Placeholder";
import { cn } from "@/lib/utils";

export type SoftwareItem = {
  name: string;
  slug: string;
  verified: boolean;
  /** Resolved on the server — null means no artwork supplied yet. */
  logo: string | null;
};

/**
 * Horizontally scrolling logo wall.
 *
 * The row is a real scroll container, not a transform-based slider: it keeps
 * native touch momentum on phones, keyboard scrolling, and find-in-page — all
 * of which a translated track breaks. The arrows page it by roughly a viewport
 * and disable themselves at each end, and the scrollbar is only hidden because
 * they stand in for it.
 */
export default function SoftwareCarousel({ items }: { items: SoftwareItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [canPrev, setCanPrev] = useState(false);
  // Optimistic: the server cannot measure the track, and the list overflows at
  // every realistic width. Defaulting to false rendered both arrows greyed out
  // in the SSR markup and flicked the next one live on hydration. `sync()` runs
  // on mount and corrects this immediately if the row happens to fit.
  const [canNext, setCanNext] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // 2px of slack: sub-pixel widths mean scrollLeft rarely lands exactly on
    // the maximum, which would otherwise leave the next arrow enabled forever.
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft < max - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    sync();
    el.addEventListener("scroll", sync, { passive: true });

    // Card widths are responsive, so the ends move when the row is resized.
    const observer = new ResizeObserver(sync);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  function page(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0"
      >
        {items.map((tool) => (
          <li
            key={tool.slug}
            className="w-[13.5rem] shrink-0 snap-start sm:w-[15rem]"
          >
            <div className="flex h-28 items-center justify-center rounded-xl border border-border bg-white px-5 shadow-soft transition-shadow hover:shadow-card">
              {tool.logo ? (
                <Image
                  src={tool.logo}
                  alt={tool.name}
                  width={200}
                  height={56}
                  sizes="200px"
                  // The optimizer 400s on SVG unless dangerouslyAllowSVG is set
                  // globally, and there is nothing in a vector for it to
                  // optimize. Passing SVG through avoids widening the image
                  // endpoint for every upload just to serve ten logos.
                  unoptimized={tool.logo.endsWith(".svg")}
                  // Normalised logos all share one 200x56 canvas, so a single
                  // full-width box renders every one at the same scale and
                  // baseline. `w-full` rather than `w-auto`: a 7.6:1 wordmark
                  // like Drake's is wider than the card and would spill out of
                  // it with only a max-height to hold it back.
                  className="h-auto w-full object-contain"
                />
              ) : (
                /*
                  Wordmark fallback for tools with no artwork supplied. Vendor
                  logos are third-party trademarks: they cannot be redrawn or
                  approximated, and an honest wordmark beats a lookalike.
                */
                <span className="text-center font-display text-base font-bold leading-tight text-navy">
                  {tool.name}
                </span>
              )}
            </div>

            {!tool.verified && (
              <span className="mt-2 flex justify-center">
                <Placeholder label="verify" />
              </span>
            )}
          </li>
        ))}
      </ul>

      {/*
        Edge fades sit above the track and must not swallow clicks or drags on
        the cards underneath. They also fade out with their arrow so there is no
        gradient hanging over a row that has stopped scrolling.
      */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-muted/50 to-transparent transition-opacity md:-ml-5",
          canPrev ? "opacity-100" : "opacity-0"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-muted/50 to-transparent transition-opacity md:-mr-5",
          canNext ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="mt-6 flex justify-center gap-3">
        <Arrow direction="prev" onClick={() => page(-1)} disabled={!canPrev} />
        <Arrow direction="next" onClick={() => page(1)} disabled={!canNext} />
      </div>
    </div>
  );
}

function Arrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous software" : "More software"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors",
        disabled
          ? "cursor-not-allowed border-border text-ink-muted/40"
          : "border-border text-navy hover:border-gold hover:text-gold-dark"
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum smoothing on the page scroll.
 *
 * A note on the brief's "scroll hijacking": literal hijacking — intercepting
 * wheel events to force fixed-distance jumps between sections — breaks the
 * scrollbar, breaks find-in-page, breaks keyboard paging, and is a documented
 * accessibility failure. What actually produces the premium feel people mean by
 * that phrase is momentum smoothing: the scroll position still maps 1:1 to
 * input, it is just eased. That is what this does.
 *
 * Disabled entirely under prefers-reduced-motion, where native scroll is
 * restored untouched.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Touch devices already have native momentum; layering ours on top fights it.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out — matches EASE_OUT in lib/motion.ts.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors must still work, and Lenis owns scroll position now.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);

  return null;
}

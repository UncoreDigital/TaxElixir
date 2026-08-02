"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up animation for the headline figures.
 *
 * The real value is passed in already rendered by the server. This component
 * only animates the *display* of it, and it starts from the real value — so
 * with JavaScript disabled, or before hydration, or to a crawler, the correct
 * number is what sits in the HTML.
 *
 * That ordering matters: unisonglobus.com animates from a hard-coded "0" in the
 * markup, so every one of their counters reads a literal "0 +" to anything that
 * does not run their JS, on the very page meant to establish credibility.
 */
export default function CountUp({
  value,
  suffix = "",
  duration = 1400,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const hasRun = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;
        observer.disconnect();

        const start = performance.now();
        // easeOutExpo — fast out of the gate, long settle. Reads as "counting".
        const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(Math.round(ease(progress) * value));
          if (progress < 1) requestAnimationFrame(tick);
        };

        setDisplay(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

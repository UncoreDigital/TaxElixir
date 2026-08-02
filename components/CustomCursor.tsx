"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a small gold dot with a trailing ring that expands over
 * anything interactive.
 *
 * Guardrails, because a custom cursor is an accessibility liability done badly:
 *   - Only mounts for a fine pointer (mouse). Touch and stylus keep the native
 *     behaviour and the native cursor is never hidden for them.
 *   - Disabled entirely under prefers-reduced-motion.
 *   - Hidden over text inputs and textareas, where the I-beam carries real
 *     information about what clicking will do.
 *   - Positioned with a transform on an rAF loop, so it never triggers layout.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let frame = 0;
    let visible = false;

    const onMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      if (!visible) {
        visible = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }

      const el = event.target as HTMLElement | null;
      const interactive = Boolean(
        el?.closest('a, button, [role="button"], input[type="checkbox"], select, summary, [data-cursor="grow"]')
      );
      const textField = Boolean(el?.closest('input:not([type="checkbox"]), textarea, [contenteditable="true"]'));

      const ringEl = ringRef.current;
      const dotEl = dotRef.current;
      if (!ringEl || !dotEl) return;

      if (textField) {
        ringEl.style.opacity = "0";
        dotEl.style.opacity = "0";
        visible = false;
        return;
      }

      ringEl.dataset.grow = interactive ? "true" : "false";
    };

    const onLeave = () => {
      visible = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const loop = () => {
      // Ring lags the dot slightly — the lag is what reads as "premium" rather
      // than as a second cursor stapled to the first.
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-gold opacity-0 transition-[width,height,background-color,border-color,opacity] duration-200 data-[grow=true]:h-14 data-[grow=true]:w-14 data-[grow=true]:border-gold data-[grow=true]:bg-gold/10"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-gold opacity-0 transition-opacity duration-200"
      />
    </div>
  );
}

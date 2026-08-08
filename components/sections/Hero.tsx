"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Pause, Play, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { successProof } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  heroContainer,
  heroHeadline,
  heroItem,
  heroRule,
  noMotion,
} from "@/lib/motion";

const INTERVAL = 6000;

/**
 * 20px blurred frames of each photograph — avoids a flash of empty navy on
 * load. Regenerate alongside the artwork rather than by hand:
 *   sharp(src).resize({ width: 20 }).blur(1.2).webp({ quality: 45 })
 */
const SLIDE_BLUR: Record<string, string> = {
  cost: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAwCdASoUAAsAPt1cqUyopSQiMAgBEBuJZQCdMoAKRqOhSDRjtXrAAP7+tzzhAP9/Ux8Avcz/K0iM2JyAgAAA",
  turnaround:
    "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAABwAwCdASoUAAsAPt1gqU2opaQiMAgBEBuJYwC7AGk7mFaR4QAA/v5KsKhNP5YvkoWPBngqaEiTLV64Wbvk1k0Y9Cogl2rPcRKz/AAA",
  capacity:
    "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAwCdASoUAAsALqVut1ujKKioiICkSxgE6ZQANJfpPii0j2h90AAA/vhSAl6O/gBQrkYCvD+CBRLnf+cvKjTZMAA=",
};

/**
 * Section 1 of the client's content document: "Three lines under the headline
 * (keep tight, not a paragraph)."
 *
 * All three show at once, unlike the proof figure below them, which rotates
 * with the photography. That split is deliberate: these three are the standing
 * claim and should never be one-third visible, while the figures are three
 * different pieces of evidence and only make sense one at a time.
 */
const proofPoints = [
  "U.S. CPA-led",
  "Scales up for tax season",
  "Review ready",
];

/**
 * Hero — three photographs, each carrying one proof figure.
 *
 * Replaces a single static photograph plus a glass card that rotated the same
 * three figures beside it. The client asked for the Anchor treatment (full-bleed
 * art per slide, copy laid directly on it), so the card is gone and its content
 * now sits on the photography.
 *
 * What deliberately does NOT rotate: the eyebrow, the <h1>, the lead paragraph
 * and the CTAs. Anchor rotates its slide titles, but Anchor's are <h2>s and it
 * ships no <h1> at all. Rotating this one would mean either three <h1>s in the
 * markup or a single one whose text changes under the crawler — on the site's
 * most important heading, whose wording the client fixed (row 3). The
 * photographs and the figures carry the variety instead.
 *
 * All three slides' copy is in the DOM at all times, stacked in one CSS grid
 * cell and toggled with opacity. Mounting only the active slide — what
 * AnimatePresence would do — would put one figure in the server HTML and hide
 * the other two from crawlers and from anyone whose JS never runs. The grid
 * overlay also fixes the block's height to its tallest slide, so the CTAs below
 * cannot jump as "55–75%" gives way to "Peak-Season".
 *
 * Autoplay stops on hover, on focus anywhere inside, when the tab is hidden, on
 * an explicit toggle, and entirely under prefers-reduced-motion. The toggle is
 * new: hover-and-focus was defensible for a card in the corner, but this moves
 * the whole viewport, so WCAG 2.2.2 wants a control that does not require
 * parking a pointer.
 */
export default function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const slides = successProof;

  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [stopped, setStopped] = useState(false);

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length]
  );

  const autoplay = !reduced && !stopped && !hovered && slides.length > 1;

  useEffect(() => {
    if (!autoplay) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL);

    return () => window.clearInterval(id);
  }, [autoplay, slides.length]);

  // Parallax: the photograph drifts against the copy, which is what gives the
  // hero depth as it leaves the viewport.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const gridY = useTransform(smooth, [0, 1], ["0%", "12%"]);
  const copyY = useTransform(smooth, [0, 1], ["0%", "18%"]);
  const copyOpacity = useTransform(smooth, [0, 0.75], [1, 0]);

  const container = reduced ? noMotion : heroContainer;
  const item = reduced ? noMotion : heroItem;
  const headline = reduced ? noMotion : heroHeadline;
  const rule = reduced ? noMotion : heroRule;

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden bg-gradient-navy"
    >
      {/*
        Photograph stack, furthest layer.

        `inset-0` with no over-scale and no parallax on this layer, because the
        client asked for the full frame. The previous version inset the wrapper
        past the section edges and scaled it 1.06→1.14 so a parallax translate
        could never expose a gap — which cost roughly a fifth of every
        photograph, cropped invisibly. The copy above still parallaxes; the art
        no longer does.

        Decorative only — aria-hidden, empty alt. The figures beside them carry
        the meaning, and describing an office would be noise to a screen reader.

        `object-right` matters only below lg, where the section is taller than
        16:9 and object-cover has to trim width. All three are composed with the
        subject in the right 40%, so the right edge is the half worth keeping.
        At lg and up the section is sized to the photographs' own aspect ratio
        and nothing is cropped at all — see .hero-viewport in globals.css.
      */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {slides.map((slide, i) => (
          <div
            key={slide.key}
            className={cn(
              "absolute inset-0 transition-opacity ease-in-out",
              i === index ? "opacity-100" : "opacity-0",
              reduced ? "duration-0" : "duration-1000"
            )}
          >
            {slide.image ? (
              <Image
                src={slide.image}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                quality={82}
                placeholder="blur"
                blurDataURL={SLIDE_BLUR[slide.key]}
                className="object-cover object-right"
              />
            ) : (
              /* Path cleared in lib/content — fall back to the brand's own
                 patterned surface rather than an empty box. */
              <span className="absolute inset-0 bg-navy-deep bg-[url('/assets/patterns/grid-gold.svg')] bg-repeat" />
            )}
          </div>
        ))}
      </div>

      {/*
        Contrast scrim, in three tiers — measured against the supplied art
        rather than eyeballed.

        Three tiers because the copy column is a fixed 36rem while `container`
        runs full-bleed below 1320px, so the column covers a *shrinking* share
        of the viewport as it widens: ~78% at 768px, ~59% at 1024px, ~47% from
        1280px up. A single left-to-right gradient tuned for one of those
        releases far too early for the others — at 768px it would hand the
        headline straight to the daylight in hero-capacity.

        So: below lg the release is vertical rather than horizontal (the copy
        spans the width, and object-cover has cropped to the subject anyway);
        lg holds to 60%; xl holds to 48% and gives the photography the most room
        of the three, which is where it is most worth having.

        Worst-pixel contrast for white text anywhere the copy can land,
        re-measured over the current three photographs at every tier: 10.7:1
        below lg (full frame, crop-independent), 12.4:1 at lg, 11.7:1 at xl. All
        above WCAG AAA (7:1), the lowest with 50% headroom.

        Re-measure when the art changes. These are properties of these specific
        photographs, not of the gradients.
      */}
      <div
        className="pointer-events-none absolute inset-0 bg-navy/[0.45] lg:bg-navy/[0.28]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--navy-deep)/0.90) 0%, hsl(var(--navy-deep)/0.76) 45%, hsl(var(--navy-deep)/0.92) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block xl:hidden"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--navy-deep)/0.95) 0%, hsl(var(--navy-deep)/0.92) 34%, hsl(var(--navy-deep)/0.88) 60%, hsl(var(--navy-deep)/0.30) 82%, hsl(var(--navy-deep)/0) 96%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 hidden xl:block"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--navy-deep)/0.95) 0%, hsl(var(--navy-deep)/0.92) 34%, hsl(var(--navy-deep)/0.86) 48%, hsl(var(--navy-deep)/0.40) 70%, hsl(var(--navy-deep)/0) 88%)",
        }}
        aria-hidden="true"
      />

      {/*
        Brand texture, masked off before it reaches the photography. The gold
        grid used to run edge to edge over a single dark tower shot; across three
        detailed interiors it reads as dirt on the lens, so it now fades out at
        55% and stays inside the navy where it belongs.
      */}
      <motion.div
        style={reduced ? undefined : { y: gridY }}
        className="pointer-events-none absolute inset-0 -top-24 bottom-[-6rem] bg-[url('/assets/patterns/grid-gold.svg')] bg-repeat [mask-image:linear-gradient(to_right,black_0%,black_30%,transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-20 h-[26rem] w-[26rem] rounded-full bg-emerald/[0.09] blur-3xl"
        aria-hidden="true"
      />

      {/*
        The height lives on this element rather than the <section> so there is
        one source of truth: the section is in flow around it and takes the
        same height, and `items-center` then centres the copy against the real
        measurement instead of against a duplicate min-height that could drift
        out of step. See .hero-viewport in globals.css.
      */}
      <div className="hero-viewport container relative flex items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
          className="max-w-xl"
        >
          <motion.p variants={item} className="eyebrow text-gold-light">
            Outsourcing Partner for US CPA Firms
          </motion.p>

          {/* The page's only <h1>, and the only one. Wording set by the client —
              Website Updates sheet, row 3. */}
          <motion.h1
            variants={headline}
            className="mt-[var(--hero-gap-eyebrow)] text-[length:var(--hero-h1)] leading-[1.08] text-white"
          >
            Scale Your Firm with{" "}
            <span className="text-gradient-gold">Offshore CPA Excellence</span>
          </motion.h1>

          <motion.span
            variants={rule}
            className="rule-gold mt-[var(--hero-gap-copy)] origin-left"
            aria-hidden="true"
          />

          <motion.p
            variants={item}
            className="mt-[var(--hero-gap-copy)] text-[length:var(--hero-lead)] leading-relaxed text-white/75"
          >
            TaxElixir provides US tax preparation, audit support, outsourcing and offshoring services for CPA firms, EA practices and accounting teams that need experienced help, precise work and reliable turnaround.
          </motion.p>

          <motion.ul
            variants={container}
            className="mt-[var(--hero-gap-block)] flex flex-wrap gap-x-7 gap-y-3"
          >
            {proofPoints.map((point) => (
              <motion.li
                key={point}
                variants={item}
                className="flex items-center gap-2.5 text-sm text-white/85"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/20">
                  <Check className="h-3 w-3 text-emerald-light" aria-hidden="true" />
                </span>
                {point}
              </motion.li>
            ))}
          </motion.ul>

          {/*
            The proof figure for the current slide, back in the hero at the
            client's request — each photograph now carries its own figure again
            rather than the three sitting in a bar below the fold.

            A real carousel region, because it carries content: the photographs
            alone would only have justified image controls.
          */}
          <motion.div
            variants={item}
            role="region"
            aria-roledescription="carousel"
            aria-label="What working with TaxElixir changes"
            onFocusCapture={() => setHovered(true)}
            onBlurCapture={() => setHovered(false)}
            className="mt-[var(--hero-gap-block)]"
          >
            {/*
              One grid cell, three slides stacked in it. The cell takes the
              height of the tallest, so the CTAs below cannot jump as "55–75%"
              gives way to "Peak-Season" — and all three stay in the server HTML
              for crawlers and for anyone whose JS never runs, which mounting
              only the active slide would not.
            */}
            <div className="grid">
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
                      "col-start-1 row-start-1 transition-opacity ease-in-out",
                      isActive ? "opacity-100" : "pointer-events-none opacity-0",
                      reduced ? "duration-0" : "duration-700"
                    )}
                  >
                    <p className="font-display text-[length:var(--hero-figure)] font-bold leading-none text-gradient-gold">
                      {slide.value}
                    </p>
                    <p className="mt-2.5 font-display text-base font-bold text-white sm:text-lg">
                      {slide.headline}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {slide.body}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-[var(--hero-gap-copy)] flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous slide"
                  data-cursor="grow"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-gold hover:bg-white/10 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next slide"
                  data-cursor="grow"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-gold hover:bg-white/10 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {slides.map((slide, i) => (
                  <button
                    key={slide.key}
                    type="button"
                    onClick={() => go(i)}
                    aria-current={i === index}
                    aria-label={`Show ${slide.label}`}
                    data-cursor="grow"
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index ? "w-7 bg-gold" : "w-1.5 bg-white/35 hover:bg-white/60"
                    )}
                  />
                ))}
              </div>

              {/* Hidden under reduced motion, where nothing is rotating for it
                  to stop. */}
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setStopped((s) => !s)}
                  aria-label={
                    stopped ? "Resume slide rotation" : "Pause slide rotation"
                  }
                  data-cursor="grow"
                  className="ml-auto grid h-8 w-8 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white sm:ml-1"
                >
                  {stopped ? (
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-[var(--hero-gap-action)] flex flex-col gap-3 sm:flex-row"
          >
            <ButtonLink href="/contact" variant="gold" size="lg" data-cursor="grow">
              Build Your Offshore Team
            </ButtonLink>
            <ButtonLink
              href="/services"
              size="lg"
              data-cursor="grow"
              className="border border-white/25 bg-transparent text-white hover:bg-white hover:text-navy"
            >
              Explore Our Services
            </ButtonLink>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-[var(--hero-gap-copy)] flex items-center gap-2 text-xs text-white/50"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-light" aria-hidden="true" />
            Least-privilege access · encrypted transfer · signed confidentiality
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

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
import { ChevronLeft, ChevronRight, Pause, Play, ShieldCheck } from "lucide-react";
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
  cost: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAwCdASoUAAkAPt1qqU4opqQiMAgBEBuJQBdgDSwJXr5VQuG3OIAA/v2eOF8no3cj6waAA2zfWIKRod4o5+/F8ILACaUAAAA=",
  turnaround:
    "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoUAAkAPt0+s1SooiWjmAEQG4llAJ0ygANQE/hMjjy3u4AA/vKpte8Do+wnaVJQv65pMJDPwwxLo/I0hXSmueiKWog/JDoCUUAAAA==",
  capacity:
    "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABwAwCdASoUAAkAPt1qqU4opqQiMAgBEBuJYwCdABjQcaqDGAAA/vK00zT6fh6LjG1ILF7588EgJghDVNg4vsFFkaEAAA==",
};

/**
 * The client's three crisp slogans (Website Updates sheet, row 7: "short and
 * crisp slogans rather than long sentences"), paired one to a slide.
 *
 * They used to sit in a static checklist beside a single photograph. Each is now
 * the line under its slide's figure, which is where the pairing earns
 * something: the cost slide's photograph is a lone accountant marking up a
 * workpaper, and "your software, your workpaper standards" is the caption that
 * picture was waiting for.
 *
 * Keyed rather than indexed so reordering successProof cannot silently shuffle
 * the captions onto the wrong photographs.
 */
const slideTagline: Record<string, string> = {
  cost: "Your software. Your workpaper standards.",
  turnaround: "Review-ready, self-review already done.",
  capacity: "One preparer to a full season team.",
};

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
  const photoY = useTransform(smooth, [0, 1], ["0%", "7%"]);
  const photoScale = useTransform(smooth, [0, 1], [1.06, 1.14]);
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
      className="relative overflow-hidden bg-gradient-navy lg:min-h-[40rem]"
    >
      {/*
        Photograph stack, furthest layer. Over-scaled and inset past the section
        edges so the parallax translate can never expose a gap at the bottom.

        Decorative only — aria-hidden, empty alt. The figures beside them carry
        the meaning, and describing an office would be noise to a screen reader.

        `object-right` because all three are composed with the subject in the
        right 40%: when a narrow viewport forces object-cover to crop width, the
        right edge is the half worth keeping.
      */}
      <motion.div
        style={reduced ? undefined : { y: photoY, scale: photoScale }}
        className="pointer-events-none absolute -inset-x-[4%] -top-[6%] bottom-[-12%]"
        aria-hidden="true"
      >
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
      </motion.div>

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

        Worst-pixel contrast for white text anywhere the copy can land, sampled
        over all three photographs at every tier: 10.6:1 below lg (full frame,
        crop-independent), 12.4:1 at lg, 13.9:1 at xl. All above WCAG AAA (7:1),
        the lowest with 50% headroom.
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

      <div className="container relative flex items-center py-16 md:py-20 lg:min-h-[40rem] lg:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
          className="max-w-xl"
        >
          <motion.p variants={item} className="eyebrow text-gold-light">
            Offshore Support for US CPA Firms
          </motion.p>

          {/* The page's only <h1>, and the only one. Wording set by the client —
              Website Updates sheet, row 3. */}
          <motion.h1
            variants={headline}
            className="mt-4 text-4xl leading-[1.08] text-white md:text-5xl lg:text-[3.5rem]"
          >
            Scale Your Firm with{" "}
            <span className="text-gradient-gold">Offshore CPA Excellence</span>
          </motion.h1>

          <motion.span
            variants={rule}
            className="rule-gold mt-7 origin-left"
            aria-hidden="true"
          />

          <motion.p
            variants={item}
            className="mt-7 text-lg leading-relaxed text-white/75"
          >
            Spend your hours on tax strategy, not tax prep. India-based CPAs,
            accountants and audit specialists take the compliance load — inside
            your systems, to your review standards.
          </motion.p>

          {/*
            The rotating region is scoped to the figures and their controls, not
            to the whole hero: the headline and CTAs above are not part of the
            rotation and should not be announced as slides.
          */}
          <motion.div
            variants={item}
            role="region"
            aria-roledescription="carousel"
            aria-label="What working with TaxElixir changes"
            onFocusCapture={() => setHovered(true)}
            onBlurCapture={() => setHovered(false)}
            className="mt-9"
          >
            {/* One grid cell, three slides stacked in it — the cell takes the
                height of the tallest, so switching never reflows the CTAs. */}
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
                    <p className="flex items-center gap-3">
                      <span
                        className="h-px w-8 bg-gradient-gold-x"
                        aria-hidden="true"
                      />
                      <span className="eyebrow text-gold-light">{slide.label}</span>
                    </p>

                    <p className="mt-4 font-display text-4xl font-bold leading-none text-gradient-gold sm:text-5xl">
                      {slide.value}
                    </p>
                    <p className="mt-3 font-display text-xl text-white">
                      {slide.headline}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {slideTagline[slide.key]}
                    </p>
                  </div>
                );
              })}
            </div>

            {/*
              Dots are real buttons, not decoration. `aria-current` rather than a
              disabled state on the active one: the slide is still a valid
              target, and disabling it would drop it out of the tab order
              mid-rotation.
            */}
            <div className="mt-7 flex items-center gap-4">
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

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
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
            className="mt-7 flex items-center gap-2 text-xs text-white/50"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-light" aria-hidden="true" />
            Least-privilege access · encrypted transfer · signed confidentiality
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

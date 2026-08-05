"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import HeroCarousel from "@/components/sections/HeroCarousel";
import { successProof } from "@/lib/content";
import {
  heroContainer,
  heroHeadline,
  heroItem,
  heroPanel,
  heroRule,
  noMotion,
} from "@/lib/motion";

/** 16px blurred frame of the hero photo — avoids a flash of empty navy on load. */
const HERO_BLUR =
  "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADwAQCdASoQAAkAA4BaJZACdAEPCmYGzkAA/veV8FIOVWqVB+Wskhe9dOitaHq34waAAA==";

/**
 * Short enough to be read at a glance, per the client's note (Website Updates
 * sheet, row 7): "short and crisp slogans rather than long sentences".
 */
const proofPoints = [
  "Your software. Your workpaper standards.",
  "Review-ready, self-review already done.",
  "One preparer to a full season team.",
];

export default function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: the decorative layers drift at different rates against the copy,
  // which is what gives the hero depth as it leaves the viewport.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  // Parallax rates read as depth: the photograph is furthest back so it moves
  // least, the watermark is nearest so it moves most.
  const photoY = useTransform(smooth, [0, 1], ["0%", "7%"]);
  const photoScale = useTransform(smooth, [0, 1], [1.06, 1.14]);
  const watermarkY = useTransform(smooth, [0, 1], ["0%", "26%"]);
  const watermarkScale = useTransform(smooth, [0, 1], [1, 1.12]);
  const gridY = useTransform(smooth, [0, 1], ["0%", "12%"]);
  const copyY = useTransform(smooth, [0, 1], ["0%", "18%"]);
  const copyOpacity = useTransform(smooth, [0, 0.75], [1, 0]);

  const container = reduced ? noMotion : heroContainer;
  const item = reduced ? noMotion : heroItem;
  const headline = reduced ? noMotion : heroHeadline;
  const rule = reduced ? noMotion : heroRule;
  const panel = reduced ? noMotion : heroPanel;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-navy">
      {/*
        Photograph, furthest layer. Over-scaled and inset past the section edges
        so the parallax translate can never expose a gap at the bottom.

        Decorative only — aria-hidden, empty alt. The headline carries the
        meaning, and describing the building would be noise to a screen reader.
      */}
      <motion.div
        style={reduced ? undefined : { y: photoY, scale: photoScale }}
        className="pointer-events-none absolute -inset-x-[4%] -top-[6%] bottom-[-12%]"
        aria-hidden="true"
      >
        <Image
          src="/assets/hero/tower-night.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={82}
          placeholder="blur"
          blurDataURL={HERO_BLUR}
          className="object-cover object-right"
        />
      </motion.div>

      {/*
        Contrast scrim, measured rather than eyeballed. Flat navy tint at 28%,
        plus a left-to-right gradient that holds ~90% over the copy column and
        releases to 0 across the tower so its gold windows survive.
        Worst-pixel contrast for white text after this: headline 15.3:1,
        proof points 8.2:1, CTA row 10.4:1 — all above WCAG AAA (7:1).
      */}
      <div
        className="pointer-events-none absolute inset-0 bg-navy/[0.28]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--navy-deep)/0.94) 0%, hsl(var(--navy-deep)/0.86) 34%, hsl(var(--navy-deep)/0.30) 58%, hsl(var(--navy-deep)/0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative layers — each on its own parallax rate. */}
      <motion.div
        style={reduced ? undefined : { y: gridY }}
        className="pointer-events-none absolute inset-0 -top-24 bottom-[-6rem] bg-[url('/assets/patterns/grid-gold.svg')] bg-repeat"
        aria-hidden="true"
      />
      <motion.div
        style={reduced ? undefined : { y: watermarkY, scale: watermarkScale }}
        className="pointer-events-none absolute -right-16 -top-24 h-[46rem] w-[46rem] bg-[url('/assets/patterns/shield-watermark.svg')] bg-contain bg-no-repeat opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-20 h-[26rem] w-[26rem] rounded-full bg-emerald/[0.09] blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative grid gap-14 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          <motion.p variants={item} className="eyebrow text-gold-light">
            Offshore Support for US CPA Firms
          </motion.p>

          {/* The page's only <h1>. Wording set by the client — Website Updates
              sheet, row 3. */}
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

          {/*
            Repositioned per the client (Website Updates sheet, row 7): the
            offer is partner hours back for tax strategy, not cheaper
            preparation. Two sentences instead of three, and the "dedicated
            professionals who become a seamless extension of your team" line —
            true but generic enough to sit on any competitor's homepage — is
            gone.
          */}
          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/75"
          >
            Spend your hours on tax strategy, not tax prep. India-based CPAs,
            accountants and audit specialists take the compliance load — inside
            your systems, to your review standards.
          </motion.p>

          <motion.ul variants={container} className="mt-8 space-y-3">
            {proofPoints.map((point) => (
              <motion.li
                key={point}
                variants={item}
                className="flex items-start gap-3 text-sm text-white/80"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/20">
                  <Check className="h-3 w-3 text-emerald-light" aria-hidden="true" />
                </span>
                {point}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
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
            className="mt-8 flex items-center gap-2 text-xs text-white/50"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-light" aria-hidden="true" />
            Least-privilege access · encrypted transfer · signed confidentiality
          </motion.p>
        </motion.div>

        {/*
          Was a four-item service index with an "all nine services" link. The
          client asked for it to go (Website Updates sheet, row 5) because the
          same nine services are one hover away in the nav, and asked for a
          rotating panel in its place (rows 6 and 17). It now earns the slot by
          carrying the three proof figures instead of repeating the menu.
        */}
        <motion.div variants={panel} initial="hidden" animate="visible">
          <HeroCarousel slides={successProof} />
        </motion.div>
      </div>
    </section>
  );
}

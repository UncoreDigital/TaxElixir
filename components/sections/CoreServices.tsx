"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { services } from "@/lib/services-data";
import { gridCard, gridContainer, noMotion, viewportOnce } from "@/lib/motion";

/**
 * Service grid, built to the client's reference card.
 *
 * The proportions are the design, so they are worth stating rather than
 * leaving to be re-derived from the class list:
 *
 *   - The photograph is 4:3 and takes roughly half the card's height. A wider
 *     crop (16:9, 16:10) collapses the card into a caption with a strip above
 *     it and stops reading as the reference at all.
 *   - Radius is 1.5rem on the card, and the photo carries the top two corners
 *     while the navy panel carries the bottom two, so the two halves read as
 *     one shape rather than a picture resting on a box.
 *   - The arrow button is two nested circles. The outer one is filled with the
 *     section's own background and hangs 16px past the panel's right edge, so
 *     it reads as a scoop bitten out of the navy rather than a disc floating on
 *     top of it. Keep that fill (`bg-slate-50`) in step with the section
 *     background — if the two drift apart the illusion breaks and it becomes a
 *     grey ring. It clears the right edge only; the bottom stays inside.
 *   - The column gap is the one measurement that did not come down when the
 *     cards were scaled: the disc's 16px overhang eats into it, so `gap-x-6`
 *     leaves only 8px between a disc and the next card and anything tighter
 *     has them touching. Shrink the cards via `max-w`, not the gap.
 *
 * Navy panel, gold accents — the logo's own pairing, so the grid reads as part
 * of the brand rather than borrowing a third colour. An earlier pass used the
 * mint trust accent here; it was legible but green is reserved for
 * verified/secure/success states elsewhere on the site, so on nine cards it
 * became the loudest colour on the page and read as a second brand.
 *
 * The two golds are not interchangeable:
 *   - Title text is --gold-light (#D8B460), 7.6:1 on navy, so it clears AAA at
 *     this size. Flat --gold (#CBA85A) is 6.6:1 and gets muddy in the thin
 *     strokes of the display face.
 *   - The arrow disc carries the shield's vertical gradient (bg-gradient-gold)
 *     rather than a flat fill, which is what the mark itself does. The navy
 *     arrow on it holds 6.4:1 even at the gradient's dark end.
 * Keeping the fill for the title and the fill for the disc distinct is what
 * stops nine gold discs from flattening into a wall of brass.
 */
export default function CoreServices() {
  const reduced = useReducedMotion();

  return (
    <section className="section bg-slate-50">
      <div className="container">
        <SectionHeading
          eyebrow="What We Do"
          title="Nine service lines. One way of working."
          intro="Every engagement is handled by offshore professionals working inside your tax, audit and accounting systems, so your team does not have to migrate data or learn a new platform."
        />

        <motion.div
          variants={reduced ? noMotion : gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto mt-12 grid max-w-[62rem] gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.slug}
              variants={reduced ? noMotion : gridCard}
              className="h-full"
            >
              <Link
                href={`/services/${service.slug}`}
                data-cursor="grow"
                className="group relative flex h-full flex-col rounded-3xl transition-transform duration-500 hover:-translate-y-1.5"
              >
                {/* Decorative — the name directly below already identifies the
                    service, so a description here would only repeat it. */}
                <span className="relative block aspect-[4/3] overflow-hidden rounded-t-3xl bg-navy/10">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    aria-hidden="true"
                  />
                </span>

                <span className="relative flex flex-1 flex-col rounded-b-3xl bg-navy p-5 sm:p-6 lg:p-7">
                  <span className="block font-display text-base font-bold leading-snug text-gold-light sm:text-lg lg:text-xl">
                    {service.title}
                  </span>
                  <span className="mt-2.5 block text-sm leading-relaxed text-white/75">
                    {service.teaser}
                  </span>

                  {/* The button follows the blurb rather than being pinned to
                      the foot of the panel, so a short card does not open a
                      void of navy above it. In a row of equal-height cards the
                      tallest one therefore sets where the button lands and the
                      others sit a line or two higher — which is what the
                      reference does too.

                      The negative margins cancel the panel's own padding and
                      then add the overhang, so the scoop lands 16px past the
                      right edge and 8px shy of the bottom. They therefore have
                      to step with the padding above: -mr is padding + 1rem and
                      -mb is padding - 0.5rem at every breakpoint. */}
                  <span
                    className="-mb-3 -mr-9 flex justify-end pt-5 sm:-mb-4 sm:-mr-10 lg:-mb-5 lg:-mr-11 lg:pt-6"
                    aria-hidden="true"
                  >
                    <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-slate-50 lg:h-20 lg:w-20">
                      <span className="bg-gradient-gold flex h-12 w-12 items-center justify-center rounded-full text-navy transition-transform duration-300 group-hover:scale-105 lg:h-14 lg:w-14">
                        <ArrowUpRight className="h-[1.125rem] w-[1.125rem] lg:h-5 lg:w-5" strokeWidth={2.5} />
                      </span>
                    </span>
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

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
 *   - The photograph is 3:2 and takes roughly half the card's height. Wider
 *     than that (16:9, 16:10) collapses the card into a caption with a strip
 *     above it and stops reading as the reference at all; 4:3 was the first
 *     pass and made the card tall enough that the navy panel could not fill
 *     itself on the shorter blurbs.
 *   - Radius is 1.5rem on the card, and the photo carries the top two corners
 *     while the navy panel carries the bottom two, so the two halves read as
 *     one shape rather than a picture resting on a box.
 *   - The arrow button is two nested circles. The outer one is filled with the
 *     section's own background and hangs 16px past the panel's right edge, so
 *     it reads as a scoop bitten out of the navy rather than a disc floating on
 *     top of it. Keep that fill (`bg-slate-50`) in step with the section
 *     background: if the two drift apart the illusion breaks and it becomes a
 *     grey ring. It clears the right edge only; the bottom stays inside.
 *   - The disc is deliberately smaller than it first was (56px / 64px outer,
 *     down from 72px / 80px). Because the cards in a row stretch to a common
 *     height, whatever the disc block reserves is charged to every card in the
 *     row, including the ones whose text does not need it — so an oversized
 *     disc reads as a pool of dead navy on the shortest card rather than as a
 *     bigger button. The white ring is 8px at both sizes, which is the point
 *     where it stops reading as a scoop and starts reading as an outline.
 *   - The column gap is the one measurement that did not come down when the
 *     cards were scaled: the disc's 16px overhang eats into it, so `gap-x-6`
 *     leaves only 8px between a disc and the next card and anything tighter
 *     has them touching. Shrink the cards via `max-w`, not the gap.
 *   - The footer rule is what holds a row together. Blurbs run four to six
 *     lines, so the cards in a row can never end their text at the same
 *     height; pinning a ruled footer to the bottom of each gives the eye one
 *     horizontal line to read across instead of three ragged text edges, and
 *     turns the leftover height into a band with something in it.
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
                <span className="relative block aspect-[3/2] overflow-hidden rounded-t-3xl bg-navy/10">
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
                  {/* No reserved second line. A floor here bought level blurb
                      starts at the cost of a visible hole under every one-line
                      name, which was the more obvious of the two faults. The
                      footer rule below is what carries the row's alignment
                      now. */}
                  <span className="block font-display text-base font-bold leading-snug text-gold-light sm:text-lg lg:text-xl">
                    {service.title}
                  </span>
                  <span className="mt-2.5 block text-sm leading-relaxed text-white/75">
                    {service.teaser}
                  </span>

                  {/*
                    A footer, not a gap.

                    Cards in a grid row stretch to the tallest, so the slack has
                    to go somewhere; the previous pass put it all above a lone
                    disc, which left a pool of navy with nothing in it. Giving
                    the bottom a hairline rule and a label makes that band read
                    as a deliberate footer rather than as space nobody filled —
                    and `mt-auto` pins it, so the rules line up across the row
                    and the eye reads one horizontal band instead of three
                    ragged ones.

                    The label is the affordance the card was missing. The disc
                    alone said "clickable" only to someone who already knew;
                    "Explore" says what happens, and both it and the disc
                    respond to the same group hover.
                  */}
                  <span className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4 lg:pt-5">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/45 transition-colors duration-300 group-hover:text-gold-light">
                      Explore
                    </span>

                    {/* The negative margins cancel the panel's own padding and
                        then add the overhang, so the scoop lands 16px past the
                        right edge and 8px shy of the bottom. They therefore
                        have to step with the padding above: -mr is padding +
                        1rem and -mb is padding - 0.5rem at every breakpoint. */}
                    <span
                      className="-mb-3 -mr-9 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-50 sm:-mb-4 sm:-mr-10 lg:-mb-5 lg:-mr-11 lg:h-16 lg:w-16"
                      aria-hidden="true"
                    >
                      <span className="bg-gradient-gold flex h-10 w-10 items-center justify-center rounded-full text-navy transition-transform duration-300 group-hover:scale-105 lg:h-12 lg:w-12">
                        <ArrowUpRight className="h-4 w-4 lg:h-[1.125rem] lg:w-[1.125rem]" strokeWidth={2.5} />
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

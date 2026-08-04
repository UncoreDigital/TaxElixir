import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import Placeholder from "@/components/Placeholder";
import { software } from "@/lib/content";
import { softwareLogo, softwareLogoCount } from "@/lib/software-logos";

/**
 * Logo wall for the platforms we work inside.
 *
 * A grid rather than the 4-at-a-time carousel on the reference site: there are
 * ten tools and they all fit, so paging them behind arrows would hide the point
 * of the section — the length of the list *is* the message. No client JS either.
 *
 * Cards keep a fixed height with the logo `object-contain` inside, because
 * vendor artwork arrives at wildly different aspect ratios; a wide Oracle
 * NetSuite lockup and a square Sage mark still have to sit on one baseline.
 */
export default function Software() {
  const supplied = softwareLogoCount();

  return (
    <section className="section bg-muted/50">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Technology"
          title="We work in your software, not ours"
          intro="There is nothing to migrate and nothing new for your staff to learn. Your tax software, your document management, your workpaper templates."
        />

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {software.map((tool) => {
            const logo = softwareLogo(tool.slug);

            return (
              <li key={tool.slug}>
                <div className="flex h-28 items-center justify-center rounded-xl border border-border bg-white px-5 shadow-soft transition-shadow hover:shadow-card">
                  {logo ? (
                    <Image
                      src={logo}
                      alt={tool.name}
                      width={200}
                      height={80}
                      sizes="200px"
                      // The optimizer 400s on SVG unless dangerouslyAllowSVG is
                      // set globally, and there is nothing in a vector for it to
                      // optimize. Passing SVG through avoids widening the image
                      // endpoint for every upload just to serve ten logos.
                      unoptimized={logo.endsWith(".svg")}
                      className="max-h-12 w-auto object-contain"
                    />
                  ) : (
                    /*
                      Wordmark fallback. Vendor logos are third-party trademarks:
                      they cannot be redrawn or approximated, and an honest
                      wordmark beats a lookalike. It also keeps the row uniform
                      while the real artwork is being collected.
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
            );
          })}
        </ul>

        {supplied < software.length && (
          <p className="mt-8 flex justify-center">
            <Placeholder
              label={`${software.length - supplied} of ${software.length} logos missing — drop <slug>.svg into public/assets/software/`}
            />
          </p>
        )}

        <p className="mt-8 text-center text-sm text-ink-muted">
          Working in a platform not listed here?{" "}
          <a
            href="/contact"
            className="font-medium text-navy underline decoration-gold/60 underline-offset-2"
          >
            Ask us
          </a>{" "}
          — the list above is not exhaustive.
        </p>
      </div>
    </section>
  );
}

import SectionHeading from "@/components/SectionHeading";
import SoftwareCarousel, { type SoftwareItem } from "@/components/sections/SoftwareCarousel";
import { software } from "@/lib/content";
import { softwareLogo } from "@/lib/software-logos";

/**
 * Logo wall for the platforms we work inside.
 *
 * Logo paths resolve here, on the server, because lib/software-logos reads the
 * filesystem at build time — the carousel below is a client component and must
 * receive plain data, not a lookup that needs `node:fs`.
 */
export default function Software() {
  const items: SoftwareItem[] = software.map((tool) => ({
    ...tool,
    logo: softwareLogo(tool.slug),
  }));

  return (
    <section className="section bg-muted/50">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Technology"
          title="We work in your software"
          intro="Nothing to migrate to. Nothing new to learn."
        />

        <div className="mt-12">
          <SoftwareCarousel items={items} />
        </div>

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

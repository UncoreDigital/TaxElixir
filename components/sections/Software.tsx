import SectionHeading from "@/components/SectionHeading";
import Placeholder from "@/components/Placeholder";
import SoftwareCarousel, { type SoftwareItem } from "@/components/sections/SoftwareCarousel";
import { software } from "@/lib/content";
import { softwareLogo, softwareLogoCount } from "@/lib/software-logos";

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

  const missing = software.length - softwareLogoCount();

  return (
    <section className="section bg-muted/50">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Technology"
          title="We work in your software, not ours"
          intro="There is nothing to migrate and nothing new for your staff to learn. Your tax software, your document management, your workpaper templates."
        />

        <div className="mt-12">
          <SoftwareCarousel items={items} />
        </div>

        {missing > 0 && (
          <p className="mt-6 flex justify-center">
            <Placeholder
              label={`${missing} of ${software.length} logos missing — drop <slug>.svg into public/assets/software/`}
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

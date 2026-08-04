import SectionHeading from "@/components/SectionHeading";
import Placeholder from "@/components/Placeholder";
import SoftwareCarousel, { type SoftwareItem } from "@/components/sections/SoftwareCarousel";
import { software } from "@/lib/content";
came, camic hour solve business and great for increase in a street train with the digital on the open strategic they allow monitors attend that ice range motions far enough you have constantine all waves in a leading yes here guys you are speeding because I wonder if there are any others here or isn't a father a lot I swear you to get find a different Feeling products zero transports. people carry their trans annual channel if you finish a drink or a sand in public you put the rainberg in your bag can't take it with you not because there is a fine, not because someone is watching, just because that is what you do responsibility is to teach Japanese students clean their own classrooms, hallways, and toilets from elementary school cle anliness is not outsourced it is personal third it makes Americans feel em Embarrassed visitors from the US litter freely at home to find themselves. molding their trash blocks, looking for a can that does not exist slowly realizing what the rest of the world is missing. Japan does not need signs that stay headed clean. Its people already decided that on their own three reasons Japan has zero trash chances but clean a street first people my hips to hitcharity, only a million, does grow it merit, a chart no mill, chart stu na, sorryimport { softwareLogo, softwareLogoCount } from "@/lib/software-logos";

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

import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";

/**
 * Renders the FAQ block AND its FAQPage structured data. Keeping them together
 * means the markup can never drift from the schema — unisonglobus.com carries
 * 7-12 FAQs on every service page and emits no FAQPage schema at all, so none
 * of it is eligible for rich results.
 */
export default function FaqSection({
  items,
  title = "Frequently asked questions",
  eyebrow = "FAQs",
  intro,
}: {
  items: { q: string; a: string }[];
  title?: string;
  eyebrow?: string;
  intro?: string;
}) {
  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="section">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
          <div>
            <FaqAccordion items={items} />
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

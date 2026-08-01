import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { whyUs } from "@/lib/content";

export default function WhyUs() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Why Firms Work With Us"
          title="Built around how a CPA firm actually operates"
          intro="Outsourcing fails when the provider optimises for their own throughput instead of your review process. Every decision below is made the other way round."
        />

        <div className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="border-t border-border pt-6">
                <span
                  className="mb-4 block h-0.5 w-10 bg-gradient-gold-x"
                  aria-hidden="true"
                />
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { workflow } from "@/lib/content";

export default function Workflow() {
  return (
    <section className="section bg-muted/50">
      <div className="container">
        <SectionHeading
          eyebrow="How We Work"
          title="Five steps from first call to steady state"
          intro="No client data moves before scope and terms are agreed in writing, and no volume ramps before you have inspected a pilot batch against your own standards."
        />

        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {workflow.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.06}>
              <li className="relative h-full rounded-xl border border-border bg-white p-6 shadow-soft">
                <span className="font-display text-3xl text-gradient-gold">
                  {step.step}
                </span>
                <h3 className="mt-4 text-base leading-snug">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

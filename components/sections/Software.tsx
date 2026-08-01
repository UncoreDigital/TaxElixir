import SectionHeading from "@/components/SectionHeading";
import Placeholder from "@/components/Placeholder";
import { software } from "@/lib/content";

export default function Software() {
  return (
    <section className="section bg-muted/50">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Technology"
          title="We work in your software, not ours"
          intro="There is nothing to migrate and nothing new for your staff to learn. Your tax software, your document management, your workpaper templates."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {software.map((tool) => (
            <span
              key={tool.name}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-navy shadow-soft"
            >
              {tool.name}
              {!tool.verified && <Placeholder label="verify" />}
            </span>
          ))}
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

import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import FaqSection from "@/components/sections/FaqSection";
import CTA from "@/components/sections/CTA";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQs — Outsourcing to TaxElixir",
  description:
    "Answers to the questions US CPA firms ask before outsourcing: which returns we prepare, how audit support works, data security, engagement models and who owns the client relationship.",
  alternates: { canonical: "/faqs" },
};

export default function FaqsPage() {
  return (
    <>
      <PageBanner
        eyebrow="FAQs"
        title="Questions firms ask before they engage us"
        crumbs={[{ name: "FAQs" }]}
        intro="If your question is not answered here, ask it directly — we would rather resolve it before an engagement than during one."
      />

      <FaqSection items={faqs} title="Everything firms ask us" eyebrow="Answers" />
      <CTA
        title="Still have a question?"
        body="Send it over. You will get a direct answer from someone who does the work, not a sales response."
      />
    </>
  );
}

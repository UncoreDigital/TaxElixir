import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck, Upload } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import ContactForm from "@/components/ContactForm";
import Placeholder from "@/components/Placeholder";
import DisclaimerBand from "@/components/DisclaimerBand";
import { getContactDetails } from "@/lib/settings";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact TaxElixir — Talk to Us About Capacity",
  description:
    "Tell us what work you want to move off your team's desk. We will tell you honestly whether we are the right fit, and propose a pilot you can judge us on.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  // Phone and address come from Admin -> Site Settings.
  const contact = await getContactDetails();

  return (
    <>
      <PageBanner
        eyebrow="Contact"
        title="Tell us what you need covered"
        crumbs={[{ name: "Contact" }]}
        intro="Describe the work, the volumes and the software. You will get a direct answer from someone who does the work — and if we are not the right fit, we will say so on the first call."
      />

      <section className="section">
        <div className="container grid gap-14 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-border bg-white p-8 shadow-soft md:p-10">
            <h2 className="text-2xl">Send us an enquiry</h2>
            <p className="mt-2.5 text-sm text-ink-muted">
              Fields marked <span className="text-gold-dark">*</span> are required.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-muted/50 p-7">
              <h2 className="text-lg">Direct contact</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden="true" />
                  <a href={site.emailHref} className="text-navy underline decoration-gold/60 underline-offset-2">
                    {site.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden="true" />
                  {contact.phone ? (
                    <a href={contact.phoneHref ?? undefined} className="text-navy">
                      {contact.phone}
                    </a>
                  ) : (
                    <span className="text-ink-muted">
                      Phone number <Placeholder label="client to supply" />
                    </span>
                  )}
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden="true" />
                  {contact.address ? (
                    <span className="text-ink-muted">{contact.address}</span>
                  ) : (
                    <span className="text-ink-muted">
                      Office address <Placeholder label="client to supply" />
                    </span>
                  )}
                </li>
              </ul>
            </div>

            <Link
              href="/upload"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-white p-7 shadow-soft transition-all hover:border-gold/40 hover:shadow-card"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-gold-x text-navy">
                <Upload className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-lg font-bold text-navy">
                  Sending documents?
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-ink-muted">
                  Use our secure upload instead of email. Files go to a private,
                  access-controlled store — never a public link.
                </span>
              </span>
            </Link>

            <div className="rounded-2xl border border-border bg-white p-7 shadow-soft">
              <ShieldCheck className="h-5 w-5 text-gold-dark" aria-hidden="true" />
              <h2 className="mt-3 text-lg">Running due diligence?</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                Send your security questionnaire or DPA and we will complete it.
                See our{" "}
                <Link href="/security" className="text-navy underline decoration-gold/60 underline-offset-2">
                  Security &amp; Compliance
                </Link>{" "}
                page first.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <DisclaimerBand />
    </>
  );
}

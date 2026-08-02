import Link from "next/link";
import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/brand/Logo";
import NewsletterForm from "@/components/NewsletterForm";
import Placeholder from "@/components/Placeholder";
import { getContactDetails } from "@/lib/settings";
import { footerNav, site } from "@/lib/site";

export default async function Footer() {
  const year = new Date().getFullYear();
  const contact = await getContactDetails();

  return (
    <footer className="bg-gradient-navy text-white/70">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            {/*
              The supplied logo.jpeg carries a near-white field, so placing it
              here left a white patch on the navy. The vector lockup recolours
              for dark backgrounds and stays crisp at any size.
            */}
            <Link href="/" aria-label={`${site.name} — home`} className="inline-flex h-12">
              <Logo tone="light" showTagline idPrefix="footer" />
            </Link>
            <p className="mt-6 text-sm leading-relaxed">{site.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href={site.emailHref}
                className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-gold-light"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {site.email}
              </a>

              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${site.name} on LinkedIn`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-gold-light"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                  LinkedIn
                </a>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-light">
                Stay in the loop
              </h2>
              <div className="mt-4">
                <NewsletterForm />
              </div>
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.heading}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-light">
                {col.heading}
              </h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact block — US delivery hours and reach-us details. */}
        <div className="mt-14 grid gap-6 rounded-xl border border-white/12 bg-white/[0.04] p-7 sm:grid-cols-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-light">
              Email
            </h2>
            <a
              href={site.emailHref}
              className="mt-2.5 flex items-start gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              {site.email}
            </a>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-light">
              Phone
            </h2>
            <p className="mt-2.5 flex items-start gap-2 text-sm text-white/80">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              {contact.phone ? (
                <a href={contact.phoneHref ?? undefined} className="hover:text-white">
                  {contact.phone}
                </a>
              ) : (
                <span className="flex flex-wrap items-center gap-2">
                  Not yet published
                  <Placeholder label="client to supply" />
                </span>
              )}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-light">
              Offices
            </h2>
            <p className="mt-2.5 flex items-start gap-2 text-sm text-white/80">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              {contact.address ? (
                contact.address
              ) : (
                <span className="flex flex-wrap items-center gap-2">
                  India — serving US CPA firms
                  <Placeholder label="address to supply" />
                </span>
              )}
            </p>
          </div>
        </div>

        {/*
          Required disclaimer, taken verbatim from the client's services deck.
          It is a liability boundary, not marketing copy — it appears on every
          page and must not be softened.
        */}
        <div className="mt-14 rounded-lg border border-white/15 bg-white/5 p-5">
          <p className="text-sm leading-relaxed text-white/85">
            <strong className="font-semibold text-white">Important:</strong>{" "}
            {site.disclaimer}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-8 text-sm sm:flex-row sm:items-center">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/sitemap.xml" className="transition-colors hover:text-white">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

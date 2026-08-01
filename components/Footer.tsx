import Link from "next/link";
import { Mail } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { footerNav, site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

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

            <a
              href={site.emailHref}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-gold-light"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {site.email}
            </a>
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

import Link from "next/link";
import { LogIn, Mail, Phone, ShieldCheck } from "lucide-react";
import Placeholder from "@/components/Placeholder";
import { getContactDetails } from "@/lib/settings";
import { features, site } from "@/lib/site";

/**
 * Persistent utility strip above the header.
 *
 * Contact details sit above the fold on every page because this audience picks
 * up the phone rather than filling in a form — a CPA firm partner evaluating an
 * offshore provider wants to hear a voice before sending client data.
 */
export default async function TopBar() {
  // Phone comes from Admin → Site Settings; lib/site.ts is only the fallback.
  const contact = await getContactDetails();

  return (
    <div className="hidden border-b border-white/10 bg-navy-deep text-white/70 md:block">
      <div className="container flex h-10 items-center justify-between gap-6 text-xs">
        {/*
          Contact moved from the left of this strip to the right at the client's
          request (Website Updates sheet, row 4). The utility links lead instead,
          which puts the phone and email at the end of the scan rather than the
          start — the position a reader's eye returns to when they have decided
          to make contact.
        */}
        <div className="flex items-center gap-5">
          <Link
            href="/security"
            className="flex items-center gap-2 transition-colors hover:text-gold-light"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Security &amp; Compliance
          </Link>
          {/*
            Labelled "Client Portal" rather than "Client Login" on purpose: there
            is no authenticated client area yet, and a login link that opens an
            upload form is the kind of small dishonesty that costs trust on a
            site selling security. Secure document exchange is the real feature
            it points at. A true per-client portal is a separate build — see the
            client content-gap doc.

            Parked behind features.clientPortal. The separator goes with it so
            the strip does not end on a dangling pipe.
          */}
          {features.clientPortal && (
            <>
              <span className="hidden text-white/30 lg:inline" aria-hidden="true">
                |
              </span>
              <Link
                href="/upload"
                data-cursor="grow"
                className="hidden items-center gap-1.5 rounded border border-white/20 px-3 py-1 transition-colors hover:border-gold hover:text-gold-light lg:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                Client Portal
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-6">
          {contact.phone ? (
            <a
              href={contact.phoneHref ?? undefined}
              className="flex items-center gap-2 transition-colors hover:text-gold-light"
            >
              <Phone className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span className="font-medium tracking-wide">{contact.phone}</span>
            </a>
          ) : (
            /*
              Rendered only in development. A phone row that reads "Phone —
              client to supply" is a note to the client, not something to show a
              CPA firm partner; in production the strip simply carries the email
              until a number is entered under Admin → Site Settings.
            */
            process.env.NODE_ENV !== "production" && (
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Phone</span>
                <Placeholder label="client to supply" />
              </span>
            )
          )}

          <a
            href={site.emailHref}
            className="flex items-center gap-2 transition-colors hover:text-gold-light"
          >
            <Mail className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span className="font-medium tracking-wide">{site.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

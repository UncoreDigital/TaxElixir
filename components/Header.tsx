"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur transition-shadow",
        scrolled ? "border-border shadow-soft" : "border-transparent"
      )}
    >
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${site.name} — home`}>
          <Image
            src={site.headerLogo}
            alt={`${site.name} — ${site.tagline}`}
            width={site.headerLogoWidth}
            height={site.headerLogoHeight}
            // Without this, Next sizes the srcset from the 3010px intrinsic
            // width and ships a 3840px render — priority-loaded, on every page —
            // for a slot ~180px wide. 180px lets it pick a 384w variant instead.
            sizes="180px"
            priority
            className="h-11 w-auto md:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <div key={item.name} className="group relative">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-navy"
                    : "text-ink-muted hover:text-navy"
                )}
              >
                {item.name}
                {item.dropdown && (
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" aria-hidden="true" />
                )}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-gold-x" aria-hidden="true" />
                )}
              </Link>

              {item.dropdown && (
                <div className="invisible absolute left-0 top-full z-50 w-[19rem] translate-y-1 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="mt-2 overflow-hidden rounded-lg border border-border bg-white p-1.5 shadow-lift">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block rounded-md px-3 py-2.5 transition-colors hover:bg-muted"
                      >
                        <span className="block text-sm font-medium text-navy">{sub.name}</span>
                        {sub.blurb && (
                          <span className="mt-0.5 block text-xs leading-snug text-ink-muted">
                            {sub.blurb}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <ButtonLink href="/contact" variant="gold" size="sm">
            Book a Discovery Call
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-navy lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div id="mobile-nav" className="fixed inset-0 top-20 z-50 overflow-y-auto bg-white lg:hidden">
          <nav className="container py-6" aria-label="Mobile">
            {navItems.map((item) => (
              <div key={item.name} className="border-b border-border last:border-0">
                {item.dropdown ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenGroup(openGroup === item.name ? null : item.name)}
                      className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-navy"
                      aria-expanded={openGroup === item.name}
                    >
                      {item.name}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openGroup === item.name && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {openGroup === item.name && (
                      <div className="pb-3 pl-3">
                        <Link
                          href={item.href}
                          className="block py-2 text-sm font-medium text-navy underline decoration-gold/60 underline-offset-4"
                        >
                          All {item.name}
                        </Link>
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block py-2 text-sm text-ink-muted"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href} className="block py-4 text-base font-medium text-navy">
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            <ButtonLink href="/contact" variant="gold" size="lg" className="mt-6 w-full">
              Book a Discovery Call
            </ButtonLink>
            <a
              href={site.emailHref}
              className="mt-4 block text-center text-sm text-ink-muted"
            >
              {site.email}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

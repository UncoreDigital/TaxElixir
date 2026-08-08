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
  const [menuGroup, setMenuGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer and any open dropdown on navigation.
  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
    setMenuGroup(null);
  }, [pathname]);

  // Escape closes an open dropdown — expected of any menu, and the only way
  // out for a keyboard user who opened one and does not want to tab through it.
  useEffect(() => {
    if (!menuGroup) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuGroup(null);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuGroup]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur transition-shadow",
          scrolled ? "border-border shadow-soft" : "border-transparent"
        )}
      >
      <div className="container flex h-24 items-center justify-between gap-4 md:h-28">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${site.name} — home`}>
          {/*
            Sized up from h-11/h-12 at the client's request (Website Updates
            sheet, row 2): the tagline is set inside the artwork at roughly 1/14
            of its height, so at 44px tall it rendered around 8px and was not
            readable. h-16/h-20 puts it near 11px and 14px respectively.

            The bar grows with it — h-24/h-28 against a 20px logo cap keeps the
            same optical padding the h-20 bar had, rather than letting the
            lockup crowd the edges.
          */}
          <Image
            src={site.headerLogo}
            alt={`${site.name} — ${site.tagline}`}
            width={site.headerLogoWidth}
            height={site.headerLogoHeight}
            // Without this, Next sizes the srcset from the 3010px intrinsic
            // width and ships a 3840px render — priority-loaded, on every page —
            // for a slot ~300px wide. 300px lets it pick a 640w variant instead.
            sizes="300px"
            priority
            className="h-16 w-auto md:h-20"
          />
        </Link>

        {/*
          Dropdown visibility is state, not `group-hover`/`group-focus-within`.

          As pure CSS it could not close on click, which is what made choosing an
          item feel broken: the click focuses the link, focus-within holds the
          panel open, and the App Router navigates without unmounting the header
          — so the reader arrived on the new page with the menu still hanging
          over it, until they happened to move the mouse away.

          Closing a focused panel does not strand focus inside hidden content:
          `invisible` is visibility:hidden, which makes the descendant
          unfocusable and hands focus back to the document.
        */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => {
            const isOpen = menuGroup === item.name;

            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setMenuGroup(item.name)}
                onMouseLeave={() => item.dropdown && setMenuGroup(null)}
                // Keyboard parity with hover: tabbing in opens, tabbing past
                // the last item closes. relatedTarget is where focus is going —
                // still inside this group means it stays open.
                onFocusCapture={() => item.dropdown && setMenuGroup(item.name)}
                onBlurCapture={(e) => {
                  if (
                    item.dropdown &&
                    !e.currentTarget.contains(e.relatedTarget as Node | null)
                  ) {
                    setMenuGroup(null);
                  }
                }}
              >
                <Link
                  href={item.href}
                  aria-expanded={item.dropdown ? isOpen : undefined}
                  // The parent is a real link as well as a menu trigger, so it
                  // needs the same close-on-click as the items beneath it.
                  onClick={() => setMenuGroup(null)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-navy"
                      : "text-ink-muted hover:text-navy"
                  )}
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        isOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  )}
                  {isActive(item.href) && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-gold-x" aria-hidden="true" />
                  )}
                </Link>

                {item.dropdown && (
                  <div
                    className={cn(
                      "absolute left-0 top-full z-50 w-[19rem] transition-all",
                      isOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible translate-y-1 opacity-0"
                    )}
                  >
                    <div className="mt-2 overflow-hidden rounded-lg border border-border bg-white p-1.5 shadow-lift">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMenuGroup(null)}
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
            );
          })}
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
      </header>

      {/*
        The drawer is a SIBLING of <header>, not a child, and that placement is
        load-bearing.

        The header carries `backdrop-blur`, and a backdrop-filter establishes a
        containing block for position:fixed descendants — the same way transform
        does. Nested inside, this element's `inset-0` resolved against the
        header's own box instead of the viewport, so the top offset plus
        `bottom: 0` computed to exactly zero height. The menu opened, locked
        body scroll and rendered its links, all at 0px tall: invisible, and it
        looked for all the world like the button was dead.

        The offset tracks the header's height at every breakpoint the drawer is
        reachable at — h-24 below md, h-28 from md up. Leave one behind when the
        bar is resized and the drawer either overlaps the logo or floats.
      */}
      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-24 z-50 overflow-y-auto bg-white md:top-28 lg:hidden"
        >
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
                        {/*
                          The pathname effect closes the drawer on navigation,
                          but a link to the page you are already on does not
                          change the pathname and so would never fire it —
                          leaving the drawer sitting open over the page the
                          reader just asked for. Closing here covers both.
                        */}
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-sm font-medium text-navy underline decoration-gold/60 underline-offset-4"
                        >
                          All {item.name}
                        </Link>
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-sm text-ink-muted"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-base font-medium text-navy"
                  >
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
    </>
  );
}

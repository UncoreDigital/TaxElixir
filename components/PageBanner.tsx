import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type Crumb = { name: string; href?: string };

/**
 * Page hero. Owns the single <h1> for every inner page — section components
 * never emit one, which is how a page ends up with three.
 */
export default function PageBanner({
  eyebrow,
  title,
  intro,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-navy">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container relative py-16 md:py-24">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.name} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-white">
                      {c.name}
                    </Link>
                  ) : (
                    <span className="text-white/90">{c.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && <p className="eyebrow mb-3 text-gold-light">{eyebrow}</p>}

        <h1 className="max-w-4xl text-4xl leading-[1.12] text-white md:text-5xl">
          {title}
        </h1>

        <span className="rule-gold mt-6" aria-hidden="true" />

        {intro && (
          <div className="mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
            {intro}
          </div>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

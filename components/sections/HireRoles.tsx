import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { roles } from "@/lib/hire-data";
import { getIcon } from "@/lib/icons";

export default function HireRoles() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Offshore Staffing"
          title="Dedicated professionals who become an extension of your team"
          intro="Hire a named individual rather than buying anonymous hours. Six roles, each scoped to a specific part of a CPA firm's workload."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, i) => {
            const Icon = getIcon(role.icon);
            return (
              <Reveal key={role.slug} delay={i * 0.05}>
                <Link
                  href={`/hire/${role.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors group-hover:bg-gradient-gold-x">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 text-lg leading-snug">{role.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-muted">
                    {role.teaser}
                  </p>

                  <ul className="mt-5 space-y-1.5 border-t border-border pt-4">
                    {role.capabilities.slice(0, 4).map((cap) => (
                      <li key={cap} className="flex gap-2 text-xs leading-snug text-ink-muted">
                        <span className="text-gold" aria-hidden="true">
                          →
                        </span>
                        {cap}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                    Hire this role
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

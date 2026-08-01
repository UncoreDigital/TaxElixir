import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/lib/services-data";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="section">
          <div className="container max-w-2xl py-20 text-center">
            <p className="font-display text-7xl font-bold text-gradient-gold">404</p>
            <h1 className="mt-6 text-3xl md:text-4xl">We could not find that page</h1>
            <span className="rule-gold mx-auto mt-6" aria-hidden="true" />
            <p className="mt-6 text-base leading-relaxed text-ink-muted">
              The link may be out of date, or the page may have moved. Here is
              where most people are heading.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="rounded-lg border border-border bg-white px-5 py-4 text-left text-sm font-medium text-navy transition-colors hover:border-gold/50"
                >
                  {service.title}
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/" variant="primary" size="lg">
                Back to home
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline" size="lg">
                Contact us
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

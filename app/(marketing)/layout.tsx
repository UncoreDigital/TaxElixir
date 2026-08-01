import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

/**
 * JSON-LD for the marketing tree. Organization is emitted once here rather than
 * per page. Breadcrumbs are emitted per page where they carry real items —
 * unisonglobus.com ships a BreadcrumbList with an empty itemListElement array
 * on every page, which is worse than omitting it.
 */
function OrganizationJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    slogan: site.tagline,
    url: site.url,
    // Google wants a roughly square logo here; the supplied lockup is 1600x427,
    // which it will reject. This is the generated square mark.
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/assets/brand/icon-512.png`,
      width: 512,
      height: 512,
    },
    image: `${site.url}/opengraph-image.png`,
    email: site.email,
    description: site.description,
    disambiguatingDescription: site.disclaimer,
    areaServed: { "@type": "Country", name: "United States" },
    knowsAbout: [
      "Outsourced tax preparation",
      "Back year tax returns",
      "Bookkeeping and accounting outsourcing",
      "Client Accounting Advisory Services",
      "Audit support and workpaper preparation",
      "Offshore staffing for CPA firms",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OrganizationJsonLd />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

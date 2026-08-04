import type { MetadataRoute } from "next";
import { services } from "@/lib/services-data";
import { roles } from "@/lib/hire-data";
import { getPublishedPosts } from "@/lib/posts";
import { getResources } from "@/lib/resources";
import { features, site } from "@/lib/site";

/**
 * Generated from the same data the pages render from, so a page can never exist
 * without being listed. unisonglobus.com omits ~30 live pages from its sitemaps
 * including /contact/ — the consequence of maintaining the list by hand.
 *
 * /upload and /admin are deliberately excluded (noindex), as is /guides while
 * features.guides is off — both routes 404, and listing a 404 in the sitemap is
 * a crawl error you volunteer for.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: "/", changeFrequency: "weekly", priority: 1 },
      { url: "/services", changeFrequency: "monthly", priority: 0.9 },
      { url: "/hire", changeFrequency: "monthly", priority: 0.9 },
      { url: "/about", changeFrequency: "monthly", priority: 0.7 },
      { url: "/how-we-work", changeFrequency: "monthly", priority: 0.8 },
      { url: "/security", changeFrequency: "monthly", priority: 0.7 },
      { url: "/software", changeFrequency: "monthly", priority: 0.6 },
      { url: "/faqs", changeFrequency: "monthly", priority: 0.6 },
      { url: "/blog", changeFrequency: "weekly", priority: 0.7 },
      { url: "/case-studies", changeFrequency: "monthly", priority: 0.7 },
      { url: "/events", changeFrequency: "weekly", priority: 0.6 },
      { url: "/guides", changeFrequency: "monthly", priority: 0.6 },
      { url: "/partnership", changeFrequency: "monthly", priority: 0.7 },
      { url: "/contact", changeFrequency: "yearly", priority: 0.8 },
      { url: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    ] as const
  )
    .filter((entry) => features.guides || entry.url !== "/guides")
    .map((entry) => ({ ...entry, url: `${site.url}${entry.url}`, lastModified: now }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const roleRoutes: MetadataRoute.Sitemap = roles.map((r) => ({
    url: `${site.url}/hire/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const posts = await getPublishedPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // Only case studies get their own page; events and guides live on their index.
  const caseStudies = await getResources("case_study");
  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: `${site.url}/case-studies/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...roleRoutes,
    ...postRoutes,
    ...caseStudyRoutes,
  ];
}

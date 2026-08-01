import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FCFCFC",
    theme_color: "#0C2748",
    icons: [
      { src: "/assets/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/assets/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

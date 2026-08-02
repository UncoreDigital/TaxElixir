/** @type {import('next').NextConfig} */

// Security headers — unisonglobus.com ships none of these while selling SOC 2 /
// ISO 27001 as its differentiator. For a firm whose pitch is trust and whose
// prospects' security teams will check, these cost nothing and are a talking point.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /*
   * `next dev` and `next build` both write to .next and will corrupt each
   * other's output if run together — on Windows this surfaces as spurious
   * "Cannot find module './NNNN.js'" or ENOENT on *.nft.json.
   * Set NEXT_DIST_DIR to build into a separate directory while dev is running.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

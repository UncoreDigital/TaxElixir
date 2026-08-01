import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · TaxElixir Admin" },
  // Belt and braces with robots.ts — the admin tree must never be indexed.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-muted/40">{children}</div>;
}

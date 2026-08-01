import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import DocumentUploadForm from "@/components/DocumentUploadForm";
import DisclaimerBand from "@/components/DisclaimerBand";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Secure Document Upload",
  description:
    "Send documents to TaxElixir securely. Files upload to a private, access-controlled store rather than travelling by email.",
  alternates: { canonical: "/upload" },
  robots: { index: false, follow: true },
};

const assurances = [
  { title: "Private by default", body: "The storage bucket is not public. There is no shareable URL and no directory listing." },
  { title: "Signed access only", body: "Our team retrieves your files through short-lived signed links, not permanent ones." },
  { title: "Better than email", body: "Attachments sit in mailboxes indefinitely and pass through servers you do not control." },
];

export default function UploadPage() {
  const configured = isSupabaseConfigured();

  return (
    <>
      <PageBanner
        eyebrow="Secure Transfer"
        title="Send us documents securely"
        crumbs={[{ name: "Secure Upload" }]}
        intro="Please use this form rather than email. Files go straight into a private, access-controlled store — they are never publicly readable."
      />

      <section className="section">
        <div className="container grid gap-14 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-border bg-white p-8 shadow-soft md:p-10">
            {configured ? (
              <>
                <h2 className="text-2xl">Upload your files</h2>
                <p className="mt-2.5 text-sm text-ink-muted">
                  Fields marked <span className="text-gold-dark">*</span> are required.
                </p>
                <div className="mt-8">
                  <DocumentUploadForm />
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-amber-400 bg-amber-50 p-6 text-sm text-amber-900">
                <strong className="font-semibold">Upload is not configured yet.</strong>
                <p className="mt-2 leading-relaxed">
                  Set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                  <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then run{" "}
                  <code className="rounded bg-amber-100 px-1">supabase/migrations/0001_init.sql</code>. Until
                  then, please email{" "}
                  <a href={site.emailHref} className="font-semibold underline">{site.email}</a>.
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-muted/50 p-7">
              <ShieldCheck className="h-5 w-5 text-gold-dark" aria-hidden="true" />
              <h2 className="mt-3 text-lg">How this is protected</h2>
              <ul className="mt-5 space-y-4">
                {assurances.map((item) => (
                  <li key={item.title}>
                    <p className="text-sm font-semibold text-navy">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                  </li>
                ))}
              </ul>
              <Link
                href="/security"
                className="mt-6 inline-block text-sm font-semibold text-navy underline decoration-gold/60 underline-offset-4"
              >
                Full security control set
              </Link>
            </div>

            <p className="flex items-start gap-2.5 rounded-2xl border border-border bg-white p-6 text-xs leading-relaxed text-ink-muted">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-dark" aria-hidden="true" />
              If your firm requires a specific transfer method — your own portal,
              SFTP or a virtual desktop — tell us and we will use that instead.
            </p>
          </aside>
        </div>
      </section>

      <DisclaimerBand />
    </>
  );
}

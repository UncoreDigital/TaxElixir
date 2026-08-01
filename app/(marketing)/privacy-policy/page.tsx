import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import Placeholder from "@/components/Placeholder";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How TaxElixir collects, uses and protects personal information submitted through this website.",
  alternates: { canonical: "/privacy-policy" },
};

/**
 * Drafted skeleton, not legal advice. The client's counsel must review this
 * before launch — particularly the retention period, the international transfer
 * basis (India), and any state-law rights sections (CCPA/CPRA) that apply.
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <PageBanner
        eyebrow="Legal"
        title="Privacy Policy"
        crumbs={[{ name: "Privacy Policy" }]}
        intro="How we handle personal information submitted through this website."
      />

      <section className="section">
        <div className="container max-w-3xl">
          <div className="mb-10 rounded-lg border border-dashed border-amber-400 bg-amber-50 p-5 text-sm text-amber-900">
            <strong className="font-semibold">Review required before launch.</strong>{" "}
            This is a drafted skeleton, not legal advice. It must be reviewed by
            the client&apos;s counsel — in particular the retention period, the
            lawful basis for transferring data to India, and any US state privacy
            rights (CCPA/CPRA) that apply to your prospects.{" "}
            <Placeholder label="legal review" />
          </div>

          <div className="prose-brand">
            <h2>What this policy covers</h2>
            <p>
              This policy applies to personal information collected through this
              website. It does not cover information a client firm shares with us
              under an engagement — that is governed by the engagement letter and
              any data processing agreement signed with your firm.
            </p>

            <h2>Information we collect</h2>
            <ul>
              <li>
                <strong>Information you give us.</strong> Name, work email,
                company name, phone number and the content of your message when
                you submit an enquiry form.
              </li>
              <li>
                <strong>Documents you upload.</strong> Files submitted through our
                secure upload form, together with the contact details you provide
                alongside them.
              </li>
              <li>
                <strong>Technical information.</strong> Standard server log data
                such as IP address, browser type and pages visited.
              </li>
            </ul>

            <h2>How we use it</h2>
            <ul>
              <li>To respond to your enquiry and discuss a potential engagement.</li>
              <li>To provide the services described in a signed engagement letter.</li>
              <li>To maintain the security and integrity of this website.</li>
              <li>To meet legal, regulatory and record-keeping obligations.</li>
            </ul>
            <p>
              We do not sell personal information, and we do not share your
              details with third parties for their own marketing.
            </p>

            <h2>Where your information is processed</h2>
            <p>
              {site.name} operates delivery teams in India. Information submitted
              through this site may be accessed by our personnel there, under
              contractual confidentiality obligations and access controls.{" "}
              <Placeholder label="confirm transfer mechanism with counsel" />
            </p>

            <h2>How long we keep it</h2>
            <p>
              Enquiry data is retained for as long as needed to respond and for a
              reasonable period afterwards for business records.{" "}
              <Placeholder label="client to set retention period" />
            </p>

            <h2>Security</h2>
            <p>
              Uploaded documents are stored in a private, access-controlled
              location and are not publicly readable. Access is restricted to
              authorised personnel. Our{" "}
              <a href="/security">Security &amp; Compliance</a> page describes our
              control set in more detail.
            </p>

            <h2>Your rights</h2>
            <p>
              You may ask us to access, correct or delete the personal information
              we hold about you, or to stop contacting you. Email{" "}
              <a href={site.emailHref}>{site.email}</a> and we will respond.{" "}
              <Placeholder label="add CCPA/CPRA and any GDPR rights per counsel" />
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy can be sent to{" "}
              <a href={site.emailHref}>{site.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

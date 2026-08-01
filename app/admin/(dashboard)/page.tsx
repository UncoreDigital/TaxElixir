import Link from "next/link";
import { AlertTriangle, FileText, Mail, Upload } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [leadsRes, newLeadsRes, postsRes, draftsRes, uploadsRes, newUploadsRes, settingsRes, recentRes] =
    await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("document_submissions").select("*", { count: "exact", head: true }),
      supabase.from("document_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("site_settings").select("*").eq("group_name", "stats"),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(6),
    ]);

  const cards = [
    {
      label: "Leads",
      value: leadsRes.count ?? 0,
      sub: `${newLeadsRes.count ?? 0} new`,
      href: "/admin/leads",
      icon: Mail,
    },
    {
      label: "Insights",
      value: postsRes.count ?? 0,
      sub: `${draftsRes.count ?? 0} draft`,
      href: "/admin/posts",
      icon: FileText,
    },
    {
      label: "Document Uploads",
      value: uploadsRes.count ?? 0,
      sub: `${newUploadsRes.count ?? 0} unread`,
      href: "/admin/uploads",
      icon: Upload,
    },
  ];

  const unsetStats = (settingsRes.data ?? []).filter((s) => !s.value);
  const recent = recentRes.data ?? [];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Everything submitted through the website, and the figures the public site reads from."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-muted">{card.label}</span>
              <card.icon className="h-4 w-4 text-gold-dark" aria-hidden="true" />
            </div>
            <p className="mt-3 font-display text-4xl font-bold text-navy">{card.value}</p>
            <p className="mt-1 text-xs text-ink-muted">{card.sub}</p>
          </Link>
        ))}
      </div>

      {unsetStats.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <div>
              <h2 className="text-base text-amber-900">
                {unsetStats.length} headline figure{unsetStats.length === 1 ? "" : "s"} still unset
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-amber-800">
                The public site renders an em dash rather than a number for these,
                which is honest but weak. Set them once here and every page updates.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {unsetStats.map((stat) => (
                  <li
                    key={stat.key}
                    className="rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-medium text-amber-900"
                  >
                    {stat.label}
                  </li>
                ))}
              </ul>
              <Link
                href="/admin/settings"
                className="mt-4 inline-block text-sm font-semibold text-amber-900 underline underline-offset-4"
              >
                Set them now
              </Link>
            </div>
          </div>
        </div>
      )}

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">Recent enquiries</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-navy underline underline-offset-4">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-white p-10 text-center text-sm text-ink-muted">
            No enquiries yet. They will appear here as soon as the contact form is used.
          </p>
        ) : (
          <div className="scroll-x">
            <table className="w-full min-w-[44rem] overflow-hidden rounded-xl border border-border bg-white text-left">
              <thead className="bg-muted/60 text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Name</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Firm</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Interested in</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recent.map((lead) => (
                  <tr key={lead.id} className="text-sm">
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-navy">{lead.name}</span>
                      <span className="mt-0.5 block text-xs text-ink-muted">{lead.email}</span>
                    </td>
                    <td className="px-5 py-3.5 text-ink-muted">{lead.company || "—"}</td>
                    <td className="px-5 py-3.5 text-ink-muted">
                      {lead.services?.length ? lead.services.join(", ") : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-ink-muted">{formatDate(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

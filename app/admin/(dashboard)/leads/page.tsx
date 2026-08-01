import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LeadsTable from "@/components/admin/LeadsTable";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads" };

export default async function AdminLeadsPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Leads"
        description="Every enquiry submitted through the website. Update the status as you work each one so nothing is followed up twice or not at all."
      />
      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Could not load leads: {error.message}
        </p>
      ) : (
        <LeadsTable initialLeads={data ?? []} />
      )}
    </>
  );
}

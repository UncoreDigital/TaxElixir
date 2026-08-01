import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SettingsForm from "@/components/admin/SettingsForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Site Settings" };

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("group_name")
    .order("sort_order");

  return (
    <>
      <AdminPageHeader
        title="Site Settings"
        description="Headline figures and contact details, stored once and read by every page. This is deliberately the only place these numbers exist — hard-coding them per page is how a site ends up claiming more clients in one country than it has worldwide."
      />
      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Could not load settings: {error.message}
        </p>
      ) : (
        <SettingsForm initialSettings={data ?? []} />
      )}
    </>
  );
}

import { Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ResourcesTable from "@/components/admin/ResourcesTable";
import { ButtonLink } from "@/components/ui/Button";
import { features } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Resources" };

export default async function AdminResourcesPage() {
  const supabase = createClient();
  let query = supabase.from("resources").select("*");

  // Guides are parked (features.guides). Filtered at the query rather than in
  // the table so any rows already saved stay out of the list entirely — the
  // rows themselves are untouched and come back when the flag does.
  if (!features.guides) query = query.neq("kind", "guide");

  const { data, error } = await query.order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Resources"
        description={
          features.guides
            ? "Case studies, events and downloadable guides. Dated events move from Upcoming to Past on the public site automatically — there is no 'upcoming' list to go stale."
            : "Case studies and events. Dated events move from Upcoming to Past on the public site automatically — there is no 'upcoming' list to go stale."
        }
        actions={
          <ButtonLink href="/admin/resources/new" variant="gold" size="md">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New resource
          </ButtonLink>
        }
      />
      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Could not load resources: {error.message}
        </p>
      ) : (
        <ResourcesTable initialResources={data ?? []} />
      )}
    </>
  );
}

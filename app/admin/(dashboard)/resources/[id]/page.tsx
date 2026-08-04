import { notFound } from "next/navigation";
import ResourceEditor from "@/components/admin/ResourceEditor";
import { features } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return { title: params.id === "new" ? "New resource" : "Edit resource" };
}

export default async function AdminResourceEditorPage({ params }: { params: { id: string } }) {
  if (params.id === "new") return <ResourceEditor resource={null} />;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !data) notFound();

  // The list already filters guides out, so reaching one here means a bookmark
  // or a pasted id. Without this the editor would open with no kind selected —
  // "guide" is not among the options while features.guides is off — and the
  // first save would silently rewrite the row to a case study.
  if (!features.guides && data.kind === "guide") notFound();

  return <ResourceEditor resource={data} />;
}

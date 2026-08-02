import { notFound } from "next/navigation";
import ResourceEditor from "@/components/admin/ResourceEditor";
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

  return <ResourceEditor resource={data} />;
}

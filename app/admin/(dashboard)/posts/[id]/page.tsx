import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return { title: params.id === "new" ? "New article" : "Edit article" };
}

export default async function AdminPostEditorPage({ params }: { params: { id: string } }) {
  if (params.id === "new") return <PostEditor post={null} />;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !data) notFound();

  return <PostEditor post={data} />;
}

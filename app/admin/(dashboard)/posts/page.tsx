import Link from "next/link";
import { Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import PostsTable from "@/components/admin/PostsTable";
import { ButtonLink } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Insights" };

export default async function AdminPostsPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Insights"
        description="Articles published to the public /blog. Drafts are invisible to anonymous visitors — enforced by row-level security, not just by a filter in the query."
        actions={
          <ButtonLink href="/admin/posts/new" variant="gold" size="md">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New article
          </ButtonLink>
        }
      />
      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Could not load articles: {error.message}
        </p>
      ) : (
        <PostsTable initialPosts={data ?? []} />
      )}
    </>
  );
}

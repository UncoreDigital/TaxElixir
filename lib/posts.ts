import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Post } from "@/lib/supabase/types";

/**
 * Published-post reads for the public site.
 *
 * Every query filters on status + published_at even though RLS already does —
 * belt and braces, and it keeps the intent obvious at the call site. If Supabase
 * is not configured the site still builds and the blog simply renders empty,
 * rather than failing the build.
 */

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("[posts] list failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("[posts] fetch failed:", error.message);
    return null;
  }
  return data;
}

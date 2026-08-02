import { createStaticClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Resource, ResourceKind } from "@/lib/supabase/types";

/**
 * Published-resource reads for the public site. Mirrors lib/posts.ts: filters
 * on status even though RLS already enforces it, and returns an empty list when
 * Supabase is unconfigured so the site still builds.
 */
export async function getResources(kind: ResourceKind, limit?: number): Promise<Resource[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createStaticClient();
  let query = supabase
    .from("resources")
    .select("*")
    .eq("kind", kind)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString());

  // Events sort by when they happen; everything else by when it was published.
  query =
    kind === "event"
      ? query.order("starts_at", { ascending: false, nullsFirst: false })
      : query.order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error(`[resources] list ${kind} failed:`, error.message);
    return [];
  }
  return data ?? [];
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("[resources] fetch failed:", error.message);
    return null;
  }
  return data;
}

/** Events split by whether they have already happened. */
export function splitEvents(events: Resource[]) {
  const now = Date.now();
  const upcoming = events
    .filter((e) => e.starts_at && new Date(e.starts_at).getTime() >= now)
    .sort((a, b) => new Date(a.starts_at!).getTime() - new Date(b.starts_at!).getTime());
  const past = events.filter((e) => !e.starts_at || new Date(e.starts_at).getTime() < now);
  return { upcoming, past };
}

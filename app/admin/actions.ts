"use server";

import { revalidatePublicSite } from "@/lib/revalidate";
import { createClient } from "@/lib/supabase/server";

/**
 * Cache purge for the admin screens that still write from the browser.
 *
 * The article and resource editors build their payload client-side and write
 * through the browser Supabase client under RLS; that write is fine, but the
 * browser has no way to invalidate Next's cache, so the public pages kept
 * serving stale HTML. Call this once the write has come back clean.
 *
 * Every export in a "use server" file is a callable endpoint, so this checks for
 * a session first — otherwise anyone could hold the site's cache open by
 * hitting it in a loop. It is not a data risk either way; a purge only forces a
 * re-render of pages that are already public.
 */
export async function revalidateSite(): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Not authorised." };

  revalidatePublicSite();
  return { ok: true };
}

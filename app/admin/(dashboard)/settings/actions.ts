"use server";

import { revalidatePublicSite } from "@/lib/revalidate";
import { createClient } from "@/lib/supabase/server";
import type { SiteSetting } from "@/lib/supabase/types";

export type SaveSettingsResult = { ok: true } | { ok: false; error: string };

/**
 * Writes the settings and immediately purges the marketing tree's cache.
 *
 * The write used to happen straight from the browser, which left the public
 * pages serving their prerendered HTML until `revalidate` (300s, set in
 * app/(marketing)/layout.tsx) expired — and because that expiry is
 * stale-while-revalidate, the first visitor after it still got the old page and
 * only the next one saw the change. From the client's side that reads as "I
 * saved it and the site didn't update", which is exactly what was reported.
 *
 * Doing it here means the save and the invalidation cannot come apart. The 300s
 * window stays as a backstop for edits made anywhere other than this form.
 */
export async function saveSettings(settings: SiteSetting[]): Promise<SaveSettingsResult> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Your session has expired. Sign in again and re-save." };
  }

  // Empty string and whitespace both mean "not set" — store NULL so the public
  // site's "is this confirmed?" check stays a simple null test.
  const updates = settings.map((setting) => ({
    key: setting.key,
    value: setting.value && setting.value.trim() ? setting.value.trim() : null,
    label: setting.label,
    group_name: setting.group_name,
    sort_order: setting.sort_order,
  }));

  const { error } = await supabase.from("site_settings").upsert(updates, { onConflict: "key" });

  if (error) {
    console.error("[settings] save failed:", error.message);
    return { ok: false, error: error.message };
  }

  revalidatePublicSite();

  return { ok: true };
}

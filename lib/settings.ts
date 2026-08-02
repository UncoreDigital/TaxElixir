import { cache } from "react";
import { createStaticClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { stats as statDefinitions, type Stat } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Runtime site settings — the bridge between what the admin edits and what the
 * public site renders.
 *
 * `lib/content.ts` and `lib/site.ts` hold the *definitions* (which figures
 * exist, their labels and suffixes; the brand's fixed details). The `value` for
 * anything the client can change comes from here. If a value is unset the
 * public site falls back to the static default, and where that is also null it
 * renders an em dash rather than a zero.
 *
 * Wrapped in React's `cache()` so the TopBar, Footer, Stats block and Contact
 * page share one query per render rather than issuing four.
 */

export type SettingsMap = Record<string, string | null>;

export const getSettings = cache(async (): Promise<SettingsMap> => {
  if (!isSupabaseConfigured()) return {};

  const supabase = createStaticClient();
  const { data, error } = await supabase.from("site_settings").select("key, value");

  if (error) {
    console.error("[settings] read failed:", error.message);
    return {};
  }

  return Object.fromEntries(
    (data ?? []).map((row) => [row.key, row.value?.trim() ? row.value.trim() : null])
  );
});

/** Headline figures, with admin-entered values merged over the definitions. */
export async function getStats(): Promise<Stat[]> {
  const settings = await getSettings();
  return statDefinitions.map((stat) => {
    const value = settings[stat.key] ?? stat.value;
    return { ...stat, value, needsClient: stat.needsClient && !value };
  });
}

export type ContactDetails = {
  phone: string | null;
  phoneHref: string | null;
  address: string | null;
  linkedin: string | null;
};

/** Contact details, admin value first, then the static default in lib/site.ts. */
export async function getContactDetails(): Promise<ContactDetails> {
  const settings = await getSettings();

  const phone = settings.phone ?? site.phone;
  return {
    phone,
    // Derived, not stored — a stored tel: link is one more thing to keep in sync.
    phoneHref: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null,
    address: settings.address ?? site.address,
    linkedin: settings.linkedin ?? site.linkedin,
  };
}

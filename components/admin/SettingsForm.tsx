"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { SiteSetting } from "@/lib/supabase/types";

const groupLabels: Record<string, { title: string; blurb: string }> = {
  stats: {
    title: "Headline figures",
    blurb:
      "Shown on the homepage and About page. Leave a field empty and the site renders an em dash — never a zero, and never an invented number.",
  },
  contact: {
    title: "Contact details",
    blurb: "Shown on the Contact page and in the footer once set.",
  },
};

export default function SettingsForm({ initialSettings }: { initialSettings: SiteSetting[] }) {
  const supabase = createClient();
  const [settings, setSettings] = useState(initialSettings);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groups = Array.from(new Set(settings.map((s) => s.group_name)));

  function setValue(key: string, value: string) {
    setSaved(false);
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  }

  async function save() {
    setBusy(true);
    setError(null);

    // Empty string and whitespace both mean "not set" — store NULL so the
    // public site's "is this confirmed?" check stays a simple null test.
    const updates = settings.map((s) => ({
      key: s.key,
      value: s.value && s.value.trim() ? s.value.trim() : null,
      label: s.label,
      group_name: s.group_name,
      sort_order: s.sort_order,
    }));

    const { error: upsertError } = await supabase
      .from("site_settings")
      .upsert(updates, { onConflict: "key" });

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSaved(true);
    }
    setBusy(false);
  }

  return (
    <div className="max-w-2xl space-y-8">
      {groups.map((group) => {
        const meta = groupLabels[group] ?? { title: group, blurb: "" };
        const rows = settings.filter((s) => s.group_name === group);

        return (
          <section key={group} className="rounded-xl border border-border bg-white p-7">
            <h2 className="text-lg">{meta.title}</h2>
            {meta.blurb && (
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{meta.blurb}</p>
            )}

            <div className="mt-6 space-y-4">
              {rows.map((setting) => (
                <div key={setting.key}>
                  <label
                    htmlFor={`setting-${setting.key}`}
                    className="mb-1.5 block text-sm font-medium text-navy"
                  >
                    {setting.label}
                  </label>
                  <input
                    id={`setting-${setting.key}`}
                    type="text"
                    value={setting.value ?? ""}
                    onChange={(e) => setValue(setting.key, e.target.value)}
                    placeholder="Not set"
                    className="w-full rounded-md border border-input bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button variant="primary" size="lg" onClick={save} disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            "Save settings"
          )}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4" aria-hidden="true" />
            Saved
          </span>
        )}
      </div>
    </div>
  );
}

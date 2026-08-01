"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { Lead, LeadStatus } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost", "archived"];

const statusStyle: Record<LeadStatus, string> = {
  new: "bg-gold/20 text-gold-dark border-gold/40",
  contacted: "bg-blue-50 text-blue-700 border-blue-200",
  qualified: "bg-indigo-50 text-indigo-700 border-indigo-200",
  won: "bg-emerald-50 text-emerald-700 border-emerald-200",
  lost: "bg-rose-50 text-rose-700 border-rose-200",
  archived: "bg-muted text-ink-muted border-border",
};

function toCsv(leads: Lead[]) {
  const header = ["Received", "Name", "Email", "Firm", "Phone", "Interested in", "Status", "Message"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = leads.map((l) =>
    [
      new Date(l.created_at).toISOString(),
      l.name,
      l.email,
      l.company ?? "",
      l.phone ?? "",
      (l.services ?? []).join("; "),
      l.status,
      (l.message ?? "").replace(/\r?\n/g, " "),
    ]
      .map(escape)
      .join(",")
  );
  return [header.map(escape).join(","), ...rows].join("\r\n");
}

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const supabase = createClient();
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (filter !== "all" && lead.status !== filter) return false;
      if (!q) return true;
      return [lead.name, lead.email, lead.company, lead.message]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q));
    });
  }, [leads, query, filter]);

  async function updateStatus(id: string, status: LeadStatus) {
    setBusy(id);
    const previous = leads;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) {
      console.error("[leads] status update failed:", error.message);
      setLeads(previous); // roll back rather than showing a lie
    }
    setBusy(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this lead permanently? This cannot be undone.")) return;
    setBusy(id);
    const previous = leads;
    setLeads((prev) => prev.filter((l) => l.id !== id));

    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      console.error("[leads] delete failed:", error.message);
      setLeads(previous);
    }
    setBusy(null);
  }

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `taxelixir-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, firm or message"
            aria-label="Search leads"
            className="w-full rounded-md border border-input bg-white py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as LeadStatus | "all")}
          aria-label="Filter by status"
          className="rounded-md border border-input bg-white px-4 py-2.5 text-sm capitalize focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>

        <Button variant="outline" size="md" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </Button>
      </div>

      <p className="mb-3 text-sm text-ink-muted">
        {filtered.length} of {leads.length} lead{leads.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-sm text-ink-muted">
          No leads match this view.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <ul className="divide-y divide-border">
            {filtered.map((lead) => {
              const isOpen = expanded === lead.id;
              return (
                <li key={lead.id} className={cn(busy === lead.id && "opacity-60")}>
                  <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : lead.id)}
                      aria-expanded={isOpen}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <ChevronDown
                        className={cn("h-4 w-4 shrink-0 text-ink-muted transition-transform", isOpen && "rotate-180")}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-navy">
                          {lead.name}
                          {lead.company && <span className="font-normal text-ink-muted"> · {lead.company}</span>}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ink-muted">
                          {lead.email} · {formatDate(lead.created_at)}
                        </span>
                      </span>
                    </button>

                    <div className="flex shrink-0 items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                        aria-label={`Status for ${lead.name}`}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium capitalize focus:outline-none focus:ring-1 focus:ring-gold",
                          statusStyle[lead.status]
                        )}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-white capitalize text-ink">
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => remove(lead.id)}
                        aria-label={`Delete lead from ${lead.name}`}
                        className="rounded p-1.5 text-ink-muted transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-border bg-muted/40 px-5 py-5 sm:pl-12">
                      <dl className="grid gap-4 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Email</dt>
                          <dd className="mt-1">
                            <a href={`mailto:${lead.email}`} className="text-navy underline underline-offset-2">
                              {lead.email}
                            </a>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Phone</dt>
                          <dd className="mt-1 text-ink">{lead.phone || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Interested in</dt>
                          <dd className="mt-1 text-ink">{lead.services?.length ? lead.services.join(", ") : "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Submitted from</dt>
                          <dd className="mt-1 text-ink">{lead.source_page || "—"}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Message</dt>
                          <dd className="mt-1 whitespace-pre-wrap leading-relaxed text-ink">
                            {lead.message || "—"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

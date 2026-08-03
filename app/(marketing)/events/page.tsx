import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Video } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import CTA from "@/components/sections/CTA";
import Placeholder from "@/components/Placeholder";
import { getResources, splitEvents } from "@/lib/resources";
import type { Resource } from "@/lib/supabase/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Events & Webinars",
  description:
    "Sessions TaxElixir is running or speaking at, plus recordings of past webinars for US CPA firm owners.",
  alternates: { canonical: "/events" },
};

function formatWhen(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function EventRow({ event, past }: { event: Resource; past: boolean }) {
  const when = formatWhen(event.starts_at);

  return (
    <li
      className={`flex flex-col gap-5 border-b border-border py-7 last:border-0 md:flex-row md:items-center ${
        past ? "opacity-80" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 gap-5">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            past ? "bg-muted text-ink-muted" : "bg-gradient-gold-x text-navy"
          }`}
        >
          {event.location ? (
            <MapPin className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Video className="h-5 w-5" aria-hidden="true" />
          )}
        </span>

        <div className="min-w-0">
          <h3 className="text-lg leading-snug">{event.title}</h3>
          {event.summary && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              {event.summary}
            </p>
          )}
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
            {when && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                {when}
              </span>
            )}
            <span>{event.location ?? "Online"}</span>
          </p>
        </div>
      </div>

      {event.registration_url && (
        <a
          href={event.registration_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
        >
          {past ? "Watch recording" : "Register"}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
    </li>
  );
}

export default async function EventsPage() {
  const events = await getResources("event");
  const { upcoming, past } = splitEvents(events);

  return (
    <>
      <PageBanner
        eyebrow="Events & Webinars"
        title="Sessions for firm owners"
        crumbs={[{ name: "Events & Webinars" }]}
        intro="Practical sessions on capacity, offshore delivery and busy-season workflow. Recordings stay available after the event."
      />

      <section className="section">
        <div className="container max-w-4xl">
          <h2 className="text-2xl">Upcoming</h2>
          <span className="rule-gold mt-4" aria-hidden="true" />

          {upcoming.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/40 p-10 text-center">
              <p className="text-sm leading-relaxed text-ink-muted">
                Nothing scheduled at the moment. New sessions are announced here
                and to anyone who has been in touch.
              </p>
              {/*
                An "Upcoming" heading over months-old items is the most common
                staleness failure on sites like this — a competitor still lists
                events from nine months ago under that heading. Here, dated
                events move to Past automatically.
              */}
            </div>
          ) : (
            <ul className="mt-6">
              {upcoming.map((event) => (
                <EventRow key={event.id} event={event} past={false} />
              ))}
            </ul>
          )}

          <h2 className="mt-16 text-2xl">Past sessions</h2>
          <span className="rule-gold mt-4" aria-hidden="true" />

          {past.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/40 p-10 text-center">
              <p className="text-sm leading-relaxed text-ink-muted">
                No past sessions published yet.
              </p>
              <Placeholder label="client to supply: webinar recordings" className="mt-4" />
            </div>
          ) : (
            <ul className="mt-6">
              {past.map((event) => (
                <EventRow key={event.id} event={event} past />
              ))}
            </ul>
          )}

          <p className="mt-12 rounded-lg border-l-2 border-gold bg-muted/60 px-6 py-4 text-sm leading-relaxed text-ink">
            Want us to run a session for your team or association?{" "}
            <Link href="/contact" className="font-semibold text-navy underline decoration-gold/60 underline-offset-2">
              Ask us
            </Link>
            .
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}

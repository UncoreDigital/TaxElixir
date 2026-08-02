import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { leadSchema } from "@/lib/validation";

/**
 * Contact form endpoint.
 *
 * Validates, then writes one row to `leads`. Email notification is handled
 * downstream by a Database Webhook → `lead-notification` edge function, so this
 * route's only job is to capture the lead reliably and return fast.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot tripped — accept silently so the bot does not learn anything.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createClient();
  const { error } = await supabase.from("leads").insert({
    name: data.name,
    email: data.email,
    company: data.company || null,
    phone: data.phone || null,
    services: data.services,
    message: data.message,
    source_page: data.sourcePage || null,
  });

  if (error) {
    console.error("[contact] lead insert failed:", error.message);
    return NextResponse.json(
      { error: "We could not save your message. Please email us directly." },
      { status: 500 }
    );
  }

  /*
   * Notification is NOT sent from here.
   *
   * A Supabase Database Webhook on `leads` INSERT fires the `lead-notification`
   * edge function, which sends the email. Two reasons that is better than
   * mailing from this route:
   *
   *   1. The row is the source of truth. If the mail provider is down, the lead
   *      is still captured and Supabase retries the webhook — whereas a failed
   *      send from here would either lose the notification or block the response.
   *   2. Leads that arrive by any other path (a direct insert, a seeded import,
   *      a future form) get notified too, because the trigger is on the data,
   *      not on this one endpoint.
   *
   * See supabase/functions/lead-notification/ and docs/DATABASE.md.
   */

  return NextResponse.json({ ok: true });
}

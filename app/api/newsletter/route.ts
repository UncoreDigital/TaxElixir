import { NextResponse } from "next/server";
import { z } from "zod";
import { features } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(200),
  sourcePage: z.string().max(300).optional().or(z.literal("")),
  /** Honeypot — hidden from users, filled by bots. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  // Closed with the footer form — see features.newsletter. Left open it would
  // keep accepting signups from bots that already know the path.
  if (!features.newsletter) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors.email?.[0] ?? "Please check your email address." },
      { status: 400 }
    );
  }

  // Honeypot tripped — report success so the bot learns nothing.
  if (parsed.data.company) return NextResponse.json({ ok: true });

  const supabase = createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: parsed.data.email.toLowerCase(),
    source_page: parsed.data.sourcePage || null,
  });

  // 23505 = unique violation. Already subscribed is a success from the visitor's
  // side, and confirming "you are already on this list" leaks list membership.
  if (error && error.code !== "23505") {
    console.error("[newsletter] insert failed:", error.message);
    return NextResponse.json(
      { error: "We could not sign you up just now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

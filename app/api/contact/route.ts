import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { leadSchema } from "@/lib/validation";
import { site } from "@/lib/site";

/** Escape user-supplied text before it goes into the notification email HTML. */
function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

  // Notification is best-effort: the lead is already stored, so a mail failure
  // must not surface to the visitor as a failed submission.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_TO;
  const from = process.env.LEAD_NOTIFICATION_FROM;

  if (apiKey && to && from) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);

      await resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject: `New enquiry — ${data.name}${data.company ? ` (${data.company})` : ""}`,
        html: `
          <h2 style="font-family:Georgia,serif;color:#0C2748;">New website enquiry</h2>
          <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:6px 14px 6px 0;color:#5b6b7f;">Name</td><td><strong>${esc(data.name)}</strong></td></tr>
            <tr><td style="padding:6px 14px 6px 0;color:#5b6b7f;">Email</td><td><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>
            ${data.company ? `<tr><td style="padding:6px 14px 6px 0;color:#5b6b7f;">Company</td><td>${esc(data.company)}</td></tr>` : ""}
            ${data.phone ? `<tr><td style="padding:6px 14px 6px 0;color:#5b6b7f;">Phone</td><td>${esc(data.phone)}</td></tr>` : ""}
            ${data.services.length ? `<tr><td style="padding:6px 14px 6px 0;color:#5b6b7f;">Interested in</td><td>${esc(data.services.join(", "))}</td></tr>` : ""}
            ${data.sourcePage ? `<tr><td style="padding:6px 14px 6px 0;color:#5b6b7f;">Page</td><td>${esc(data.sourcePage)}</td></tr>` : ""}
          </table>
          <p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap;margin-top:18px;">${esc(data.message)}</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
          <p style="font-family:system-ui,sans-serif;font-size:12px;color:#8a97a8;">Sent from ${site.url}</p>
        `,
      });
    } catch (mailError) {
      console.error("[contact] notification email failed:", mailError);
    }
  }

  return NextResponse.json({ ok: true });
}

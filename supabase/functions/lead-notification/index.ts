import nodemailer from "npm:nodemailer@6.9.7";

/**
 * Lead / upload / newsletter notification.
 *
 * Fired by a Supabase Database Webhook on INSERT into `leads`,
 * `document_submissions`, `guide_downloads` or `newsletter_subscribers`.
 * The webhook payload is { type, table, schema, record, old_record }.
 *
 * ---------------------------------------------------------------------------
 * SECRETS — read from the environment, never committed.
 *
 *   supabase secrets set \
 *     SMTP_HOST=smtp.gmail.com \
 *     SMTP_PORT=465 \
 *     SMTP_USER=leads@taxelixir.com \
 *     SMTP_PASS=<app password> \
 *     NOTIFICATION_EMAIL=info@taxelixir.com
 *
 * The reference implementation this was ported from had its SMTP host, user and
 * app password hardcoded in the source file. Do not do that here: this function
 * lives in a repo, and a committed mailbox credential is a mailbox someone else
 * owns. If those Anchor credentials are still live, rotate them.
 * ---------------------------------------------------------------------------
 */

const SMTP_HOST = Deno.env.get("SMTP_HOST") ?? "";
const SMTP_PORT = Number(Deno.env.get("SMTP_PORT") ?? "465");
const SMTP_USER = Deno.env.get("SMTP_USER") ?? "";
const SMTP_PASS = Deno.env.get("SMTP_PASS") ?? "";
const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") ?? "";
const SITE_NAME = "TaxElixir";

const NAVY = "#0C2748";
const GOLD = "#CBA85A";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

/** Escape anything that came from a form before it goes into email HTML. */
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(title: string, inner: string): string {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#333;max-width:640px;margin:0 auto;border:1px solid #e6e2d8;border-radius:8px;overflow:hidden;">
      <div style="background:${NAVY};padding:22px;text-align:center;">
        <h2 style="color:${GOLD};margin:0;font-size:19px;letter-spacing:.3px;">${title}</h2>
      </div>
      <div style="padding:24px;background:#ffffff;">${inner}</div>
      <div style="padding:14px;text-align:center;color:#8a97a8;font-size:12px;border-top:1px solid #eee;">
        Received via the ${SITE_NAME} website
      </div>
    </div>`;
}

function row(label: string, value: string): string {
  return `<p style="font-size:15px;margin:6px 0;"><strong style="color:${NAVY};">${label}:</strong> ${value}</p>`;
}

function block(label: string, body: string): string {
  return `<div style="margin-top:18px;padding:14px;background:#faf9f6;border-left:3px solid ${GOLD};">
      <strong style="color:${NAVY};">${label}</strong>
      <p style="white-space:pre-wrap;margin:8px 0 0;font-size:15px;">${body}</p>
    </div>`;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / Math.pow(1024, i);
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

type Built = { subject: string; html: string };

function buildLead(r: Record<string, unknown>): Built {
  const services = Array.isArray(r.services) ? (r.services as string[]) : [];
  const inner = `
    ${row("Name", esc(r.name))}
    ${row("Email", `<a href="mailto:${esc(r.email)}" style="color:${NAVY};">${esc(r.email)}</a>`)}
    ${r.company ? row("Firm", esc(r.company)) : ""}
    ${r.phone ? row("Phone", esc(r.phone)) : ""}
    ${services.length ? row("Interested in", esc(services.join(", "))) : ""}
    ${r.source_page ? row("Submitted from", esc(r.source_page)) : ""}
    ${block("Message", esc(r.message))}
    <p style="font-size:13px;margin-top:20px;color:#666;">Manage this in <strong>Admin → Leads</strong>.</p>`;
  return {
    subject: `New enquiry — ${esc(r.name)}${r.company ? ` (${esc(r.company)})` : ""}`,
    html: wrap("New Contact Form Submission", inner),
  };
}

function buildUpload(r: Record<string, unknown>): Built {
  const files = Array.isArray(r.files) ? (r.files as Array<{ name?: string; size?: number }>) : [];
  const list = files.length
    ? files
        .map(
          (f) =>
            `<li style="margin-bottom:4px;">${esc(f.name ?? "file")} <span style="color:#8a97a8;">(${formatBytes(Number(f.size) || 0)})</span></li>`
        )
        .join("")
    : "<li>(no file details)</li>";

  const inner = `
    ${row("Name", esc(r.name))}
    ${row("Email", `<a href="mailto:${esc(r.email)}" style="color:${NAVY};">${esc(r.email)}</a>`)}
    ${r.company ? row("Firm", esc(r.company)) : ""}
    ${r.phone ? row("Phone", esc(r.phone)) : ""}
    ${row("Files", `${files.length} file${files.length === 1 ? "" : "s"} · ${formatBytes(Number(r.total_size) || 0)} total`)}
    <ul style="font-size:14px;padding-left:20px;margin-top:8px;">${list}</ul>
    ${r.notes ? block("Notes", esc(r.notes)) : ""}
    <p style="font-size:13px;margin-top:20px;color:#666;">
      The bucket is private — download via <strong>Admin → Document Uploads</strong>, which issues a 60-second signed link.
    </p>`;
  return {
    subject: `Secure upload from ${esc(r.name)}`,
    html: wrap("New Document Upload", inner),
  };
}

function buildGuideDownload(r: Record<string, unknown>): Built {
  const inner = `
    ${row("Guide", esc(r.title))}
    ${row("Name", esc(r.name))}
    ${row("Email", `<a href="mailto:${esc(r.email)}" style="color:${NAVY};">${esc(r.email)}</a>`)}
    ${r.company ? row("Firm", esc(r.company)) : ""}
    ${r.phone ? row("Phone", esc(r.phone)) : ""}`;
  return {
    subject: `Guide downloaded — ${esc(r.title)}`,
    html: wrap("Guide Download", inner),
  };
}

function buildNewsletter(r: Record<string, unknown>): Built {
  const inner = `
    ${row("Email", `<a href="mailto:${esc(r.email)}" style="color:${NAVY};">${esc(r.email)}</a>`)}
    ${r.source_page ? row("Signed up from", esc(r.source_page)) : ""}`;
  return { subject: `New newsletter subscriber`, html: wrap("Newsletter Signup", inner) };
}

Deno.serve(async (req) => {
  try {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFICATION_EMAIL) {
      throw new Error(
        "Missing secrets. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and NOTIFICATION_EMAIL."
      );
    }

    const payload = await req.json();
    const { table, record } = payload as {
      table?: string;
      record?: Record<string, unknown>;
    };

    if (!record) {
      return new Response(JSON.stringify({ error: "No record in payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let built: Built;
    switch (table) {
      case "document_submissions":
        built = buildUpload(record);
        break;
      case "guide_downloads":
        built = buildGuideDownload(record);
        break;
      case "newsletter_subscribers":
        built = buildNewsletter(record);
        break;
      default:
        built = buildLead(record);
    }

    const info = await transporter.sendMail({
      from: `"${SITE_NAME} Website" <${SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      replyTo: typeof record.email === "string" ? record.email : undefined,
      subject: built.subject,
      html: built.html,
    });

    console.log(`[${table ?? "leads"}] notified:`, record.email, info.messageId);

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("lead-notification failed:", error);
    // 500 makes Supabase retry the webhook. The row is already committed, so a
    // failed email never costs the lead itself.
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

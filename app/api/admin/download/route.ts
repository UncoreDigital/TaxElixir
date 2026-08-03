import { NextResponse } from "next/server";
import { features } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

/**
 * Issues a short-lived signed URL for a client-uploaded document.
 *
 * The bucket is private, so this route is the only way to retrieve a file — and
 * it refuses unless the caller has an authenticated admin session. The URL it
 * returns expires in 60 seconds, which is long enough to start a download and
 * short enough that a copied link is useless.
 */
export async function POST(request: Request) {
  // The only consumer is the parked uploads list. Closed off with it so the
  // signing endpoint is not left standing on its own.
  if (!features.clientPortal) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  let body: { path?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const path = body.path;
  if (typeof path !== "string" || !path || path.includes("..")) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }

  const { data, error } = await supabase.storage
    .from("client-documents")
    .createSignedUrl(path, 60);

  if (error || !data) {
    console.error("[admin/download] signing failed:", error?.message);
    return NextResponse.json({ error: "Could not generate a download link." }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}

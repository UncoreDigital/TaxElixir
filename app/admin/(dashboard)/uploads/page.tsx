import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import UploadsList from "@/components/admin/UploadsList";
import { features } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Document Uploads" };

export default async function AdminUploadsPage() {
  // Parked with the public form — see features.clientPortal. Existing rows and
  // stored files are untouched; they reappear here when the flag goes back on.
  if (!features.clientPortal) notFound();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("document_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Document Uploads"
        description="Files sent through the secure upload form. The storage bucket is private — downloads are issued as signed links that expire after 60 seconds."
      />
      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Could not load uploads: {error.message}
        </p>
      ) : (
        <UploadsList initialSubmissions={data ?? []} />
      )}
    </>
  );
}

import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) redirect("/admin/login");

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this, but a layout that trusts middleware alone
  // breaks the moment the matcher changes.
  if (!user) redirect("/admin/login");

  return <AdminShell email={user.email ?? null}>{children}</AdminShell>;
}

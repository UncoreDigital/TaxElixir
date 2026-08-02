"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink,
  FileText,
  LayoutDashboard,
  Library,
  LogOut,
  Mail,
  Menu,
  Settings,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Logo from "@/components/brand/Logo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Leads", href: "/admin/leads", icon: Mail },
  { name: "Insights", href: "/admin/posts", icon: FileText },
  { name: "Resources", href: "/admin/resources", icon: Library },
  { name: "Document Uploads", href: "/admin/uploads", icon: Upload },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-white transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-5">
            <Link href="/admin" className="min-w-0">
              <span className="flex h-8">
                <Logo idPrefix="admin-sidebar" />
              </span>
              <span className="mt-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-dark">
                Admin Panel
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-ink-muted lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-navy text-white"
                      : "text-ink-muted hover:bg-muted hover:text-navy"
                  )}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-border p-4">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-1 text-xs text-ink-muted transition-colors hover:text-navy"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              View live site
            </Link>
            {email && (
              <p className="truncate px-1 text-xs text-ink-muted" title={email}>
                {email}
              </p>
            )}
            <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={signOut}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-border bg-white px-5 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded p-1 text-ink-muted"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="flex h-7">
            <Logo idPrefix="admin-mobile" />
          </span>
        </header>

        <main className="flex-1 overflow-auto p-5 lg:p-9">{children}</main>
      </div>
    </div>
  );
}

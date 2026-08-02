import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-8 block w-fit rounded-md bg-white px-5 py-4 shadow-soft">
          <Image
            src={site.logo}
            alt={site.name}
            width={1600}
            height={427}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
          <h1 className="text-2xl">Admin sign in</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Access is restricted to TaxElixir staff accounts.
          </p>

          <div className="mt-7">
            {configured ? (
              /*
               * LoginForm reads ?next= via useSearchParams(), which bails out of
               * static rendering unless it sits inside a Suspense boundary.
               * The fallback mirrors the form's height so the card does not
               * jump when it hydrates.
               */
              <Suspense
                fallback={
                  <div className="space-y-4" aria-hidden="true">
                    <div className="h-[68px] rounded-md bg-slate-100" />
                    <div className="h-[68px] rounded-md bg-slate-100" />
                    <div className="h-12 rounded-md bg-slate-100" />
                  </div>
                }
              >
                <LoginForm />
              </Suspense>
            ) : (
              <div className="rounded-lg border border-dashed border-amber-400 bg-amber-50 p-5 text-sm text-amber-900">
                <strong className="font-semibold">Supabase is not configured.</strong>
                <p className="mt-2 leading-relaxed">
                  Add <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                  <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
                  <code className="rounded bg-amber-100 px-1">.env.local</code>, run the migration in{" "}
                  <code className="rounded bg-amber-100 px-1">supabase/migrations/0001_init.sql</code>, then
                  create an admin user in Supabase Auth.
                </p>
              </div>
            )}
          </div>
        </div>

        <Link
          href="/"
          className="mx-auto mt-6 block w-fit text-sm text-ink-muted transition-colors hover:text-navy"
        >
          ← Back to website
        </Link>
      </div>
    </div>
  );
}

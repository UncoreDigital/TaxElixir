import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Cookie-free client for build-time and public content reads.
 *
 * `cookies()` throws outside a request scope, so the session-bound client below
 * cannot be used in `generateStaticParams()`, `sitemap.ts`, or anywhere else
 * that runs during the build. Published posts and resources are readable by
 * `anon` under RLS, so no session is needed for them anyway.
 *
 * This is not an optimisation — using the cookie client in those places is a
 * build failure the moment Supabase credentials are present.
 */
export function createStaticClient() {
  return createPlainClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/**
 * Server client bound to the request's cookies, so an authenticated admin
 * session is carried through server components and route handlers.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component — middleware refreshes the session.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // As above.
          }
        },
      },
    }
  );
}

/** True when Supabase env vars are present. Lets pages degrade instead of crashing. */
export const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

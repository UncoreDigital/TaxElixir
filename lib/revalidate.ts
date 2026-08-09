import { revalidatePath } from "next/cache";

/**
 * Drops the public site's cached HTML after an admin edit.
 *
 * The marketing tree is ISR with `revalidate = 300` (app/(marketing)/layout.tsx
 * and the resource routes). Without an explicit purge, a save is invisible until
 * that window expires — and because expiry is stale-while-revalidate, the first
 * visitor after it still gets the old page and only the next one sees the
 * change. That is the "I saved it and nothing happened" report.
 *
 * The scope is deliberately the whole tree rather than the one page that
 * changed. Content leaks across routes here — an article shows on /blog and
 * /blog/[slug] and the sitemap; contact details reach the header and footer of
 * every page; a featured flag reorders an index. Purging per-path means a list
 * of paths that has to be kept in step with the layout, and the failure mode of
 * getting it wrong is exactly the bug being fixed. These pages are cheap to
 * regenerate, so the blunt instrument is the right one.
 *
 * Server-only: `revalidatePath` throws outside a request scope, so import this
 * from server actions and route handlers, never from a client component.
 */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
}

-- ============================================================================
-- TaxElixir — newsletter subscribers
-- Run after 0002_resources.sql.
-- ============================================================================

create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique,
  source_page text,
  status      text not null default 'subscribed'
                check (status in ('subscribed','unsubscribed'))
);

create index if not exists newsletter_created_at_idx
  on public.newsletter_subscribers (created_at desc);

alter table public.newsletter_subscribers enable row level security;

-- Public may subscribe. Public may NOT read the list — an anon-readable
-- subscriber table is an email harvest waiting to happen.
drop policy if exists "newsletter: public can subscribe" on public.newsletter_subscribers;
create policy "newsletter: public can subscribe"
  on public.newsletter_subscribers for insert to anon, authenticated with check (true);

drop policy if exists "newsletter: admin can read" on public.newsletter_subscribers;
create policy "newsletter: admin can read"
  on public.newsletter_subscribers for select to authenticated using (true);

drop policy if exists "newsletter: admin can update" on public.newsletter_subscribers;
create policy "newsletter: admin can update"
  on public.newsletter_subscribers for update to authenticated using (true) with check (true);

drop policy if exists "newsletter: admin can delete" on public.newsletter_subscribers;
create policy "newsletter: admin can delete"
  on public.newsletter_subscribers for delete to authenticated using (true);

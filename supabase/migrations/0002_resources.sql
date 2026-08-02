-- ============================================================================
-- TaxElixir — resources (case studies, events/webinars, guides & ebooks)
-- Run after 0001_init.sql.
--
-- One table with a `kind` discriminator rather than three near-identical
-- tables: the fields overlap almost completely, and a single admin screen with
-- a filter is less to maintain than three copies of the same CRUD.
-- ============================================================================

create table if not exists public.resources (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  kind          text not null check (kind in ('case_study','event','guide')),
  slug          text not null unique,
  title         text not null,
  summary       text not null default '',
  content       text not null default '',
  cover_url     text,
  cover_alt     text,

  -- case studies
  client_name   text,          -- may stay null; anonymised studies are fine
  industry      text,
  outcome       text,          -- headline result, e.g. "3 weeks to first close"

  -- events
  starts_at     timestamptz,
  location      text,          -- null means online
  registration_url text,

  -- guides / ebooks
  file_url      text,          -- stored asset or external link
  gated         boolean not null default false,

  meta_title       text,
  meta_description text,
  is_featured   boolean not null default false,
  status        text not null default 'draft' check (status in ('draft','published')),
  published_at  timestamptz
);

create index if not exists resources_kind_status_idx
  on public.resources (kind, status, published_at desc);
create index if not exists resources_starts_at_idx
  on public.resources (starts_at desc) where kind = 'event';

alter table public.resources enable row level security;

drop policy if exists "resources: public reads published" on public.resources;
create policy "resources: public reads published"
  on public.resources for select to anon
  using (status = 'published' and published_at is not null and published_at <= now());

drop policy if exists "resources: admin full read" on public.resources;
create policy "resources: admin full read"
  on public.resources for select to authenticated using (true);

drop policy if exists "resources: admin writes" on public.resources;
create policy "resources: admin writes"
  on public.resources for insert to authenticated with check (true);

drop policy if exists "resources: admin updates" on public.resources;
create policy "resources: admin updates"
  on public.resources for update to authenticated using (true) with check (true);

drop policy if exists "resources: admin deletes" on public.resources;
create policy "resources: admin deletes"
  on public.resources for delete to authenticated using (true);

drop trigger if exists resources_touch_updated_at on public.resources;
create trigger resources_touch_updated_at
  before update on public.resources
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Guide downloads — who asked for what, when a guide is gated.
-- ---------------------------------------------------------------------------
create table if not exists public.guide_downloads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  resource_id uuid references public.resources(id) on delete set null,
  title       text not null,
  name        text not null,
  email       text not null,
  company     text,
  phone       text
);

create index if not exists guide_downloads_created_at_idx
  on public.guide_downloads (created_at desc);

alter table public.guide_downloads enable row level security;

drop policy if exists "guide downloads: public can submit" on public.guide_downloads;
create policy "guide downloads: public can submit"
  on public.guide_downloads for insert to anon, authenticated with check (true);

drop policy if exists "guide downloads: admin can read" on public.guide_downloads;
create policy "guide downloads: admin can read"
  on public.guide_downloads for select to authenticated using (true);

drop policy if exists "guide downloads: admin can delete" on public.guide_downloads;
create policy "guide downloads: admin can delete"
  on public.guide_downloads for delete to authenticated using (true);

-- Public bucket for downloadable guides and case-study PDFs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resource-files', 'resource-files', true, 26214400,
        array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public;

drop policy if exists "resource-files: anyone can read" on storage.objects;
create policy "resource-files: anyone can read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'resource-files');

drop policy if exists "resource-files: admin can write" on storage.objects;
create policy "resource-files: admin can write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'resource-files');

drop policy if exists "resource-files: admin can delete" on storage.objects;
create policy "resource-files: admin can delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'resource-files');

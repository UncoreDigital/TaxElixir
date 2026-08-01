-- ============================================================================
-- TaxElixir — initial schema
-- Run in the Supabase SQL Editor (Dashboard > SQL Editor > New query) against
-- the project referenced by NEXT_PUBLIC_SUPABASE_URL.
--
-- Security model throughout:
--   * anon may INSERT (public forms) and may SELECT only published blog posts.
--   * authenticated (the admin) may do everything else.
--   * Uploaded documents live in a PRIVATE bucket; the admin downloads them via
--     short-lived signed URLs. Nothing client-submitted is ever world-readable.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. leads — contact form submissions
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  company       text,
  phone         text,
  services      text[] not null default '{}',
  message       text,
  source_page   text,
  status        text not null default 'new'
                  check (status in ('new','contacted','qualified','won','lost','archived')),
  notes         text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);

alter table public.leads enable row level security;

drop policy if exists "leads: public can submit" on public.leads;
create policy "leads: public can submit"
  on public.leads for insert to anon, authenticated with check (true);

drop policy if exists "leads: admin can read" on public.leads;
create policy "leads: admin can read"
  on public.leads for select to authenticated using (true);

drop policy if exists "leads: admin can update" on public.leads;
create policy "leads: admin can update"
  on public.leads for update to authenticated using (true) with check (true);

drop policy if exists "leads: admin can delete" on public.leads;
create policy "leads: admin can delete"
  on public.leads for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- 2. posts — the Insights CMS
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  slug           text not null unique,
  title          text not null,
  excerpt        text not null default '',
  content        text not null default '',
  category       text not null default 'Insights',
  author         text not null default 'TaxElixir',
  cover_url      text,
  cover_alt      text,
  meta_title     text,
  meta_description text,
  is_featured    boolean not null default false,
  status         text not null default 'draft' check (status in ('draft','published')),
  published_at   timestamptz
);

create index if not exists posts_status_published_idx
  on public.posts (status, published_at desc);
create unique index if not exists posts_slug_idx on public.posts (slug);

alter table public.posts enable row level security;

-- Anonymous readers see published posts only — drafts must never leak.
drop policy if exists "posts: public reads published" on public.posts;
create policy "posts: public reads published"
  on public.posts for select to anon
  using (status = 'published' and published_at is not null and published_at <= now());

drop policy if exists "posts: admin full read" on public.posts;
create policy "posts: admin full read"
  on public.posts for select to authenticated using (true);

drop policy if exists "posts: admin writes" on public.posts;
create policy "posts: admin writes"
  on public.posts for insert to authenticated with check (true);

drop policy if exists "posts: admin updates" on public.posts;
create policy "posts: admin updates"
  on public.posts for update to authenticated using (true) with check (true);

drop policy if exists "posts: admin deletes" on public.posts;
create policy "posts: admin deletes"
  on public.posts for delete to authenticated using (true);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 3. document_submissions — secure client uploads
-- ---------------------------------------------------------------------------
create table if not exists public.document_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text,
  phone       text,
  notes       text,
  files       jsonb not null default '[]'::jsonb,
  total_size  bigint not null default 0,
  status      text not null default 'new'
                check (status in ('new','downloaded','archived'))
);

create index if not exists document_submissions_created_at_idx
  on public.document_submissions (created_at desc);

alter table public.document_submissions enable row level security;

drop policy if exists "uploads: public can submit" on public.document_submissions;
create policy "uploads: public can submit"
  on public.document_submissions for insert to anon, authenticated with check (true);

drop policy if exists "uploads: admin can read" on public.document_submissions;
create policy "uploads: admin can read"
  on public.document_submissions for select to authenticated using (true);

drop policy if exists "uploads: admin can update" on public.document_submissions;
create policy "uploads: admin can update"
  on public.document_submissions for update to authenticated using (true) with check (true);

drop policy if exists "uploads: admin can delete" on public.document_submissions;
create policy "uploads: admin can delete"
  on public.document_submissions for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- 4. site_settings — single source of truth for headline figures
--
-- This table exists specifically to prevent the failure mode observed on
-- unisonglobus.com, where per-page hard-coded numbers drifted until the UK page
-- claimed more clients (500+) than the global page claimed worldwide (350+).
-- Every figure on the site reads from exactly one row here.
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key         text primary key,
  value       text,
  label       text not null,
  group_name  text not null default 'stats',
  sort_order  int  not null default 0,
  updated_at  timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "settings: public can read" on public.site_settings;
create policy "settings: public can read"
  on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "settings: admin can write" on public.site_settings;
create policy "settings: admin can write"
  on public.site_settings for all to authenticated using (true) with check (true);

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- Seeded with NULL values on purpose: an unconfirmed figure renders as an em
-- dash, never as a fabricated number and never as a literal zero.
insert into public.site_settings (key, value, label, group_name, sort_order) values
  ('years',         null, 'Years Serving US CPA Firms',      'stats', 1),
  ('professionals', null, 'Accounting & Tax Professionals',  'stats', 2),
  ('firms',         null, 'CPA Firms Supported',             'stats', 3),
  ('returns',       null, 'Returns Prepared Annually',       'stats', 4),
  ('phone',         null, 'Primary Phone Number',            'contact', 1),
  ('address',       null, 'Registered Office Address',       'contact', 2),
  ('linkedin',      null, 'LinkedIn URL',                    'contact', 3)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- 5. Storage — private bucket for client documents
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-documents',
  'client-documents',
  false,                      -- PRIVATE. Never flip this to true.
  52428800,                   -- 50 MB; raise with the project-wide limit if needed
  array[
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "client-documents: public can upload" on storage.objects;
create policy "client-documents: public can upload"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'client-documents');

drop policy if exists "client-documents: admin can read" on storage.objects;
create policy "client-documents: admin can read"
  on storage.objects for select to authenticated
  using (bucket_id = 'client-documents');

drop policy if exists "client-documents: admin can delete" on storage.objects;
create policy "client-documents: admin can delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'client-documents');

-- Public blog images (world-readable by design, admin-writable only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-media', 'post-media', true, 10485760,
        array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml'])
on conflict (id) do update set public = excluded.public;

drop policy if exists "post-media: anyone can read" on storage.objects;
create policy "post-media: anyone can read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'post-media');

drop policy if exists "post-media: admin can write" on storage.objects;
create policy "post-media: admin can write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'post-media');

drop policy if exists "post-media: admin can delete" on storage.objects;
create policy "post-media: admin can delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'post-media');

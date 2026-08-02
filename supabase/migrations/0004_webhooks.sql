-- ============================================================================
-- TaxElixir — Database Webhooks → lead-notification edge function
-- Run after 0003_newsletter.sql.
--
-- Deploy the function first:
--   supabase functions deploy lead-notification
--   supabase secrets set SMTP_HOST=... SMTP_PORT=465 SMTP_USER=... \
--                        SMTP_PASS=... NOTIFICATION_EMAIL=...
--
-- Then run this file, replacing <PROJECT_REF> and <SERVICE_ROLE_KEY>.
--
-- You can also create these in the dashboard (Database → Webhooks) instead of
-- running this SQL — same result. The SQL is here so the wiring is versioned
-- alongside the schema rather than living only in someone's dashboard.
-- ============================================================================

create extension if not exists pg_net with schema extensions;

-- ---------------------------------------------------------------------------
-- Generic dispatcher. One function, four triggers — the edge function switches
-- on `table`, so adding a notifying table later is one more trigger, not more
-- Deno code.
-- ---------------------------------------------------------------------------
create or replace function public.notify_lead_webhook()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  fn_url text := 'https://<PROJECT_REF>.supabase.co/functions/v1/lead-notification';
  svc_key text := '<SERVICE_ROLE_KEY>';
begin
  perform extensions.http_post(
    url     := fn_url,
    headers := jsonb_build_object(
                 'Content-Type',  'application/json',
                 'Authorization', 'Bearer ' || svc_key
               ),
    body    := jsonb_build_object(
                 'type',   TG_OP,
                 'table',  TG_TABLE_NAME,
                 'schema', TG_TABLE_SCHEMA,
                 'record', to_jsonb(NEW)
               ),
    timeout_milliseconds := 5000
  );
  return NEW;
exception
  -- Never let a notification failure roll back the row. The lead matters more
  -- than the email about the lead.
  when others then
    raise warning 'notify_lead_webhook failed for %: %', TG_TABLE_NAME, sqlerrm;
    return NEW;
end;
$$;

drop trigger if exists leads_notify on public.leads;
create trigger leads_notify
  after insert on public.leads
  for each row execute function public.notify_lead_webhook();

drop trigger if exists document_submissions_notify on public.document_submissions;
create trigger document_submissions_notify
  after insert on public.document_submissions
  for each row execute function public.notify_lead_webhook();

drop trigger if exists guide_downloads_notify on public.guide_downloads;
create trigger guide_downloads_notify
  after insert on public.guide_downloads
  for each row execute function public.notify_lead_webhook();

drop trigger if exists newsletter_notify on public.newsletter_subscribers;
create trigger newsletter_notify
  after insert on public.newsletter_subscribers
  for each row execute function public.notify_lead_webhook();

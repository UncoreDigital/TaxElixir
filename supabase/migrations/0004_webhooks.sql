-- ============================================================================
-- TaxElixir — Database Webhooks → lead-notification edge function
-- Run after 0003_newsletter.sql. Safe to re-run: everything here is idempotent.
--
-- ORDER OF OPERATIONS — all four steps, or no email arrives:
--
--   1. Pick a shared secret. Any long random string; it is not a Supabase key:
--        openssl rand -hex 32
--
--   2. Give it to the function:
--        supabase secrets set WEBHOOK_SECRET=<that string>
--        supabase secrets set SMTP_HOST=smtp.gmail.com SMTP_PORT=465 \
--          SMTP_USER=... SMTP_PASS=<app password> NOTIFICATION_EMAIL=...
--
--   3. Deploy with JWT verification OFF (supabase/config.toml already sets it):
--        supabase functions deploy lead-notification
--      Dashboard equivalent: Edge Functions → lead-notification → Settings →
--      turn off "Verify JWT with legacy secret".
--
--   4. Give the SAME shared secret to the database, then run this file:
--        select vault.create_secret(
--          '<that same string>', 'lead_notification_secret',
--          'Shared secret sent as x-webhook-secret to lead-notification'
--        );
--
-- WHY NOT A SUPABASE KEY IN THE AUTHORIZATION HEADER
-- This project uses the new API key format (`sb_publishable_…` / `sb_secret_…`).
-- Supabase does not accept those in an `Authorization: Bearer` header — the
-- gateway rejects the call before the function starts, so the failure leaves no
-- trace in the function's invocation log. A shared secret in our own header,
-- checked inside the function, fails visibly instead.
-- ============================================================================

-- pg_net is NOT relocatable: it installs into its own `net` schema. Older
-- Supabase projects may have it in `extensions`. The trigger below is written to
-- work either way rather than assuming one of them.
create extension if not exists pg_net;
create extension if not exists supabase_vault with schema vault;

-- ---------------------------------------------------------------------------
-- Generic dispatcher. One function, four triggers — the edge function switches
-- on `table`, so adding a notifying table later is one more trigger, not more
-- Deno code.
-- ---------------------------------------------------------------------------
create or replace function public.notify_lead_webhook()
returns trigger
language plpgsql
security definer
-- `http_post` is deliberately unqualified in the body: search_path covers both
-- schemas pg_net can live in.
set search_path = public, net, extensions, vault
as $$
declare
  fn_url     text := 'https://buiywfheuwydfnijqsfe.supabase.co/functions/v1/lead-notification';
  hook_secret text;
begin
  select decrypted_secret into hook_secret
  from vault.decrypted_secrets
  where name = 'lead_notification_secret';

  if coalesce(hook_secret, '') = '' then
    -- Loud, because the alternative is leads arriving that nobody is told about.
    raise warning 'notify_lead_webhook: vault secret "lead_notification_secret" is missing — no notification sent for %', TG_TABLE_NAME;
    return NEW;
  end if;

  -- pg_net is asynchronous: this queues the request and returns immediately, so
  -- the INSERT never waits on HTTP. The outcome lands in net._http_response a
  -- moment later, which is the only place delivery failures are visible.
  perform http_post(
    url     := fn_url,
    headers := jsonb_build_object(
                 'Content-Type',     'application/json',
                 'x-webhook-secret', hook_secret
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
  -- than the email about the lead. Note this only catches errors raised while
  -- QUEUEING the request; a request that is queued and then fails in transit
  -- shows up in net._http_response, not here.
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

-- ---------------------------------------------------------------------------
-- Verify. This RAISES rather than warns: a half-wired notification path looks
-- identical to a working one from the website, so it must fail here or not at
-- all.
-- ---------------------------------------------------------------------------
do $$
declare
  net_schema text;
  has_secret boolean;
  trigger_ct int;
begin
  select n.nspname into net_schema
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where p.proname = 'http_post' and n.nspname in ('net', 'extensions')
  limit 1;

  select exists (
    select 1 from vault.decrypted_secrets
    where name = 'lead_notification_secret' and coalesce(decrypted_secret, '') <> ''
  ) into has_secret;

  select count(*) into trigger_ct from pg_trigger
   where tgname in ('leads_notify', 'document_submissions_notify',
                    'guide_downloads_notify', 'newsletter_notify');

  if net_schema is null then
    raise exception 'pg_net is not installed — http_post not found in net or extensions';
  end if;

  if trigger_ct < 4 then
    raise exception 'Expected 4 notify triggers, found %', trigger_ct;
  end if;

  if not has_secret then
    raise exception using
      message = 'Vault secret "lead_notification_secret" is not set — no notification email can be sent.',
      hint    = 'Run: select vault.create_secret(''<your shared secret>'', ''lead_notification_secret''); then re-run this file. It must equal the WEBHOOK_SECRET set on the edge function.';
  end if;

  raise notice 'lead-notification webhooks ok: % triggers, pg_net in %, vault secret present',
    trigger_ct, net_schema;
end;
$$;

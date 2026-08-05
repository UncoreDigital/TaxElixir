-- ---------------------------------------------------------------------------
-- 0005 — replace the volume counters with the client's highlighted figures
--
-- The original four stats were unconfirmed volume claims (years in business,
-- headcount, firms supported, returns filed) and shipped seeded as NULL, so
-- every one rendered as an em dash. The client replaced them (Website Updates
-- sheet, row 8) with four operational facts they are willing to state.
--
-- The keys change, so the old rows have to go with them: leaving them in place
-- would show an admin four editable fields — "Years Serving US CPA Firms" and
-- friends — that no longer render anywhere on the site. A value typed into a
-- field that does nothing is worse than no field.
--
-- Values are seeded here rather than left NULL because these are not figures
-- awaiting confirmation; they are the delivery standard, and lib/content.ts
-- carries the same values as the static fallback.
-- ---------------------------------------------------------------------------

delete from public.site_settings
where group_name = 'stats'
  and key in ('years', 'professionals', 'firms', 'returns');

insert into public.site_settings (key, value, label, group_name, sort_order) values
  ('review_levels',   '3',        'Review Levels',                  'stats', 1),
  ('cpa_led',         'CPA-Led',  'Delivery Leadership',            'stats', 2),
  ('onsite_secure',   '100',      'Onsite Secured Operation (%)',   'stats', 3),
  ('software_hours',  '24',       'Software Hours In Use Per Day',  'stats', 4)
on conflict (key) do nothing;

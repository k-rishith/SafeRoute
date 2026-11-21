-- SafeRoute Supabase schema (PostgreSQL + PostGIS)
create extension if not exists postgis;
create extension if not exists "uuid-ossp";

-- Users (profile; auth handled by Supabase Auth)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  role text not null default 'resident' check (role in ('resident','verifier','maintenance','admin')),
  created_at timestamptz default now()
);

-- Locations
create table if not exists public.locations (
  id uuid primary key default uuid_generate_v4(),
  geom geography(point,4326) not null,
  address text,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);
create index if not exists locations_geom_idx on public.locations using gist(geom);

-- Hazard reports
create table if not exists public.hazard_reports (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  severity text not null check (severity in ('Low','Medium','High','Critical')),
  description text,
  status text not null default 'Reported' check (status in ('Reported','Under Review','Verified','Assigned','In Progress','Resolved','Disputed','Rejected')),
  location_id uuid references public.locations(id),
  reporter_id uuid references public.users(id),
  assigned_to uuid references public.users(id),
  confidence int default 0,
  verified_count int default 0,
  disputed_count int default 0,
  reported_at timestamptz default now(),
  last_verified_at timestamptz,
  resolved_at timestamptz
);
create index if not exists hazard_reports_status_idx on public.hazard_reports(status);
create index if not exists hazard_reports_category_idx on public.hazard_reports(category);

-- Report images
create table if not exists public.report_images (
  id uuid primary key default uuid_generate_v4(),
  hazard_id uuid references public.hazard_reports(id) on delete cascade,
  url text not null,
  kind text default 'evidence' check (kind in ('evidence','before','after')),
  uploaded_by uuid references public.users(id),
  uploaded_at timestamptz default now()
);

-- Verifications
create table if not exists public.verifications (
  id uuid primary key default uuid_generate_v4(),
  hazard_id uuid references public.hazard_reports(id) on delete cascade,
  user_id uuid references public.users(id),
  verdict text not null check (verdict in ('verified','disputed','resolved')),
  created_at timestamptz default now(),
  unique(hazard_id, user_id)
);

-- Keep hazard verification totals synchronized with community responses.
create or replace function public.sync_hazard_verification_counts(target_hazard_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.hazard_reports h
  set verified_count = totals.verified_count,
      disputed_count = totals.disputed_count,
      confidence = case
        when totals.verified_count + totals.disputed_count = 0 then 0
        else round(100.0 * totals.verified_count / (totals.verified_count + totals.disputed_count))::int
      end,
      last_verified_at = now()
  from (
    select
      count(*) filter (where verdict in ('verified','resolved'))::int as verified_count,
      count(*) filter (where verdict = 'disputed')::int as disputed_count
    from public.verifications
    where hazard_id = target_hazard_id
  ) totals
  where h.id = target_hazard_id;
$$;

create or replace function public.handle_verification_count_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.sync_hazard_verification_counts(old.hazard_id);
    return old;
  elsif tg_op = 'UPDATE' then
    perform public.sync_hazard_verification_counts(old.hazard_id);
    if old.hazard_id is distinct from new.hazard_id then
      perform public.sync_hazard_verification_counts(new.hazard_id);
    end if;
    return new;
  else
    perform public.sync_hazard_verification_counts(new.hazard_id);
    return new;
  end if;
end;
$$;

drop trigger if exists verification_counts_after_change on public.verifications;
create trigger verification_counts_after_change
after insert or update or delete on public.verifications
for each row execute procedure public.handle_verification_count_change();

-- Recalculate existing totals once when this schema update is applied.
update public.hazard_reports h
set verified_count = totals.verified_count,
    disputed_count = totals.disputed_count,
    confidence = case
      when totals.verified_count + totals.disputed_count = 0 then 0
      else round(100.0 * totals.verified_count / (totals.verified_count + totals.disputed_count))::int
    end
from (
  select
    hazard_id,
    count(*) filter (where verdict in ('verified','resolved'))::int as verified_count,
    count(*) filter (where verdict = 'disputed')::int as disputed_count
  from public.verifications
  group by hazard_id
) totals
where h.id = totals.hazard_id;

update public.hazard_reports h
set verified_count = 0, disputed_count = 0, confidence = 0
where not exists (select 1 from public.verifications v where v.hazard_id = h.id);

-- Comments
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  hazard_id uuid references public.hazard_reports(id) on delete cascade,
  user_id uuid references public.users(id),
  text text not null,
  created_at timestamptz default now()
);

-- Assignments
create table if not exists public.assignments (
  id uuid primary key default uuid_generate_v4(),
  hazard_id uuid references public.hazard_reports(id) on delete cascade,
  assignee_id uuid references public.users(id),
  assigned_by uuid references public.users(id),
  assigned_at timestamptz default now(),
  notes text
);

-- Status history
create table if not exists public.status_history (
  id uuid primary key default uuid_generate_v4(),
  hazard_id uuid references public.hazard_reports(id) on delete cascade,
  status text not null,
  changed_by uuid references public.users(id),
  changed_at timestamptz default now(),
  note text
);

-- RLS
alter table public.users enable row level security;
alter table public.hazard_reports enable row level security;
alter table public.report_images enable row level security;
alter table public.verifications enable row level security;
alter table public.comments enable row level security;
alter table public.assignments enable row level security;
alter table public.status_history enable row level security;
alter table public.locations enable row level security;

-- Public read for hazards/locations
create policy "hazards readable by all" on public.hazard_reports for select using (true);
create policy "locations readable by all" on public.locations for select using (true);
create policy "images readable by all" on public.report_images for select using (true);
create policy "comments readable by all" on public.comments for select using (true);
create policy "status history readable by all" on public.status_history for select using (true);

-- Authenticated insert
create policy "auth users can report" on public.hazard_reports for insert with check (auth.uid() = reporter_id);
create policy "auth users can verify" on public.verifications for insert with check (auth.uid() = user_id);
create policy "auth users can comment" on public.comments for insert with check (auth.uid() = user_id);

-- Duplicate detection helper
create or replace function public.nearby_hazards(lat double precision, lng double precision, radius_m int default 50)
returns setof public.hazard_reports as $$
  select h.* from public.hazard_reports h
  join public.locations l on l.id = h.location_id
  where st_dwithin(l.geom, st_makepoint(lng,lat)::geography, radius_m);
$$ language sql stable;

-- Hotspot view
create or replace view public.hazard_hotspots as
select l.id, st_y(l.geom::geometry) as lat, st_x(l.geom::geometry) as lng, count(h.id) as reports
from public.locations l join public.hazard_reports h on h.location_id = l.id
group by l.id order by reports desc;
-- Additional policies and storage setup required by the updated frontend.
-- Run this after the main schema. The browser client must never use a service-role key.
drop policy if exists "users can update own verification" on public.verifications;
create policy "users can update own verification" on public.verifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users can upload report images" on public.report_images;
create policy "users can upload report images" on public.report_images
  for insert with check (auth.uid() = uploaded_by);

drop policy if exists "users can update own report images" on public.report_images;
create policy "users can update own report images" on public.report_images
  for update using (auth.uid() = uploaded_by) with check (auth.uid() = uploaded_by);

-- Public bucket for the demo's evidence preview URLs. For private deployments,
-- use signed URLs and replace the public-read policy with scoped access policies.
insert into storage.buckets (id, name, public)
values ('hazard-evidence', 'hazard-evidence', true)
on conflict (id) do nothing;

drop policy if exists "hazard evidence readable" on storage.objects;
create policy "hazard evidence readable" on storage.objects
  for select using (bucket_id = 'hazard-evidence');

drop policy if exists "authenticated users upload hazard evidence" on storage.objects;
create policy "authenticated users upload hazard evidence" on storage.objects
  for insert with check (bucket_id = 'hazard-evidence' and auth.uid() is not null);


-- Create a public.users profile automatically when a Supabase Auth user signs up.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'name',''), split_part(coalesce(new.email,'user'),'@',1)),
    new.email
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_saferoute on auth.users;
create trigger on_auth_user_created_saferoute
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

-- A user can create a location only while attributing it to their own profile.
alter table public.locations add column if not exists created_by uuid references public.users(id);
drop policy if exists "authenticated users can create locations" on public.locations;
create policy "authenticated users can create locations" on public.locations
  for insert with check (auth.uid() = created_by);

drop policy if exists "users can read own profile" on public.users;
create policy "users can read own profile" on public.users
  for select using (auth.uid() = id);

drop policy if exists "users can update own profile" on public.users;
create policy "users can update own profile" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);


-- Publish hazard counter updates to Supabase Realtime when the standard
-- publication is available. Verification rows remain private to their normal RLS rules.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'hazard_reports'
     ) then
    execute 'alter publication supabase_realtime add table public.hazard_reports';
  end if;
end;
$$;

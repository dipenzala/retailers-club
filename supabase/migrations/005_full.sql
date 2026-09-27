-- Contact reveal audit
create table if not exists contact_reveals (
  id uuid primary key default uuid_generate_v4(),
  viewer_id uuid references profiles(id) on delete cascade,
  owner_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now()
);

-- Notifications (already exists but ensure)
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  kind text, title text, body text, link text,
  read_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_notifications_user on notifications(user_id, created_at desc);

-- Saved searches
create table if not exists saved_searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  query text, filters jsonb,
  created_at timestamptz default now()
);

-- Subscriptions
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  plan text, status text default 'active',
  started_at timestamptz default now(),
  ends_at timestamptz
);

-- RLS
alter table contact_reveals enable row level security;
alter table notifications enable row level security;
alter table saved_searches enable row level security;
alter table subscriptions enable row level security;

create policy if not exists "reveal_owner_read" on contact_reveals for select using (auth.uid() = owner_id or auth.uid() = viewer_id);
create policy if not exists "reveal_insert" on contact_reveals for insert with check (auth.uid() = viewer_id);
create policy if not exists "notif_owner" on notifications for all using (auth.uid() = user_id);
create policy if not exists "search_owner" on saved_searches for all using (auth.uid() = user_id);
create policy if not exists "sub_owner" on subscriptions for all using (auth.uid() = user_id);

-- Nearby manufacturers function (PostGIS)
create or replace function nearby_manufacturers(
  lat float, lng float, radius_km int default 25, result_limit int default 20
)
returns table (id uuid, business_name text, city text, distance_km float)
language sql stable as $$
  select profiles.id, profiles.business_name, profiles.city,
    extensions.st_distance(profiles.location, extensions.st_makepoint(lng, lat)::extensions.geography) / 1000 as distance_km
  from profiles
  where profiles.location is not null and profiles.role = 'manufacturer'
    and extensions.st_dwithin(profiles.location, extensions.st_makepoint(lng, lat)::extensions.geography, radius_km * 1000)
  order by distance_km limit result_limit;
$$;

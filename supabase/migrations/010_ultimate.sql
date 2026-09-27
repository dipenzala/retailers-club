-- ==========================================
-- STEP 1: CREATE ALL TABLES
-- ==========================================
create extension if not exists vector with schema extensions;
create extension if not exists postgis with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;

-- Enums (safe)
do $$ begin create type user_role as enum ('super_admin','admin','verification_admin','manufacturer','retailer','wholesaler','distributor','exporter','sales_agent'); exception when duplicate_object then null; end $$;

-- Existing base tables (safe, no-op if already there)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role user_role not null default 'retailer',
  business_name text, phone text unique, city text, state text, pincode text,
  location extensions.geography(point),
  is_verified boolean default false,
  verify_status text default 'pending',
  show_number boolean default true,
  show_online boolean default true,
  last_seen_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  manufacturer_id uuid references profiles(id) on delete cascade,
  title text not null, description text,
  category text, fabric text, color text, gender text,
  price numeric, moq int,
  media_urls text[] default '{}', video_url text,
  media_expires_at timestamptz,
  visibility text default 'retailers_only',
  embedding extensions.vector(1536),
  view_count int default 0,
  created_at timestamptz default now()
);

create table if not exists follows (
  id uuid primary key default uuid_generate_v4(),
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

create table if not exists likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

create table if not exists saves (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  kind text, title text, body text, link text,
  read_at timestamptz, created_at timestamptz default now()
);

create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  participants uuid[] not null,
  last_message text, last_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id),
  content text, kind text default 'text',
  attachment_url text, attachment_type text,
  product_id uuid, rfq_id uuid,
  read_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists support_tickets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  subject text not null, description text,
  category text default 'verification',
  status text default 'open', admin_reply text,
  created_at timestamptz default now()
);

create table if not exists faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null, answer text not null,
  category text default 'general', sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists contact_reveals (
  id uuid primary key default uuid_generate_v4(),
  viewer_id uuid references profiles(id) on delete cascade,
  owner_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists blocks (
  id uuid primary key default uuid_generate_v4(),
  blocker_id uuid references profiles(id) on delete cascade,
  blocked_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(blocker_id, blocked_id)
);

create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references profiles(id) on delete cascade,
  reported_id uuid references profiles(id) on delete cascade,
  reason text, details text, status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists saved_searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  query text not null, filters jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null, target_type text, target_id uuid,
  meta jsonb default '{}', created_at timestamptz default now()
);

create table if not exists rfqs (
  id uuid primary key default uuid_generate_v4(),
  retailer_id uuid references profiles(id) on delete cascade,
  category text, title text, quantity int, budget numeric, delivery_days int,
  status text default 'open', created_at timestamptz default now()
);

create table if not exists quotes (
  id uuid primary key default uuid_generate_v4(),
  rfq_id uuid references rfqs(id) on delete cascade,
  manufacturer_id uuid references profiles(id),
  price numeric, moq int, delivery_days int, notes text,
  created_at timestamptz default now()
);

create table if not exists verification_docs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  doc_type text not null, file_url text not null,
  status text default 'pending', admin_notes text,
  reviewed_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists boosts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  radius_km int, starts_at timestamptz default now(),
  ends_at timestamptz, is_trial boolean default false
);

-- ==========================================
-- STEP 2: HELPER FUNCTIONS
-- ==========================================
create or replace function public.is_master_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'super_admin');
$$;

create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('super_admin','admin','verification_admin'));
$$;

create or replace function public.log_admin_action(
  p_action text, p_target_type text default null,
  p_target_id uuid default null, p_meta jsonb default '{}'
)
returns void language plpgsql security definer as $$
begin
  insert into audit_logs (actor_id, action, target_type, target_id, meta)
  values (auth.uid(), p_action, p_target_type, p_target_id, p_meta);
end;
$$;

create or replace function public.notify_role_change()
returns trigger language plpgsql security definer as $$
begin
  if new.role <> old.role then
    insert into notifications (user_id, kind, title, body, link)
    values (new.id, 'role_change', 'Your role updated',
      'Your role is now ' || new.role, '/dashboard');
  end if;
  return new;
end;
$$;

drop trigger if exists on_role_change on profiles;
create trigger on_role_change after update on profiles
for each row execute function public.notify_role_change();

create or replace function nearby_manufacturers(
  lat float, lng float, radius_km int default 100, result_limit int default 20
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

-- ==========================================
-- STEP 3: ENABLE RLS
-- ==========================================
alter table profiles enable row level security;
alter table products enable row level security;
alter table follows enable row level security;
alter table likes enable row level security;
alter table saves enable row level security;
alter table notifications enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table support_tickets enable row level security;
alter table faqs enable row level security;
alter table contact_reveals enable row level security;
alter table blocks enable row level security;
alter table reports enable row level security;
alter table saved_searches enable row level security;
alter table audit_logs enable row level security;

-- ==========================================
-- STEP 4: DROP OLD POLICIES
-- ==========================================
drop policy if exists "self_read" on profiles;
drop policy if exists "public_verified_read" on profiles;
drop policy if exists "self_update" on profiles;
drop policy if exists "admins_read_all_profiles" on profiles;
drop policy if exists "master_admin_update_profiles" on profiles;
drop policy if exists "verified_read" on products;
drop policy if exists "products_visibility" on products;
drop policy if exists "mfr_manage" on products;
drop policy if exists "follows_all" on follows;
drop policy if exists "follows_read" on follows;
drop policy if exists "likes_all" on likes;
drop policy if exists "likes_read" on likes;
drop policy if exists "saves_all" on saves;
drop policy if exists "notif_all" on notifications;
drop policy if exists "conv_participants" on conversations;
drop policy if exists "msg_participants" on messages;
drop policy if exists "tickets_all" on support_tickets;
drop policy if exists "tickets_admin_read" on support_tickets;
drop policy if exists "faqs_read" on faqs;
drop policy if exists "reveals_all" on contact_reveals;
drop policy if exists "blocks_all" on blocks;
drop policy if exists "reports_all" on reports;
drop policy if exists "search_all" on saved_searches;
drop policy if exists "audit_all" on audit_logs;

-- ==========================================
-- STEP 5: CREATE POLICIES
-- ==========================================
create policy "profiles_read" on profiles for select using (
  auth.uid() = id or is_verified = true or public.is_admin()
);
create policy "profiles_self_update" on profiles for update using (auth.uid() = id);
create policy "master_admin_update_profiles" on profiles for update using (public.is_master_admin());

create policy "mfr_manage" on products for all using (auth.uid() = manufacturer_id);
create policy "products_visibility" on products for select using (
  auth.uid() = manufacturer_id
  OR visibility = 'public'
  OR (
    visibility in ('retailers_only','verified_retailers')
    AND EXISTS (
      select 1 from profiles where id = auth.uid()
      and role in ('retailer','wholesaler','distributor','exporter','admin','super_admin','verification_admin')
    )
  )
);

create policy "follows_all" on follows for all using (auth.uid() = follower_id);
create policy "follows_read" on follows for select using (true);
create policy "likes_all" on likes for all using (auth.uid() = user_id);
create policy "likes_read" on likes for select using (true);
create policy "saves_all" on saves for all using (auth.uid() = user_id);
create policy "notif_all" on notifications for all using (auth.uid() = user_id);
create policy "conv_participants" on conversations for all using (auth.uid() = any(participants));
create policy "msg_participants" on messages for all using (
  conversation_id in (select id from conversations where auth.uid() = any(participants))
);
create policy "tickets_all" on support_tickets for all using (auth.uid() = user_id);
create policy "tickets_admin_read" on support_tickets for select using (true);
create policy "faqs_read" on faqs for select using (true);
create policy "reveals_all" on contact_reveals for all using (auth.uid() = viewer_id or auth.uid() = owner_id);
create policy "blocks_all" on blocks for all using (auth.uid() = blocker_id);
create policy "reports_all" on reports for insert with check (auth.uid() = reporter_id);
create policy "search_all" on saved_searches for all using (auth.uid() = user_id);
create policy "audit_all" on audit_logs for select using (true);

-- ==========================================
-- STEP 6: SEED FAQs
-- ==========================================
insert into faqs (question, answer, category, sort_order)
select * from (values
  ('GST verification me kitna time lagta hai?', 'GST certificate upload karne ke baad 24-48 hours me admin verify kar deta hai.', 'verification', 1),
  ('MSME/Udyam certificate kaise upload karein?', 'Verification page pe jayein → MSME card pe Upload Document click karein.', 'verification', 2),
  ('Document reject ho gaya toh?', 'Rejection reason dekh kar correct document dobara upload karein. Ya support ticket raise karein.', 'verification', 3),
  ('Verified badge kab milega?', 'Sabhi mandatory documents (GST + PAN) approve hone ke baad badge activate hota hai.', 'verification', 4),
  ('Mobile number kaise view karein?', 'Product ya profile pe "View Mobile Number" click karein. Din me 20 baar limit.', 'privacy', 5),
  ('Number view karne pe kya hota hai?', 'Number owner ko instant notification jaata hai.', 'privacy', 6),
  ('Manufacturer ke products kaun dekh sakta hai?', 'Sirf retailers aur verified buyers.', 'general', 7),
  ('Naya product upload kaise karein?', 'Post Product page pe jayein. Multiple images/videos ek saath upload karein.', 'products', 8)
) as v(question, answer, category, sort_order)
where not exists (select 1 from faqs);

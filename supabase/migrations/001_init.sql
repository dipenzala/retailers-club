-- ============================================
-- Retailers Club — Full Schema
-- ============================================

-- Extensions (corrected for Supabase)
create extension if not exists "postgis" with schema extensions;
create extension if not exists vector with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;

-- ============================================
-- ENUMS
-- ============================================
create type user_role as enum
  ('super_admin','admin','verification_admin','manufacturer','retailer','wholesaler','distributor','exporter','sales_agent');

create type verify_status as enum
  ('pending','approved','rejected','correction_requested');

create type product_visibility as enum
  ('public','retailers_only','verified_retailers','selected','private');

create type rfq_status as enum
  ('open','quoted','closed','cancelled');

create type message_kind as enum
  ('text','product','rfq','quote','image','doc');

-- ============================================
-- PROFILES
-- ============================================
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role user_role not null default 'retailer',
  business_name text,
  phone text unique,
  city text,
  state text,
  pincode text,
  location extensions.geography(point),
  is_verified boolean default false,
  verify_status verify_status default 'pending',
  show_number boolean default true,
  show_online boolean default true,
  created_at timestamptz default now()
);

create index on profiles using gist(location);
create index on profiles(role);

-- ============================================
-- VERIFICATION DOCUMENTS
-- ============================================
create table verification_docs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  doc_type text not null,
  file_url text not null,
  status verify_status default 'pending',
  admin_notes text,
  reviewed_by uuid references profiles(id),
  created_at timestamptz default now()
);

create index on verification_docs(user_id);

-- ============================================
-- PRODUCTS
-- ============================================
create table products (
  id uuid primary key default uuid_generate_v4(),
  manufacturer_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  category text,
  fabric text,
  color text,
  gender text,
  price numeric,
  moq int,
  media_urls text[] default '{}',
  media_expires_at timestamptz,
  visibility product_visibility default 'verified_retailers',
  embedding extensions.vector(1536),
  created_at timestamptz default now()
);

create index on products(manufacturer_id);
create index on products(category);
create index on products using ivfflat (embedding extensions.vector_cosine_ops);

-- ============================================
-- RFQ
-- ============================================
create table rfqs (
  id uuid primary key default uuid_generate_v4(),
  retailer_id uuid references profiles(id) on delete cascade,
  category text,
  title text,
  quantity int,
  budget numeric,
  delivery_days int,
  status rfq_status default 'open',
  created_at timestamptz default now()
);

create table quotes (
  id uuid primary key default uuid_generate_v4(),
  rfq_id uuid references rfqs(id) on delete cascade,
  manufacturer_id uuid references profiles(id),
  price numeric,
  moq int,
  delivery_days int,
  notes text,
  created_at timestamptz default now()
);

-- ============================================
-- CHAT
-- ============================================
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  participants uuid[] not null,
  last_message text,
  last_at timestamptz default now()
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id),
  content text,
  kind message_kind default 'text',
  meta jsonb,
  read_at timestamptz,
  created_at timestamptz default now()
);

create index on messages(conversation_id, created_at desc);

-- ============================================
-- CONTACT REVEAL AUDIT
-- ============================================
create table contact_reveals (
  id uuid primary key default uuid_generate_v4(),
  viewer_id uuid references profiles(id),
  owner_id uuid references profiles(id),
  revealed_at timestamptz default now()
);

-- ============================================
-- BOOSTS
-- ============================================
create table boosts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  radius_km int,
  starts_at timestamptz default now(),
  ends_at timestamptz,
  is_trial boolean default false
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  kind text,
  title text,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================
-- AUDIT LOG
-- ============================================
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid,
  action text,
  target text,
  meta jsonb,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table profiles enable row level security;
alter table products enable row level security;
alter table messages enable row level security;
alter table verification_docs enable row level security;
alter table contact_reveals enable row level security;
alter table notifications enable row level security;

-- Profiles policies
create policy "self_read" on profiles
  for select using (auth.uid() = id);

create policy "public_verified_read" on profiles
  for select using (is_verified = true);

create policy "self_update" on profiles
  for update using (auth.uid() = id);

-- Products policies
create policy "mfr_manage" on products
  for all using (auth.uid() = manufacturer_id);

create policy "verified_read" on products
  for select using (
    visibility in ('public','retailers_only','verified_retailers')
  );

-- Verification docs
create policy "doc_owner" on verification_docs
  for all using (auth.uid() = user_id);

-- Notifications
create policy "notif_owner" on notifications
  for all using (auth.uid() = user_id);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, phone, role)
  values (new.id, new.phone, 'retailer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();
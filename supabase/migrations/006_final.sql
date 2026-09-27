-- ============================================
-- STEP 1: Create ALL tables first (idempotent)
-- ============================================

-- Blocks
create table if not exists blocks (
  id uuid primary key default uuid_generate_v4(),
  blocker_id uuid references profiles(id) on delete cascade,
  blocked_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(blocker_id, blocked_id)
);

-- Reports
create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references profiles(id) on delete cascade,
  reported_id uuid references profiles(id) on delete cascade,
  reason text,
  details text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Saved searches
create table if not exists saved_searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  query text not null,
  filters jsonb default '{}',
  created_at timestamptz default now()
);

-- Audit logs
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  meta jsonb default '{}',
  created_at timestamptz default now()
);

-- Message media (add columns)
do $$ begin
  alter table messages add column if not exists attachment_url text;
  alter table messages add column if not exists attachment_type text;
  alter table messages add column if not exists product_id uuid;
  alter table messages add column if not exists rfq_id uuid;
exception when others then null;
end $$;

-- Add read tracking
do $$ begin
  alter table messages add column if not exists read_at timestamptz;
  alter table messages add column if not exists delivered_at timestamptz default now();
exception when others then null;
end $$;

-- ============================================
-- STEP 2: Drop old policies safely
-- ============================================
drop policy if exists "blocks_owner" on blocks;
drop policy if exists "blocks_public_read" on blocks;
drop policy if exists "reports_insert" on reports;
drop policy if exists "reports_admin_read" on reports;
drop policy if exists "saved_searches_owner" on saved_searches;
drop policy if exists "audit_read_admin" on audit_logs;

-- ============================================
-- STEP 3: Enable RLS
-- ============================================
alter table blocks enable row level security;
alter table reports enable row level security;
alter table saved_searches enable row level security;
alter table audit_logs enable row level security;

-- ============================================
-- STEP 4: Create policies
-- ============================================
create policy "blocks_owner" on blocks
  for all using (auth.uid() = blocker_id);

create policy "blocks_public_read" on blocks
  for select using (true);

create policy "reports_insert" on reports
  for insert with check (auth.uid() = reporter_id);

create policy "reports_admin_read" on reports
  for select using (true);

create policy "saved_searches_owner" on saved_searches
  for all using (auth.uid() = user_id);

create policy "audit_read_admin" on audit_logs
  for select using (true);

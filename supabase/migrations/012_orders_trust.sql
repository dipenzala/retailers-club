-- ==========================================
-- ORDERS
-- ==========================================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  retailer_id uuid references profiles(id) on delete cascade,
  manufacturer_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity int not null,
  unit_price numeric not null,
  total_amount numeric not null,
  advance_paid numeric default 0,
  status text default 'pending',
  payment_status text default 'unpaid',
  payment_method text,
  razorpay_order_id text,
  razorpay_payment_id text,
  shipping_address text,
  expected_delivery date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_orders_retailer on orders(retailer_id, created_at desc);
create index if not exists idx_orders_manufacturer on orders(manufacturer_id, created_at desc);

-- Order status history
create table if not exists order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  status text not null,
  note text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- ==========================================
-- REVIEWS & RATINGS
-- ==========================================
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  reviewer_id uuid references profiles(id) on delete cascade,
  reviewee_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  order_id uuid references orders(id) on delete set null,
  rating int check (rating between 1 and 5),
  title text,
  comment text,
  response text,
  created_at timestamptz default now(),
  unique(reviewer_id, order_id)
);

-- ==========================================
-- SAMPLE REQUESTS
-- ==========================================
create table if not exists sample_requests (
  id uuid primary key default uuid_generate_v4(),
  request_number text unique not null,
  retailer_id uuid references profiles(id) on delete cascade,
  manufacturer_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity int default 1,
  sample_price numeric default 0,
  shipping_charge numeric default 0,
  status text default 'pending',
  tracking_number text,
  courier text,
  notes text,
  created_at timestamptz default now()
);

-- ==========================================
-- REFERRALS
-- ==========================================
create table if not exists referrals (
  id uuid primary key default uuid_generate_v4(),
  referrer_id uuid references profiles(id) on delete cascade,
  referred_email text,
  referred_user_id uuid references profiles(id) on delete set null,
  status text default 'pending',
  reward_type text default 'boost_days',
  reward_value int default 7,
  created_at timestamptz default now(),
  completed_at timestamptz
);

do $$ begin
  alter table profiles add column if not exists referral_code text unique;
  alter table profiles add column if not exists referred_by uuid references profiles(id);
  alter table profiles add column if not exists boost_credits int default 0;
exception when others then null;
end $$;

-- ==========================================
-- DISPUTES
-- ==========================================
create table if not exists disputes (
  id uuid primary key default uuid_generate_v4(),
  dispute_number text unique not null,
  order_id uuid references orders(id) on delete set null,
  raised_by uuid references profiles(id) on delete cascade,
  against_id uuid references profiles(id) on delete cascade,
  category text,
  description text,
  evidence_urls text[] default '{}',
  status text default 'open',
  resolution text,
  resolved_by uuid references profiles(id),
  resolved_at timestamptz,
  created_at timestamptz default now()
);

-- ==========================================
-- TRUST SCORE function
-- ==========================================
create or replace function public.compute_trust_score(p_user_id uuid)
returns table (
  score int,
  response_rate numeric,
  avg_rating numeric,
  order_count int,
  verification_score int
)
language plpgsql stable as $$
declare
  v_orders int := 0;
  v_rating numeric := 0;
  v_verified int := 0;
  v_score int := 0;
begin
  select count(*) into v_orders from orders
    where manufacturer_id = p_user_id and status in ('delivered','completed');
  select coalesce(avg(rating), 0) into v_rating from reviews where reviewee_id = p_user_id;
  select (case when is_verified then 30 else 0 end)
       + (case when gst_verified then 20 else 0 end)
       + (case when pan_verified then 10 else 0 end)
       + (case when msme_verified then 10 else 0 end)
    into v_verified from profiles where id = p_user_id;
  v_score := least(100, coalesce(v_verified,0) + (v_orders * 2) + (v_rating::int * 5));
  return query select v_score, 100::numeric, v_rating, v_orders, coalesce(v_verified,0);
end; $$;

-- ==========================================
-- RLS
-- ==========================================
alter table orders enable row level security;
alter table order_status_history enable row level security;
alter table reviews enable row level security;
alter table sample_requests enable row level security;
alter table referrals enable row level security;
alter table disputes enable row level security;

drop policy if exists "orders_participants" on orders;
drop policy if exists "orders_insert" on orders;
drop policy if exists "order_history_read" on order_status_history;
drop policy if exists "reviews_read" on reviews;
drop policy if exists "reviews_write" on reviews;
drop policy if exists "samples_participants" on sample_requests;
drop policy if exists "referrals_owner" on referrals;
drop policy if exists "disputes_participants" on disputes;

create policy "orders_participants" on orders for select
  using (auth.uid() = retailer_id or auth.uid() = manufacturer_id or public.is_admin());
create policy "orders_insert" on orders for insert
  with check (auth.uid() = retailer_id);
create policy "orders_update" on orders for update
  using (auth.uid() = manufacturer_id or auth.uid() = retailer_id or public.is_admin());

create policy "order_history_read" on order_status_history for select using (true);
create policy "order_history_write" on order_status_history for insert with check (true);

create policy "reviews_read" on reviews for select using (true);
create policy "reviews_write" on reviews for insert with check (auth.uid() = reviewer_id);

create policy "samples_participants" on sample_requests for all
  using (auth.uid() = retailer_id or auth.uid() = manufacturer_id);

create policy "referrals_owner" on referrals for all using (auth.uid() = referrer_id);

create policy "disputes_participants" on disputes for all
  using (auth.uid() = raised_by or auth.uid() = against_id or public.is_admin());

-- Auto-generate order number
create or replace function public.gen_order_number()
returns trigger as $$
begin
  if new.order_number is null then
    new.order_number := 'RC-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random()*9999)::text, 4, '0');
  end if;
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_gen_order_number on orders;
create trigger trg_gen_order_number before insert on orders
for each row execute function public.gen_order_number();

create or replace function public.gen_sample_number()
returns trigger as $$
begin
  if new.request_number is null then
    new.request_number := 'SMP-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random()*999)::text, 3, '0');
  end if;
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_gen_sample_number on sample_requests;
create trigger trg_gen_sample_number before insert on sample_requests
for each row execute function public.gen_sample_number();

create or replace function public.gen_dispute_number()
returns trigger as $$
begin
  if new.dispute_number is null then
    new.dispute_number := 'DSP-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random()*999)::text, 3, '0');
  end if;
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_gen_dispute_number on disputes;
create trigger trg_gen_dispute_number before insert on disputes
for each row execute function public.gen_dispute_number();

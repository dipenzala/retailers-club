-- Follows
create table if not exists follows (
  id uuid primary key default uuid_generate_v4(),
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);
create index on follows(follower_id);
create index on follows(following_id);

-- Likes
create table if not exists likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);
create index on likes(product_id);
create index on likes(user_id);

-- Saves
create table if not exists saves (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);
create index on saves(product_id);
create index on saves(user_id);

-- RLS
alter table follows enable row level security;
alter table likes enable row level security;
alter table saves enable row level security;

create policy "follows_public_read" on follows for select using (true);
create policy "follows_self_write" on follows for all using (auth.uid() = follower_id);

create policy "likes_public_read" on likes for select using (true);
create policy "likes_self_write" on likes for all using (auth.uid() = user_id);

create policy "saves_public_read" on saves for select using (true);
create policy "saves_self_write" on saves for all using (auth.uid() = user_id);

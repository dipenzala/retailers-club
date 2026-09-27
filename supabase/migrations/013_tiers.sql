do $$ begin
  alter table profiles add column if not exists tier int default 0;
  alter table profiles add column if not exists response_time text default '< 1 hour';
  alter table profiles add column if not exists completion_rate int default 100;
  alter table profiles add column if not exists since_year int;
exception when others then null;
end $$;

-- Update tier based on verification
create or replace function public.update_tier()
returns trigger as $$
begin
  new.tier := 0;
  if new.is_verified then new.tier := 1; end if;
  if new.gst_verified then new.tier := 2; end if;
  if new.bank_name is not null and new.account_number is not null then new.tier := 3; end if;
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_update_tier on profiles;
create trigger trg_update_tier before update on profiles
for each row execute function public.update_tier();

-- Activity feed table
create table if not exists activity_feed (
  id uuid primary key default uuid_generate_v4(),
  kind text not null,
  message text not null,
  user_name text,
  city text,
  created_at timestamptz default now()
);

alter table activity_feed enable row level security;
drop policy if exists "activity_read" on activity_feed;
create policy "activity_read" on activity_feed for select using (true);

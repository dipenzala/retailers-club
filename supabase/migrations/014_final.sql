-- Language preference
do $$ begin
  alter table profiles add column if not exists language text default 'en';
  alter table profiles add column if not exists number_privacy text default 'public';
  alter table profiles add column if not exists number_request_message text;
exception when others then null;
end $$;

-- Number access requests (for "on request" privacy)
create table if not exists number_requests (
  id uuid primary key default uuid_generate_v4(),
  requester_id uuid references profiles(id) on delete cascade,
  owner_id uuid references profiles(id) on delete cascade,
  message text,
  status text default 'pending',
  created_at timestamptz default now(),
  responded_at timestamptz,
  unique(requester_id, owner_id)
);

alter table number_requests enable row level security;

drop policy if exists "requests_participants" on number_requests;
drop policy if exists "requests_insert" on number_requests;

create policy "requests_participants" on number_requests for select
  using (auth.uid() = requester_id or auth.uid() = owner_id);

create policy "requests_insert" on number_requests for insert
  with check (auth.uid() = requester_id);

create policy "requests_update" on number_requests for update
  using (auth.uid() = owner_id or auth.uid() = requester_id);

-- Message queue for offline reliability
create table if not exists message_queue (
  id uuid primary key default uuid_generate_v4(),
  client_id text unique not null,
  sender_id uuid references profiles(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete cascade,
  content text,
  kind text default 'text',
  attachment_url text,
  status text default 'pending',
  retry_count int default 0,
  created_at timestamptz default now(),
  sent_at timestamptz
);

alter table message_queue enable row level security;
drop policy if exists "queue_owner" on message_queue;
create policy "queue_owner" on message_queue for all using (auth.uid() = sender_id);

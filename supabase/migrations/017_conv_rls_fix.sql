-- Fix conversations RLS to allow INSERT properly
drop policy if exists "conv_participants" on conversations;
drop policy if exists "conv_insert" on conversations;
drop policy if exists "conv_select" on conversations;
drop policy if exists "conv_update" on conversations;

alter table conversations enable row level security;

-- SELECT: users see only their own
create policy "conv_select" on conversations
  for select using (auth.uid() = any(participants));

-- INSERT: user must be one of the participants
create policy "conv_insert" on conversations
  for insert with check (auth.uid() = any(participants));

-- UPDATE: participants can update
create policy "conv_update" on conversations
  for update using (auth.uid() = any(participants));

-- DELETE
drop policy if exists "conv_delete" on conversations;
create policy "conv_delete" on conversations
  for delete using (auth.uid() = any(participants));

-- Same fix for messages
drop policy if exists "msg_participants" on messages;
drop policy if exists "msg_insert" on messages;
drop policy if exists "msg_select" on messages;

alter table messages enable row level security;

create policy "msg_select" on messages
  for select using (
    conversation_id in (select id from conversations where auth.uid() = any(participants))
  );

create policy "msg_insert" on messages
  for insert with check (
    auth.uid() = sender_id
    and conversation_id in (select id from conversations where auth.uid() = any(participants))
  );

create policy "msg_update" on messages
  for update using (
    conversation_id in (select id from conversations where auth.uid() = any(participants))
  );

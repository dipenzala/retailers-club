do $$ begin
  alter table messages add column if not exists client_id text;
  create index if not exists idx_messages_client_id on messages(client_id);
exception when others then null;
end $$;

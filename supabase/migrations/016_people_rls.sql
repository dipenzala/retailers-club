-- Drop old restrictive policy
drop policy if exists "profiles_read" on profiles;
drop policy if exists "self_read" on profiles;
drop policy if exists "public_verified_read" on profiles;

-- Any authenticated user can read business profiles
-- Phone is protected separately via reveal API + privacy tiers
create policy "profiles_read_authenticated" on profiles
  for select using (auth.role() = 'authenticated');

-- Keep update restrictions
drop policy if exists "profiles_self_update" on profiles;
create policy "profiles_self_update" on profiles
  for update using (auth.uid() = id);

-- Run this if the main schema is already applied.
-- Then promote your account:
-- update public.profiles set is_admin = true where email = 'you@example.com';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

drop policy if exists "admins read every profile" on public.profiles;
create policy "admins read every profile" on public.profiles
  for select to authenticated using (public.is_admin());

drop policy if exists "admins read every card" on public.cards;
create policy "admins read every card" on public.cards
  for select to authenticated using (public.is_admin());

drop policy if exists "admins read every share" on public.card_shares;
create policy "admins read every share" on public.card_shares
  for select to authenticated using (public.is_admin());

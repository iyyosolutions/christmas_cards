-- Send A Wish schema. Run in the Supabase SQL editor.
-- Uses the anon key only. Do not put the service-role key in the app.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null default '',
  preview_image text,
  template_config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  template_id uuid not null references public.templates (id) on delete restrict,
  recipient_name text,
  sender_name text,
  message text not null,
  card_image_url text,
  share_token text not null unique,
  is_public boolean not null default true,
  design_options jsonb not null default '{}'::jsonb,
  owner_email text,
  created_at timestamptz not null default now()
);

create table if not exists public.card_shares (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards (id) on delete cascade,
  recipient_email text,
  sharing_method text not null,
  sent_at timestamptz not null default now(),
  delivery_status text not null default 'sent'
);

create index if not exists cards_user_id_idx on public.cards (user_id);
create index if not exists cards_owner_email_idx on public.cards (owner_email);
create index if not exists cards_created_at_idx on public.cards (user_id, created_at desc);
create index if not exists cards_share_token_idx on public.cards (share_token);
create index if not exists templates_active_idx on public.templates (is_active, category);
create index if not exists card_shares_card_idx on public.card_shares (card_id, sent_at desc);

alter table public.profiles enable row level security;
alter table public.templates enable row level security;
alter table public.cards enable row level security;
alter table public.card_shares enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create policy "admins read every profile" on public.profiles
  for select to authenticated using (public.is_admin());

create policy "admins read every card" on public.cards
  for select to authenticated using (public.is_admin());

create policy "admins read every share" on public.card_shares
  for select to authenticated using (public.is_admin());
create policy "update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

create policy "active templates are public" on public.templates
  for select using (is_active = true or exists (
    select 1 from public.profiles where id = auth.uid() and is_admin
  ));
create policy "admins insert templates" on public.templates
  for insert to authenticated with check (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin
  ));
create policy "admins update templates" on public.templates
  for update to authenticated using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin
  ));
create policy "admins delete templates" on public.templates
  for delete to authenticated using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin
  ));

create policy "owners manage cards" on public.cards
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "public cards are readable" on public.cards
  for select using (is_public = true);

create policy "owners read shares" on public.card_shares
  for select to authenticated using (exists (
    select 1 from public.cards where cards.id = card_id and cards.user_id = auth.uid()
  ));
create policy "owners record shares" on public.card_shares
  for insert to authenticated with check (exists (
    select 1 from public.cards where cards.id = card_id and cards.user_id = auth.uid()
  ));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('card-images', 'card-images', true), ('template-images', 'template-images', true)
on conflict (id) do nothing;

create policy "public card images" on storage.objects
  for select using (bucket_id in ('card-images', 'template-images'));
create policy "upload own card images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'card-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "admins upload template images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'template-images'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

-- Seed the twelve designed templates. template_config.design selects the artwork.
insert into public.templates (id, name, category, description, template_config, is_active) values
  ('a1111111-1111-4111-8111-111111111111', 'Holly Ribbon', 'Traditional Christmas', 'Red ribbon, green holly, and a wish written in ink.', '{"design":"holly-ribbon"}', true),
  ('a2222222-2222-4222-8222-222222222222', 'Victorian Post', 'Traditional Christmas', 'A cream envelope from a slower century.', '{"design":"victorian-post"}', true),
  ('a3333333-3333-4333-8333-333333333333', 'Ivory Type', 'Minimal Christmas', 'One line of type, and all the quiet around it.', '{"design":"ivory-type"}', true),
  ('a4444444-4444-4444-8444-444444444444', 'Pine Line', 'Minimal Christmas', 'A single spruce, drawn with almost nothing.', '{"design":"pine-line"}', true),
  ('a5555555-5555-4555-8555-555555555555', 'Colour Block', 'Modern Christmas', 'Berry, pine, and gold in clean blocks.', '{"design":"colour-block"}', true),
  ('a6666666-6666-4666-8666-666666666666', 'Glass Ornament', 'Modern Christmas', 'A bauble caught in winter light.', '{"design":"glass-ornament"}', true),
  ('a7777777-7777-4777-8777-777777777777', 'Cocoa Mug', 'Cute & Cartoon', 'Marshmallows, mittens, and a very round hello.', '{"design":"cocoa-mug"}', true),
  ('a8888888-8888-4888-8888-888888888888', 'Robin Round', 'Cute & Cartoon', 'A small robin who has claimed the greeting.', '{"design":"robin-round"}', true),
  ('a9999999-9999-4999-8999-999999999999', 'Bethlehem Star', 'Religious Christmas', 'A bright star over a still, humble night.', '{"design":"bethlehem-star"}', true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Midnight Gold', 'Elegant Christmas', 'A quiet night, lettered in gold.', '{"design":"midnight-gold"}', true),
  ('abbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Family Table', 'Family Christmas', 'Extra chairs, one more place, everyone home.', '{"design":"family-table"}', true),
  ('accccccc-cccc-4ccc-8ccc-cccccccccccc', 'Nice List, Barely', 'Funny Christmas', 'Official notice: you made the list. Mostly.', '{"design":"nice-list"}', true)
on conflict (id) do nothing;

-- After you create your account, promote it:
-- update public.profiles set is_admin = true where email = 'you@example.com';

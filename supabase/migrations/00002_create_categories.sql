create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  color text not null default '#6B7280',
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

create policy "Categories are viewable by authenticated users"
  on categories for select to authenticated using (true);

create policy "Admins can insert categories"
  on categories for insert to authenticated
  with check (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'owner'))
  );

create policy "Admins can update categories"
  on categories for update to authenticated
  using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'owner'))
  );

create policy "Admins can delete categories"
  on categories for delete to authenticated
  using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'owner'))
  );

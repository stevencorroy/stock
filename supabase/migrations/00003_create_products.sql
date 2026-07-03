create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  sku text unique,
  barcode text unique,
  category_id uuid references categories(id) on delete set null,
  unit text not null default 'unit',
  quantity integer not null default 0 check (quantity >= 0),
  low_stock_threshold integer not null default 10,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on products(category_id);
create index idx_products_quantity on products(quantity);
create index idx_products_sku on products(sku) where sku is not null;

create trigger set_updated_at before update on products
  for each row execute function update_updated_at();

alter table products enable row level security;

create policy "Products are viewable by authenticated users"
  on products for select to authenticated using (true);

create policy "Authenticated users can insert products"
  on products for insert to authenticated with check (true);

create policy "Authenticated users can update products"
  on products for update to authenticated using (true);

create policy "Admins can delete products"
  on products for delete to authenticated
  using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'owner'))
  );

create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  type text not null check (type in ('in', 'out', 'adjustment', 'initial')),
  quantity integer not null check (quantity > 0),
  quantity_before integer not null,
  quantity_after integer not null,
  reason text,
  performed_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create index idx_stock_movements_product on stock_movements(product_id, created_at desc);
create index idx_stock_movements_created on stock_movements(created_at desc);

alter table stock_movements enable row level security;

create policy "Movements are viewable by authenticated users"
  on stock_movements for select to authenticated using (true);

create policy "Movements created via function"
  on stock_movements for insert to authenticated
  with check (performed_by = auth.uid());

create or replace function perform_stock_movement(
  p_product_id uuid,
  p_type text,
  p_quantity integer,
  p_reason text default null
)
returns stock_movements
language plpgsql
security definer
as $$
declare
  v_current_qty integer;
  v_new_qty integer;
  v_movement stock_movements;
begin
  select quantity into v_current_qty
  from products where id = p_product_id
  for update;

  if not found then
    raise exception 'Product not found';
  end if;

  if p_type = 'in' or p_type = 'initial' then
    v_new_qty := v_current_qty + p_quantity;
  elsif p_type in ('out', 'adjustment') then
    v_new_qty := v_current_qty - p_quantity;
    if v_new_qty < 0 then
      raise exception 'Insufficient stock. Current: %, Requested: %', v_current_qty, p_quantity;
    end if;
  else
    raise exception 'Invalid movement type: %', p_type;
  end if;

  update products set quantity = v_new_qty, updated_at = now()
  where id = p_product_id;

  insert into stock_movements (product_id, type, quantity, quantity_before, quantity_after, reason, performed_by)
  values (p_product_id, p_type, p_quantity, v_current_qty, v_new_qty, p_reason, auth.uid())
  returning * into v_movement;

  return v_movement;
end;
$$;

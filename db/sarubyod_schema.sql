-- Consignment bill storage. Accessed only via the Supabase secret key
-- (service_role) from the server. RLS is enabled with no policies, so the
-- Data API denies anon/authenticated while service_role bypasses RLS.

create table if not exists public.sarubyod_bills (
  id uuid primary key default gen_random_uuid(),
  bill_no text not null,
  bill_date date not null,
  shop_name text not null,
  consignor text not null default '',
  receiver text not null default '',
  phone text not null default '',
  commission numeric not null default 0,
  note text not null default '',
  total_amount numeric not null default 0,
  net_transfer numeric not null default 0,
  created_by text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.sarubyod_bill_items (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.sarubyod_bills(id) on delete cascade,
  seq int not null,
  name text not null,
  base_price numeric not null default 0,
  sale_price numeric not null default 0,
  qty int not null default 0
);

create index if not exists sarubyod_bills_bill_date_idx
  on public.sarubyod_bills (bill_date);
create index if not exists sarubyod_bill_items_bill_id_idx
  on public.sarubyod_bill_items (bill_id);

alter table public.sarubyod_bills enable row level security;
alter table public.sarubyod_bill_items enable row level security;

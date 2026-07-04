-- Sarubyod consignment schema. All tables are accessed only via the Supabase
-- secret key (service_role) from the server. RLS is enabled with no policies,
-- so the Data API denies anon/authenticated while service_role bypasses RLS.

-- ── Stock (managed by admin) ────────────────────────────────────────────────
-- A stock lot is one shipment/round from a consignor.
create table if not exists public.sarubyod_stock_lots (
  id uuid primary key default gen_random_uuid(),
  name text not null,                          -- label, e.g. "Lot 2 กค 69"
  lot_date date,                               -- วันที่ส่ง (optional)
  consignor text not null default 'twentytoys',
  note text not null default '',
  is_active boolean not null default true,     -- inactive lots hidden from storefront
  created_at timestamptz not null default now()
);

-- Products inside a lot. base_price = amount owed to consignor per piece.
-- profit_ceiling = max markup (baht) storefront may add per piece.
-- qty_sent is a reference only; stock is NOT decremented on sale.
create table if not exists public.sarubyod_stock_items (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.sarubyod_stock_lots(id) on delete cascade,
  name text not null,
  base_price numeric not null default 0,
  profit_ceiling numeric not null default 0,
  qty_sent int,
  created_at timestamptz not null default now()
);

create index if not exists sarubyod_stock_items_lot_id_idx
  on public.sarubyod_stock_items (lot_id);

-- ── Bills (created by storefront) ───────────────────────────────────────────
create table if not exists public.sarubyod_bills (
  id uuid primary key default gen_random_uuid(),
  bill_no text not null,
  bill_date date not null,
  shop_name text not null,
  consignor text not null default '',
  receiver text not null default '',
  phone text not null default '',
  commission numeric not null default 0,       -- total_amount - net_transfer
  note text not null default '',
  total_amount numeric not null default 0,     -- sum(sale_price * qty)
  net_transfer numeric not null default 0,     -- sum(base_price * qty)
  created_by text not null default '',
  created_at timestamptz not null default now()
);

-- Each line snapshots name/base/sale/qty and references the stock item it came
-- from (nullable: on stock deletion the reference is cleared, snapshot stays).
create table if not exists public.sarubyod_bill_items (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.sarubyod_bills(id) on delete cascade,
  stock_item_id uuid references public.sarubyod_stock_items(id) on delete set null,
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

alter table public.sarubyod_stock_lots enable row level security;
alter table public.sarubyod_stock_items enable row level security;
alter table public.sarubyod_bills enable row level security;
alter table public.sarubyod_bill_items enable row level security;

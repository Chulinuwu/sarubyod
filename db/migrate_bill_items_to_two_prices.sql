-- Migrate sarubyod_bill_items from the old single-price schema
-- (unit_price/line_total) to the two-price + stock-reference schema.
-- Safe to run on an existing table; no data is expected yet.

alter table public.sarubyod_bill_items
  add column if not exists stock_item_id uuid
    references public.sarubyod_stock_items(id) on delete set null,
  add column if not exists base_price numeric not null default 0,
  add column if not exists sale_price numeric not null default 0,
  drop column if exists unit_price,
  drop column if exists line_total;

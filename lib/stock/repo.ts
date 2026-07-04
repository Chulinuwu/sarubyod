import "server-only";
import {
  getServiceClient,
  STOCK_LOTS_TABLE,
  STOCK_ITEMS_TABLE,
} from "@/lib/supabase/server";
import type { StockLotParsed, StockItemParsed } from "./schema";
import type {
  StockLot,
  StockItem,
  StockLotSummary,
  StockLotWithItems,
  StockOption,
} from "./types";

type LotRow = {
  id: string;
  name: string;
  lot_date: string | null;
  consignor: string;
  note: string;
  is_active: boolean;
  created_at: string;
};

type ItemRow = {
  id: string;
  lot_id: string;
  name: string;
  base_price: number | string;
  profit_ceiling: number | string;
  qty_sent: number | null;
  created_at: string;
};

function toLot(r: LotRow): StockLot {
  return {
    id: r.id,
    name: r.name,
    lotDate: r.lot_date,
    consignor: r.consignor,
    note: r.note,
    isActive: r.is_active,
    createdAt: r.created_at,
  };
}

function toItem(r: ItemRow): StockItem {
  return {
    id: r.id,
    lotId: r.lot_id,
    name: r.name,
    basePrice: Number(r.base_price),
    profitCeiling: Number(r.profit_ceiling),
    qtySent: r.qty_sent,
    createdAt: r.created_at,
  };
}

function lotInsert(input: StockLotParsed) {
  return {
    name: input.name,
    lot_date: input.lotDate,
    consignor: input.consignor,
    note: input.note,
    is_active: input.isActive,
  };
}

function itemInsert(input: StockItemParsed) {
  return {
    name: input.name,
    base_price: input.basePrice,
    profit_ceiling: input.profitCeiling,
    qty_sent: input.qtySent,
  };
}

function client() {
  const supabase = getServiceClient();
  if (!supabase) throw new Error("supabase_not_configured");
  return supabase;
}

export async function listActiveStockOptions(): Promise<StockOption[]> {
  const supabase = getServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(STOCK_ITEMS_TABLE)
    .select("id,name,base_price,profit_ceiling,lot:sarubyod_stock_lots!inner(name,is_active)")
    .eq("lot.is_active", true)
    .order("name", { ascending: true });
  if (error) throw error;
  type Row = {
    id: string;
    name: string;
    base_price: number | string;
    profit_ceiling: number | string;
    lot: { name: string } | { name: string }[];
  };
  return (data as Row[] | null ?? []).map((r) => {
    const lot = Array.isArray(r.lot) ? r.lot[0] : r.lot;
    return {
      id: r.id,
      name: r.name,
      basePrice: Number(r.base_price),
      profitCeiling: Number(r.profit_ceiling),
      lotName: lot?.name ?? "",
    };
  });
}

export async function listActiveLotsWithItems(): Promise<StockLotWithItems[]> {
  const supabase = getServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(STOCK_LOTS_TABLE)
    .select("*, items:sarubyod_stock_items(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  type Row = LotRow & { items: ItemRow[] };
  return (data as Row[] | null ?? []).map((r) => ({
    ...toLot(r),
    items: (r.items ?? [])
      .map(toItem)
      .sort((a, b) => a.name.localeCompare(b.name, "th")),
  }));
}

export async function listLots(): Promise<StockLotSummary[]> {
  const supabase = getServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(STOCK_LOTS_TABLE)
    .select("*, sarubyod_stock_items(count)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  type Row = LotRow & { sarubyod_stock_items: { count: number }[] };
  return (data as Row[] | null ?? []).map((r) => ({
    ...toLot(r),
    itemCount: r.sarubyod_stock_items?.[0]?.count ?? 0,
  }));
}

export async function getLotWithItems(
  id: string,
): Promise<StockLotWithItems | null> {
  const supabase = getServiceClient();
  if (!supabase) return null;
  const { data: lot, error } = await supabase
    .from(STOCK_LOTS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!lot) return null;
  const { data: items, error: itemsErr } = await supabase
    .from(STOCK_ITEMS_TABLE)
    .select("*")
    .eq("lot_id", id)
    .order("created_at", { ascending: true });
  if (itemsErr) throw itemsErr;
  return {
    ...toLot(lot as LotRow),
    items: (items as ItemRow[] | null ?? []).map(toItem),
  };
}

export async function createLot(input: StockLotParsed): Promise<StockLot> {
  const { data, error } = await client()
    .from(STOCK_LOTS_TABLE)
    .insert(lotInsert(input))
    .select("*")
    .single();
  if (error) throw error;
  return toLot(data as LotRow);
}

export async function updateLot(
  id: string,
  input: StockLotParsed,
): Promise<void> {
  const { error } = await client()
    .from(STOCK_LOTS_TABLE)
    .update(lotInsert(input))
    .eq("id", id);
  if (error) throw error;
}

export async function deleteLot(id: string): Promise<void> {
  const { error } = await client().from(STOCK_LOTS_TABLE).delete().eq("id", id);
  if (error) throw error;
}

export async function addItem(
  lotId: string,
  input: StockItemParsed,
): Promise<StockItem> {
  const { data, error } = await client()
    .from(STOCK_ITEMS_TABLE)
    .insert({ lot_id: lotId, ...itemInsert(input) })
    .select("*")
    .single();
  if (error) throw error;
  return toItem(data as ItemRow);
}

export async function updateItem(
  id: string,
  input: StockItemParsed,
): Promise<void> {
  const { error } = await client()
    .from(STOCK_ITEMS_TABLE)
    .update(itemInsert(input))
    .eq("id", id);
  if (error) throw error;
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await client().from(STOCK_ITEMS_TABLE).delete().eq("id", id);
  if (error) throw error;
}

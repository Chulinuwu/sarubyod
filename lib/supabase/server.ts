import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const BILLS_TABLE = "sarubyod_bills";
export const BILL_ITEMS_TABLE = "sarubyod_bill_items";
export const STOCK_LOTS_TABLE = "sarubyod_stock_lots";
export const STOCK_ITEMS_TABLE = "sarubyod_stock_items";

export function getServiceClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

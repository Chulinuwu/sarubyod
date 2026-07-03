import "server-only";
import {
  getServiceClient,
  BILLS_TABLE,
  BILL_ITEMS_TABLE,
} from "@/lib/supabase/server";
import { computeBill } from "./calc";
import type { BillSummary, BillRecord } from "./types";

type BillRow = {
  id: string;
  bill_no: string;
  bill_date: string;
  shop_name: string;
  consignor: string;
  receiver: string;
  phone: string;
  commission: number | string;
  note: string;
  total_amount: number | string;
  net_transfer: number | string;
  created_by: string;
  created_at: string;
};

type ItemRow = {
  name: string;
  base_price: number | string;
  sale_price: number | string;
  qty: number | string;
};

const SUMMARY_COLS =
  "id,bill_no,bill_date,shop_name,consignor,commission,total_amount,net_transfer,created_by,created_at";

function toSummary(r: BillRow): BillSummary {
  return {
    id: r.id,
    billNo: r.bill_no,
    billDate: r.bill_date,
    shopName: r.shop_name,
    consignor: r.consignor,
    commission: Number(r.commission),
    totalAmount: Number(r.total_amount),
    netTransfer: Number(r.net_transfer),
    createdBy: r.created_by,
    createdAt: r.created_at,
  };
}

function monthBounds(year: number, month1: number): { start: string; end: string } {
  const mm = String(month1).padStart(2, "0");
  const nextYear = month1 === 12 ? year + 1 : year;
  const nextMonth = month1 === 12 ? 1 : month1 + 1;
  const nmm = String(nextMonth).padStart(2, "0");
  return { start: `${year}-${mm}-01`, end: `${nextYear}-${nmm}-01` };
}

export async function listBillsInMonth(
  year: number,
  month1: number,
): Promise<BillSummary[]> {
  const supabase = getServiceClient();
  if (!supabase) return [];
  const { start, end } = monthBounds(year, month1);
  const { data, error } = await supabase
    .from(BILLS_TABLE)
    .select(SUMMARY_COLS)
    .gte("bill_date", start)
    .lt("bill_date", end)
    .order("bill_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as BillRow[] | null)?.map(toSummary) ?? [];
}

export async function getBill(id: string): Promise<BillRecord | null> {
  const supabase = getServiceClient();
  if (!supabase) return null;

  const { data: bill, error } = await supabase
    .from(BILLS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!bill) return null;

  const { data: items, error: itemsErr } = await supabase
    .from(BILL_ITEMS_TABLE)
    .select("name,base_price,sale_price,qty")
    .eq("bill_id", id)
    .order("seq", { ascending: true });
  if (itemsErr) throw itemsErr;

  const row = bill as BillRow;
  const computed = computeBill({
    billDate: row.bill_date,
    billNo: row.bill_no,
    shopName: row.shop_name,
    consignor: row.consignor,
    receiver: row.receiver,
    phone: row.phone,
    note: row.note,
    items: (items as ItemRow[] | null ?? []).map((it) => ({
      name: it.name,
      basePrice: Number(it.base_price),
      salePrice: Number(it.sale_price),
      qty: Number(it.qty),
    })),
  });

  return {
    ...computed,
    id: row.id,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

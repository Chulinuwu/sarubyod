import "server-only";
import {
  getServiceClient,
  BILLS_TABLE,
  BILL_ITEMS_TABLE,
} from "@/lib/supabase/server";
import { computeBill } from "./calc";
import type { BillSummary, BillRecord, BillInput } from "./types";

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
  stock_item_id: string | null;
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
    .select("stock_item_id,name,base_price,sale_price,qty")
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
      stockItemId: it.stock_item_id,
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

export async function updateBill(id: string, input: BillInput): Promise<void> {
  const supabase = getServiceClient();
  if (!supabase) throw new Error("supabase_not_configured");
  const bill = computeBill(input);

  const { error: upErr } = await supabase
    .from(BILLS_TABLE)
    .update({
      bill_no: bill.billNo,
      bill_date: bill.billDate,
      shop_name: bill.shopName,
      consignor: bill.consignor,
      receiver: bill.receiver,
      phone: bill.phone,
      commission: bill.commission,
      note: bill.note,
      total_amount: bill.totalAmount,
      net_transfer: bill.netTransfer,
    })
    .eq("id", id);
  if (upErr) throw upErr;

  const { error: delErr } = await supabase
    .from(BILL_ITEMS_TABLE)
    .delete()
    .eq("bill_id", id);
  if (delErr) throw delErr;

  const rows = bill.items.map((it) => ({
    bill_id: id,
    stock_item_id: it.stockItemId,
    seq: it.seq,
    name: it.name,
    base_price: it.basePrice,
    sale_price: it.salePrice,
    qty: it.qty,
  }));
  const { error: insErr } = await supabase.from(BILL_ITEMS_TABLE).insert(rows);
  if (insErr) throw insErr;
}

export async function deleteBill(id: string): Promise<void> {
  const supabase = getServiceClient();
  if (!supabase) throw new Error("supabase_not_configured");
  const { error } = await supabase.from(BILLS_TABLE).delete().eq("id", id);
  if (error) throw error;
}

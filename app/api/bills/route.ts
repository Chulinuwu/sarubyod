import { getSession } from "@/lib/auth/current";
import { getProfile } from "@/lib/auth/profiles";
import { billInputSchema } from "@/lib/bill/schema";
import { computeBill } from "@/lib/bill/calc";
import {
  getServiceClient,
  BILLS_TABLE,
  BILL_ITEMS_TABLE,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

  const parsed = billInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return Response.json(
      { error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  const bill = computeBill(parsed.data);

  const { data: inserted, error: billErr } = await supabase
    .from(BILLS_TABLE)
    .insert({
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
      created_by: getProfile(session.role)?.displayName ?? session.username,
    })
    .select("id")
    .single();

  if (billErr || !inserted) {
    return Response.json(
      { error: "db_bill", detail: billErr?.message },
      { status: 500 },
    );
  }

  const rows = bill.items.map((it) => ({
    bill_id: inserted.id,
    stock_item_id: it.stockItemId,
    seq: it.seq,
    name: it.name,
    base_price: it.basePrice,
    sale_price: it.salePrice,
    qty: it.qty,
  }));

  const { error: itemsErr } = await supabase
    .from(BILL_ITEMS_TABLE)
    .insert(rows);

  if (itemsErr) {
    await supabase.from(BILLS_TABLE).delete().eq("id", inserted.id);
    return Response.json(
      { error: "db_items", detail: itemsErr.message },
      { status: 500 },
    );
  }

  return Response.json({ id: inserted.id });
}

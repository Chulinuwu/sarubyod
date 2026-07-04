import type {
  StockLotForm,
  StockItemForm,
  StockLot,
  StockItem,
  StockLotWithItems,
} from "@/lib/stock/types";

async function req<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}) as Record<string, unknown>);
  if (!res.ok) {
    const key = typeof data.error === "string" ? data.error : "";
    throw new Error(key || "request_failed");
  }
  return data as T;
}

export const fetchLot = (id: string) =>
  req<{ lot: StockLotWithItems }>(`/api/admin/lots/${id}`, "GET").then(
    (d) => d.lot,
  );

export const createLot = (input: StockLotForm) =>
  req<{ lot: StockLot }>("/api/admin/lots", "POST", input).then((d) => d.lot);

export const updateLot = (id: string, input: StockLotForm) =>
  req<{ ok: true }>(`/api/admin/lots/${id}`, "PATCH", input);

export const deleteLot = (id: string) =>
  req<{ ok: true }>(`/api/admin/lots/${id}`, "DELETE");

export const addItem = (lotId: string, input: StockItemForm) =>
  req<{ item: StockItem }>(`/api/admin/lots/${lotId}/items`, "POST", input).then(
    (d) => d.item,
  );

export const updateItem = (id: string, input: StockItemForm) =>
  req<{ ok: true }>(`/api/admin/items/${id}`, "PATCH", input);

export const deleteItem = (id: string) =>
  req<{ ok: true }>(`/api/admin/items/${id}`, "DELETE");

export const ADMIN_ERRORS: Record<string, string> = {
  supabase_not_configured: "ยังไม่ได้สร้างตาราง sarubyod ใน Supabase",
  forbidden: "ต้องเข้าสู่ระบบด้วยสิทธิ admin",
  request_failed: "ทำรายการไม่สำเร็จ",
};

export function adminErrorText(e: unknown): string {
  const key = e instanceof Error ? e.message : "";
  return ADMIN_ERRORS[key] ?? ADMIN_ERRORS.request_failed;
}

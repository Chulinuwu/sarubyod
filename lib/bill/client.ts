import type { BillInput } from "./types";

async function postJson(url: string, body: unknown): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function exportBillPdf(input: BillInput): Promise<void> {
  const res = await postJson("/api/pdf", input);
  if (!res.ok) throw new Error("สร้าง PDF ไม่สำเร็จ");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${input.billNo || "bill"}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const SAVE_ERRORS: Record<string, string> = {
  supabase_not_configured: "ยังไม่ได้ตั้งค่า Supabase ใน .env.local",
  unauthorized: "หมดเวลาเซสชัน กรุณาเข้าสู่ระบบใหม่",
};

export type SaveResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function saveBill(input: BillInput): Promise<SaveResult> {
  const res = await postJson("/api/bills", input);
  const data = await res.json().catch(() => ({}) as Record<string, unknown>);
  if (res.ok && typeof data.id === "string") return { ok: true, id: data.id };
  const key = typeof data.error === "string" ? data.error : "";
  return { ok: false, error: SAVE_ERRORS[key] ?? "บันทึกไม่สำเร็จ" };
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBill } from "@/lib/bill/client";

export function DeleteBillButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (!window.confirm("ลบบิลนี้ถาวร ยืนยันไหม?")) return;
    setBusy(true);
    const result = await deleteBill(id);
    if (result.ok) {
      router.push("/storefront/bills");
      router.refresh();
    } else {
      window.alert(result.error ?? "ลบไม่สำเร็จ");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="rounded-lg border border-danger/40 px-3.5 py-1.5 text-sm font-semibold text-danger transition-colors hover:bg-danger-soft disabled:opacity-50"
    >
      {busy ? "กำลังลบ..." : "ลบบิล"}
    </button>
  );
}

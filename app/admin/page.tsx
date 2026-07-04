import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/current";
import { getProfile } from "@/lib/auth/profiles";
import { listLots } from "@/lib/stock/repo";
import type { StockLotSummary } from "@/lib/stock/types";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminStockClient } from "@/components/admin/AdminStockClient";

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const displayName = getProfile(session.role)?.displayName ?? session.username;

  let lots: StockLotSummary[] = [];
  let loadError = false;
  try {
    lots = await listLots();
  } catch {
    loadError = true;
  }

  return (
    <div className="flex min-h-full flex-col">
      <AdminTopBar displayName={displayName} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-5">
        {loadError ? (
          <div className="rounded-lg border border-danger/25 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            โหลดข้อมูลไม่สำเร็จ ตรวจสอบว่าได้สร้างตาราง sarubyod แล้ว
          </div>
        ) : (
          <AdminStockClient initialLots={lots} />
        )}
      </main>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/current";
import { getProfile } from "@/lib/auth/profiles";
import { listActiveLotsWithItems } from "@/lib/stock/repo";
import type { StockLotWithItems } from "@/lib/stock/types";
import { TopBar } from "@/components/bill/TopBar";
import { StockBrowser } from "@/components/stock/StockBrowser";

export default async function StockViewPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const displayName = getProfile(session.role)?.displayName ?? session.username;

  let lots: StockLotWithItems[] = [];
  let loadError = false;
  try {
    lots = await listActiveLotsWithItems();
  } catch {
    loadError = true;
  }

  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        displayName={displayName}
        active="stock"
        isAdmin={session.role === "admin"}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5">
        {loadError ? (
          <div className="rounded-lg border border-danger/25 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            โหลดข้อมูลไม่สำเร็จ
          </div>
        ) : (
          <StockBrowser lots={lots} />
        )}
      </main>
    </div>
  );
}

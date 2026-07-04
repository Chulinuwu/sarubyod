import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/current";
import { getProfile } from "@/lib/auth/profiles";
import { listBillsInMonth } from "@/lib/bill/repo";
import type { BillSummary } from "@/lib/bill/types";
import { TopBar } from "@/components/bill/TopBar";
import { BillsHistory } from "@/components/bill/history/BillsHistory";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function parseMonth(raw: string | undefined): { year: number; month1: number } {
  const now = new Date();
  const m = raw?.match(/^(\d{4})-(\d{2})$/);
  if (m) {
    const month1 = Number(m[2]);
    if (month1 >= 1 && month1 <= 12) return { year: Number(m[1]), month1 };
  }
  return { year: now.getFullYear(), month1: now.getMonth() + 1 };
}

export default async function BillsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const displayName = getProfile(session.role)?.displayName ?? session.username;
  const { year, month1 } = parseMonth((await searchParams).month);
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  let bills: BillSummary[] = [];
  let loadError = false;
  try {
    bills = await listBillsInMonth(year, month1);
  } catch {
    loadError = true;
  }

  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        displayName={displayName}
        active="history"
        isAdmin={session.role === "admin"}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5">
        {loadError ? (
          <div className="rounded-lg border border-danger/25 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            โหลดข้อมูลไม่สำเร็จ ตรวจสอบว่าได้สร้างตาราง sarubyod แล้ว
          </div>
        ) : (
          <BillsHistory
            year={year}
            month1={month1}
            today={today}
            bills={bills}
          />
        )}
      </main>
    </div>
  );
}

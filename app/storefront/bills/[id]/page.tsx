import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/current";
import { getProfile } from "@/lib/auth/profiles";
import { getBill } from "@/lib/bill/repo";
import type { BillRecord } from "@/lib/bill/types";
import { TopBar } from "@/components/bill/TopBar";
import { BillPreview } from "@/components/bill/BillPreview";
import { DeleteBillButton } from "@/components/bill/DeleteBillButton";

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const displayName = getProfile(session.role)?.displayName ?? session.username;
  const { id } = await params;

  let bill: BillRecord | null = null;
  let loadError = false;
  try {
    bill = await getBill(id);
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
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/storefront/bills"
            className="text-sm font-semibold text-brand hover:underline"
          >
            กลับไปรายการ
          </Link>
          {bill ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/storefront/bills/${bill.id}/edit`}
                className="rounded-lg border border-brand-border px-3.5 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
              >
                แก้ไข
              </Link>
              <a
                href={`/api/bills/${bill.id}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line px-3.5 py-1.5 text-sm font-semibold text-body transition-colors hover:bg-subtle hover:text-ink"
              >
                โหลด PDF
              </a>
              <DeleteBillButton id={bill.id} />
            </div>
          ) : null}
        </div>

        {loadError ? (
          <div className="rounded-lg border border-danger/25 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            โหลดข้อมูลไม่สำเร็จ
          </div>
        ) : !bill ? (
          <div className="rounded-lg border border-line px-4 py-10 text-center text-sm text-muted">
            ไม่พบบิลนี้
          </div>
        ) : (
          <>
            <BillPreview bill={bill} />
            <p className="mt-3 text-xs text-muted">จัดทำโดย {bill.createdBy}</p>
          </>
        )}
      </main>
    </div>
  );
}

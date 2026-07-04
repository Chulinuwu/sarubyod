import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/current";
import { getProfile } from "@/lib/auth/profiles";
import { getBill } from "@/lib/bill/repo";
import type { BillInput } from "@/lib/bill/types";
import { TopBar } from "@/components/bill/TopBar";
import { EditBillClient } from "@/components/bill/edit/EditBillClient";

export default async function EditBillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const displayName = getProfile(session.role)?.displayName ?? session.username;
  const { id } = await params;
  const bill = await getBill(id).catch(() => null);

  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        displayName={displayName}
        active="history"
        isAdmin={session.role === "admin"}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5">
        <div className="mb-4">
          <Link
            href={`/storefront/bills/${id}`}
            className="text-sm font-semibold text-brand hover:underline"
          >
            กลับไปดูบิล
          </Link>
        </div>
        {!bill ? (
          <div className="rounded-lg border border-line px-4 py-10 text-center text-sm text-muted">
            ไม่พบบิลนี้
          </div>
        ) : (
          <EditBillClient
            billId={id}
            initial={
              {
                billDate: bill.billDate,
                billNo: bill.billNo,
                shopName: bill.shopName,
                consignor: bill.consignor,
                receiver: bill.receiver,
                phone: bill.phone,
                note: bill.note,
                items: bill.items.map((it) => ({
                  stockItemId: it.stockItemId,
                  name: it.name,
                  basePrice: it.basePrice,
                  salePrice: it.salePrice,
                  qty: it.qty,
                })),
              } satisfies BillInput
            }
          />
        )}
      </main>
    </div>
  );
}

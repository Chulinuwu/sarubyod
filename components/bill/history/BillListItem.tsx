import Link from "next/link";
import type { BillSummary } from "@/lib/bill/types";
import { formatThaiDate, formatMoney } from "@/lib/bill/format";

export function BillListItem({ bill }: { bill: BillSummary }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <Link
        href={`/storefront/bills/${bill.id}`}
        className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-lg px-1 py-1 transition-colors hover:bg-subtle"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{bill.billNo}</p>
          <p className="truncate text-xs text-body">
            {bill.shopName}
            {bill.consignor ? ` · ${bill.consignor}` : ""} ·{" "}
            {formatThaiDate(bill.billDate)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="tnum text-sm font-bold text-ink">
            ฿ {formatMoney(bill.netTransfer)}
          </p>
          <p className="text-[10px] text-muted">สุทธิ</p>
        </div>
      </Link>
      <a
        href={`/api/bills/${bill.id}/pdf`}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand-soft"
      >
        PDF
      </a>
    </div>
  );
}

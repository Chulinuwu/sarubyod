import type { BillComputed } from "@/lib/bill/types";
import { TH } from "@/lib/bill/constants";
import { formatMoney } from "@/lib/bill/format";

const label = "w-40 shrink-0 border-r border-line-strong px-2.5 py-2 text-body";
const value = "flex-1 px-2.5 py-2 text-ink";

function SummaryRow({
  name,
  children,
  top,
}: {
  name: string;
  children: React.ReactNode;
  top?: boolean;
}) {
  return (
    <div className={`flex ${top ? "border-t border-line-strong" : ""}`}>
      <div className={label}>{name}</div>
      <div className={value}>{children}</div>
    </div>
  );
}

export function PreviewSummary({ bill }: { bill: BillComputed }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line-strong text-xs">
      <div className="border-b border-line-strong bg-paper-head px-2.5 py-2 text-center font-bold text-label">
        {TH.summary}
      </div>
      <SummaryRow name={TH.totalSales}>
        <span className="tnum font-semibold">{formatMoney(bill.totalAmount)}</span>
      </SummaryRow>
      <SummaryRow name={TH.commission} top>
        <span className="tnum">
          {TH.baht} {formatMoney(bill.commission)}
        </span>
      </SummaryRow>
      <SummaryRow name={TH.netTransfer} top>
        <span className="tnum font-bold text-brand">
          {TH.baht} {formatMoney(bill.netTransfer)}
        </span>
      </SummaryRow>
      <SummaryRow name={TH.note} top>
        <span className="text-danger">{bill.note}</span>
      </SummaryRow>
    </div>
  );
}

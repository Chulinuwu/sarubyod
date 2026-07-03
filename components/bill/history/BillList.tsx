import type { BillSummary } from "@/lib/bill/types";
import { formatThaiDate } from "@/lib/bill/format";
import { BillListItem } from "./BillListItem";

type Props = {
  bills: BillSummary[];
  emptyText: string;
};

export function BillList({ bills, emptyText }: Props) {
  if (bills.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted">{emptyText}</div>
    );
  }

  const groups = new Map<string, BillSummary[]>();
  for (const bill of bills) {
    const list = groups.get(bill.billDate);
    if (list) list.push(bill);
    else groups.set(bill.billDate, [bill]);
  }

  return (
    <div className="flex flex-col gap-5">
      {[...groups.entries()].map(([date, dayBills]) => (
        <div key={date}>
          <p className="mb-1 text-xs font-semibold text-muted">
            {formatThaiDate(date)}
          </p>
          <div className="divide-y divide-line">
            {dayBills.map((bill) => (
              <BillListItem key={bill.id} bill={bill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

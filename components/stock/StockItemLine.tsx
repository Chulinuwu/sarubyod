import type { StockItem } from "@/lib/stock/types";
import { formatMoney } from "@/lib/bill/format";

export function StockItemLine({ item }: { item: StockItem }) {
  const maxSale = item.basePrice + item.profitCeiling;
  return (
    <div className="border-t border-line py-2.5 first:border-t-0">
      <p className="text-sm font-medium text-ink">{item.name}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="text-muted">
          ฐาน <span className="tnum font-semibold text-body">฿{formatMoney(item.basePrice)}</span>
        </span>
        <span className="text-muted">
          เพดาน <span className="tnum font-semibold text-body">+฿{formatMoney(item.profitCeiling)}</span>
        </span>
        <span className="tnum font-semibold text-brand">
          ขายได้ถึง ฿{formatMoney(maxSale)}
        </span>
        {item.qtySent != null ? (
          <span className="rounded-full bg-subtle px-2 py-0.5 text-muted">
            ส่ง {item.qtySent}
          </span>
        ) : null}
      </div>
    </div>
  );
}

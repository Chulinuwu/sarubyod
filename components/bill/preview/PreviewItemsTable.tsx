import type { BillComputed } from "@/lib/bill/types";
import { TH, MIN_PREVIEW_ROWS } from "@/lib/bill/constants";
import { formatMoney } from "@/lib/bill/format";

const th = "border border-line-strong px-2 py-2 font-bold text-label";
const td = "border border-line-strong px-2 py-1.5 text-ink";

export function PreviewItemsTable({ bill }: { bill: BillComputed }) {
  const filler = Math.max(0, MIN_PREVIEW_ROWS - bill.items.length);

  return (
    <table className="w-full table-fixed border-collapse overflow-hidden rounded-lg text-xs">
      <thead className="bg-paper-head">
        <tr>
          <th className={`${th} w-8`}>{TH.seq}</th>
          <th className={th}>{TH.itemName}</th>
          <th className={`${th} w-14`}>{TH.basePrice}</th>
          <th className={`${th} w-14`}>{TH.salePrice}</th>
          <th className={`${th} w-10`}>{TH.qty}</th>
          <th className={`${th} w-18`}>{TH.lineTotal}</th>
        </tr>
      </thead>
      <tbody>
        {bill.items.map((it) => (
          <tr key={it.seq}>
            <td className={`${td} text-center text-body`}>{it.seq}</td>
            <td className={td}>{it.name}</td>
            <td className={`${td} tnum text-center`}>{formatMoney(it.basePrice)}</td>
            <td className={`${td} tnum text-center`}>{formatMoney(it.salePrice)}</td>
            <td className={`${td} tnum text-center`}>{it.qty}</td>
            <td className={`${td} tnum text-right font-semibold`}>
              {formatMoney(it.lineTotal)}
            </td>
          </tr>
        ))}
        {Array.from({ length: filler }).map((_, i) => (
          <tr key={`f-${i}`}>
            <td className={`${td} h-7`} />
            <td className={td} />
            <td className={td} />
            <td className={td} />
            <td className={td} />
            <td className={td} />
          </tr>
        ))}
        <tr className="bg-paper-head">
          <td className={td} />
          <td className={td} />
          <td className={td} />
          <td className={td} />
          <td className={`${td} text-center font-bold text-label`}>
            {TH.grandTotal}
          </td>
          <td className={`${td} tnum text-right font-bold text-ink`}>
            {TH.baht} {formatMoney(bill.totalAmount)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

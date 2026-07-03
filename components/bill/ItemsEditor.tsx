import type { BillComputed, BillItemInput } from "@/lib/bill/types";
import { TH } from "@/lib/bill/constants";
import { formatMoney } from "@/lib/bill/format";
import { ItemRow } from "./ItemRow";

type Props = {
  items: BillItemInput[];
  computed: BillComputed;
  itemErrors: Record<number, string>;
  onChange: (index: number, patch: Partial<BillItemInput>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function ItemsEditor({
  items,
  computed,
  itemErrors,
  onChange,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div>
      <div className="divide-y divide-line">
        {items.map((item, i) => (
          <ItemRow
            key={i}
            index={i}
            item={item}
            lineTotal={computed.items[i]?.lineTotal ?? 0}
            baseTotal={computed.items[i]?.baseTotal ?? 0}
            lineCommission={computed.items[i]?.commission ?? 0}
            canRemove={items.length > 1}
            onChange={onChange}
            onRemove={onRemove}
            nameError={itemErrors[i]}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-4 w-full rounded-lg border border-dashed border-brand-border py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
      >
        + เพิ่มรายการ
      </button>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className="text-sm text-body">
          {TH.grandTotal} ({items.length} รายการ)
        </span>
        <span className="tnum text-base font-bold text-ink">
          ฿ {formatMoney(computed.totalAmount)}
        </span>
      </div>
    </div>
  );
}

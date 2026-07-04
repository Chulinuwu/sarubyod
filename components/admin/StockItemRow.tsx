import { useState } from "react";
import type { StockItem, StockItemForm } from "@/lib/stock/types";
import { formatMoney } from "@/lib/bill/format";
import { ItemFields } from "./ItemFields";

type Props = {
  item: StockItem;
  busy: boolean;
  onSave: (v: StockItemForm) => void;
  onDelete: () => void;
};

export function StockItemRow({ item, busy, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ItemFields
        initial={{
          name: item.name,
          basePrice: item.basePrice,
          profitCeiling: item.profitCeiling,
          qtySent: item.qtySent,
        }}
        submitting={busy}
        submitLabel="บันทึก"
        onSubmit={(v) => {
          onSave(v);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line px-3.5 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
        <p className="tnum text-xs text-muted">
          ฐาน ฿ {formatMoney(item.basePrice)} · เพดานกำไร ฿{" "}
          {formatMoney(item.profitCeiling)}
          {item.qtySent != null ? ` · ส่ง ${item.qtySent}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-body hover:bg-subtle hover:text-ink"
        >
          แก้
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger-soft disabled:opacity-40"
        >
          ลบ
        </button>
      </div>
    </div>
  );
}

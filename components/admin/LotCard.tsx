import { useEffect, useState } from "react";
import type {
  StockItem,
  StockItemForm,
  StockLotForm,
  StockLotSummary,
} from "@/lib/stock/types";
import { formatThaiDate } from "@/lib/bill/format";
import {
  fetchLot,
  updateLot,
  deleteLot,
  addItem,
  updateItem,
  deleteItem,
} from "@/lib/admin/client";
import { cn } from "@/lib/cn";
import { LotFields } from "./LotFields";
import { ItemFields } from "./ItemFields";
import { StockItemRow } from "./StockItemRow";

const emptyItem: StockItemForm = {
  name: "",
  basePrice: 0,
  profitCeiling: 0,
  qtySent: null,
};

type Props = {
  lot: StockLotSummary;
  onUpdated: (lot: StockLotSummary) => void;
  onDeleted: (id: string) => void;
  onError: (e: unknown) => void;
};

export function LotCard({ lot, onUpdated, onDeleted, onError }: Props) {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState<StockItem[] | null>(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || items !== null) return;
    if (lot.itemCount === 0) {
      setItems([]);
      return;
    }
    let cancelled = false;
    fetchLot(lot.id)
      .then((l) => !cancelled && setItems(l.items))
      .catch((e) => !cancelled && onError(e));
    return () => {
      cancelled = true;
    };
  }, [open, items, lot.id, lot.itemCount, onError]);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      onError(e);
    } finally {
      setBusy(false);
    }
  }

  const saveLot = (v: StockLotForm) =>
    run(async () => {
      await updateLot(lot.id, v);
      onUpdated({ ...lot, ...v });
      setEditing(false);
    });

  const removeLot = () =>
    run(async () => {
      await deleteLot(lot.id);
      onDeleted(lot.id);
    });

  const createItem = (v: StockItemForm) =>
    run(async () => {
      const item = await addItem(lot.id, v);
      setItems((prev) => [...(prev ?? []), item]);
      onUpdated({ ...lot, itemCount: lot.itemCount + 1 });
      setAdding(false);
    });

  const editItem = (id: string, v: StockItemForm) =>
    run(async () => {
      await updateItem(id, v);
      setItems((prev) =>
        (prev ?? []).map((it) => (it.id === id ? { ...it, ...v } : it)),
      );
    });

  const removeItem = (id: string) =>
    run(async () => {
      await deleteItem(id);
      setItems((prev) => (prev ?? []).filter((it) => it.id !== id));
      onUpdated({ ...lot, itemCount: Math.max(0, lot.itemCount - 1) });
    });

  return (
    <div className="rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 p-4">
        <button type="button" onClick={() => setOpen((o) => !o)} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink">{lot.name}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                lot.isActive
                  ? "bg-success-soft text-success"
                  : "bg-line text-muted",
              )}
            >
              {lot.isActive ? "เปิด" : "ปิด"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {lot.consignor}
            {lot.lotDate ? ` · ${formatThaiDate(lot.lotDate)}` : ""} ·{" "}
            {lot.itemCount} สินค้า
          </p>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-body hover:bg-subtle hover:text-ink"
          >
            แก้ไข
          </button>
          <button
            type="button"
            onClick={removeLot}
            disabled={busy}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger-soft disabled:opacity-40"
          >
            ลบ
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg px-2 py-1.5 text-body hover:bg-subtle"
          >
            {open ? "▴" : "▾"}
          </button>
        </div>
      </div>

      {editing ? (
        <div className="border-t border-line p-4">
          <LotFields
            initial={{
              name: lot.name,
              lotDate: lot.lotDate,
              consignor: lot.consignor,
              note: lot.note,
              isActive: lot.isActive,
            }}
            submitting={busy}
            submitLabel="บันทึก lot"
            onSubmit={saveLot}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : null}

      {open ? (
        <div className="flex flex-col gap-2 border-t border-line p-4">
          <p className="text-xs font-bold text-label">สินค้าในล็อตนี้</p>
          {items === null ? (
            <p className="py-4 text-center text-sm text-muted">กำลังโหลด...</p>
          ) : items.length === 0 ? (
            <p className="py-2 text-sm text-muted">
              ยังไม่มีสินค้าในล็อตนี้ กด เพิ่มสินค้า ด้านล่าง
            </p>
          ) : (
            items.map((it) => (
              <StockItemRow
                key={it.id}
                item={it}
                busy={busy}
                onSave={(v) => editItem(it.id, v)}
                onDelete={() => removeItem(it.id)}
              />
            ))
          )}

          {adding ? (
            <ItemFields
              initial={emptyItem}
              submitting={busy}
              submitLabel="เพิ่มสินค้า"
              onSubmit={createItem}
              onCancel={() => setAdding(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="rounded-lg border border-dashed border-brand-border py-2 text-sm font-semibold text-brand hover:bg-brand-soft"
            >
              + เพิ่มสินค้า
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

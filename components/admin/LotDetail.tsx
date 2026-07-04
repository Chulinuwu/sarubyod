import { useEffect, useState } from "react";
import type {
  StockItemForm,
  StockLotForm,
  StockLotSummary,
  StockLotWithItems,
} from "@/lib/stock/types";
import { formatThaiDate } from "@/lib/bill/format";
import { cn } from "@/lib/cn";
import {
  fetchLot,
  updateLot,
  deleteLot,
  addItem,
  updateItem,
  deleteItem,
} from "@/lib/admin/client";
import { LotFields } from "./LotFields";
import { ItemFields } from "./ItemFields";
import { StockItemRow } from "./StockItemRow";

const emptyItem: StockItemForm = {
  name: "",
  basePrice: 0,
  profitCeiling: 0,
  qtySent: null,
};

function summaryOf(lot: StockLotWithItems): StockLotSummary {
  const { items, ...rest } = lot;
  return { ...rest, itemCount: items.length };
}

type Props = {
  lotId: string;
  onLotChanged: (lot: StockLotSummary) => void;
  onLotDeleted: (id: string) => void;
  onError: (e: unknown) => void;
  onBack: () => void;
};

export function LotDetail({
  lotId,
  onLotChanged,
  onLotDeleted,
  onError,
  onBack,
}: Props) {
  const [lot, setLot] = useState<StockLotWithItems | null>(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLot(null);
    setEditing(false);
    setAdding(false);
    fetchLot(lotId)
      .then((l) => !cancelled && setLot(l))
      .catch((e) => !cancelled && onError(e));
    return () => {
      cancelled = true;
    };
  }, [lotId, onError]);

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

  function commit(next: StockLotWithItems) {
    setLot(next);
    onLotChanged(summaryOf(next));
  }

  if (!lot) {
    return <p className="py-16 text-center text-sm text-muted">กำลังโหลด...</p>;
  }

  const saveLot = (v: StockLotForm) =>
    run(async () => {
      await updateLot(lot.id, v);
      commit({ ...lot, ...v });
      setEditing(false);
    });

  const toggleActive = () =>
    run(async () => {
      const next = { ...lot, isActive: !lot.isActive };
      await updateLot(lot.id, next);
      commit(next);
    });

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm font-semibold text-brand hover:underline md:hidden"
      >
        ล็อตทั้งหมด
      </button>

      {editing ? (
        <LotFields
          initial={{
            name: lot.name,
            lotDate: lot.lotDate,
            consignor: lot.consignor,
            note: lot.note,
            isActive: lot.isActive,
          }}
          submitting={busy}
          submitLabel="บันทึกล็อต"
          onSubmit={saveLot}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line-strong pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-ink">{lot.name}</h2>
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
              {lot.items.length} สินค้า
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleActive}
              disabled={busy}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-body hover:bg-subtle hover:text-ink disabled:opacity-40"
            >
              {lot.isActive ? "ปิดล็อต" : "เปิดล็อต"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-body hover:bg-subtle hover:text-ink"
            >
              แก้ไข
            </button>
            <button
              type="button"
              onClick={() => run(async () => {
                await deleteLot(lot.id);
                onLotDeleted(lot.id);
              })}
              disabled={busy}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger-soft disabled:opacity-40"
            >
              ลบ
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-label">
          สินค้าในล็อต ({lot.items.length})
        </p>
        {lot.items.length === 0 ? (
          <p className="py-2 text-sm text-muted">
            ยังไม่มีสินค้า กด เพิ่มสินค้า ด้านล่าง
          </p>
        ) : (
          lot.items.map((it) => (
            <StockItemRow
              key={it.id}
              item={it}
              busy={busy}
              onSave={(v) =>
                run(async () => {
                  await updateItem(it.id, v);
                  commit({
                    ...lot,
                    items: lot.items.map((x) =>
                      x.id === it.id ? { ...x, ...v } : x,
                    ),
                  });
                })
              }
              onDelete={() =>
                run(async () => {
                  await deleteItem(it.id);
                  commit({
                    ...lot,
                    items: lot.items.filter((x) => x.id !== it.id),
                  });
                })
              }
            />
          ))
        )}

        {adding ? (
          <ItemFields
            initial={emptyItem}
            submitting={busy}
            submitLabel="เพิ่มสินค้า"
            onSubmit={(v) =>
              run(async () => {
                const item = await addItem(lot.id, v);
                commit({ ...lot, items: [...lot.items, item] });
                setAdding(false);
              })
            }
            onCancel={() => setAdding(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-1 rounded-lg border border-dashed border-brand-border py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
          >
            + เพิ่มสินค้า
          </button>
        )}
      </div>
    </div>
  );
}

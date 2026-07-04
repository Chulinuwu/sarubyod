"use client";
import { useCallback, useState } from "react";
import type { StockLotSummary, StockLotForm } from "@/lib/stock/types";
import { createLot, adminErrorText } from "@/lib/admin/client";
import { cn } from "@/lib/cn";
import { LotSidebar } from "./LotSidebar";
import { LotDetail } from "./LotDetail";
import { LotFields } from "./LotFields";
import { StatusBanner, type Status } from "@/components/bill/StatusBanner";

const NEW = "new";

const emptyLot: StockLotForm = {
  name: "",
  lotDate: null,
  consignor: "twentytoys",
  note: "",
  isActive: true,
};

export function AdminStockClient({
  initialLots,
}: {
  initialLots: StockLotSummary[];
}) {
  const [lots, setLots] = useState(initialLots);
  const [selection, setSelection] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const onError = useCallback(
    (e: unknown) => setStatus({ type: "error", text: adminErrorText(e) }),
    [],
  );

  async function create(v: StockLotForm) {
    setBusy(true);
    setStatus(null);
    try {
      const lot = await createLot(v);
      setLots((p) => [{ ...lot, itemCount: 0 }, ...p]);
      setSelection(lot.id);
      setStatus({ type: "success", text: "สร้างล็อตแล้ว เพิ่มสินค้าได้เลย" });
    } catch (e) {
      onError(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-bold text-ink">จัดการ stocklist</h1>
        <p className="text-sm text-muted">
          เลือกล็อตทางซ้ายเพื่อจัดการสินค้าในล็อตนั้น
        </p>
      </div>

      {status ? <StatusBanner status={status} /> : null}

      <div className="grid gap-6 md:grid-cols-[300px_1fr] md:items-start">
        <div className={cn(selection !== null ? "hidden md:block" : "block")}>
          <LotSidebar
            lots={lots}
            selectedId={selection}
            onSelect={setSelection}
            onNew={() => setSelection(NEW)}
          />
        </div>

        <div className={cn(selection === null ? "hidden md:block" : "block")}>
          {selection === NEW ? (
            <LotFields
              initial={emptyLot}
              submitting={busy}
              submitLabel="สร้างล็อต"
              onSubmit={create}
              onCancel={() => setSelection(null)}
            />
          ) : selection ? (
            <LotDetail
              key={selection}
              lotId={selection}
              onLotChanged={(lot) =>
                setLots((p) => p.map((l) => (l.id === lot.id ? lot : l)))
              }
              onLotDeleted={(id) => {
                setLots((p) => p.filter((l) => l.id !== id));
                setSelection(null);
              }}
              onError={onError}
              onBack={() => setSelection(null)}
            />
          ) : (
            <div className="hidden rounded-xl border border-dashed border-line py-16 text-center text-sm text-muted md:block">
              เลือกล็อตทางซ้าย หรือกด สร้าง lot ใหม่
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

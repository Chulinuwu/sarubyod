"use client";
import { useCallback, useState } from "react";
import type { StockLotSummary, StockLotForm } from "@/lib/stock/types";
import { createLot, adminErrorText } from "@/lib/admin/client";
import { LotCard } from "./LotCard";
import { LotFields } from "./LotFields";
import { Button } from "@/components/ui/Button";
import { StatusBanner, type Status } from "@/components/bill/StatusBanner";

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
  const [creating, setCreating] = useState(false);
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
      setCreating(false);
      setStatus({ type: "success", text: "สร้าง lot เรียบร้อย" });
    } catch (e) {
      onError(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-ink">จัดการ stocklist</h1>
          <p className="text-sm text-muted">
            แต่ละ lot คือรอบที่ผู้ฝากขายส่งของมา
          </p>
        </div>
        {!creating ? (
          <Button onClick={() => setCreating(true)}>+ สร้าง lot</Button>
        ) : null}
      </div>

      {status ? <StatusBanner status={status} /> : null}

      {creating ? (
        <LotFields
          initial={emptyLot}
          submitting={busy}
          submitLabel="สร้าง lot"
          onSubmit={create}
          onCancel={() => setCreating(false)}
        />
      ) : null}

      {lots.length === 0 && !creating ? (
        <p className="rounded-xl border border-dashed border-line py-10 text-center text-sm text-muted">
          ยังไม่มี lot กด สร้าง lot เพื่อเริ่ม
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {lots.map((lot) => (
            <LotCard
              key={lot.id}
              lot={lot}
              onUpdated={(next) =>
                setLots((p) => p.map((l) => (l.id === next.id ? next : l)))
              }
              onDeleted={(id) => setLots((p) => p.filter((l) => l.id !== id))}
              onError={onError}
            />
          ))}
        </div>
      )}
    </div>
  );
}

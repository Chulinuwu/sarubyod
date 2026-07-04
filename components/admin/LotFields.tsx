import { useState } from "react";
import type { StockLotForm } from "@/lib/stock/types";
import { TextField } from "@/components/ui/TextField";
import { DateField } from "@/components/ui/DateField";
import { Button } from "@/components/ui/Button";

type Props = {
  initial: StockLotForm;
  submitting: boolean;
  submitLabel: string;
  onSubmit: (values: StockLotForm) => void;
  onCancel: () => void;
};

export function LotFields({
  initial,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [v, setV] = useState<StockLotForm>(initial);
  const set = <K extends keyof StockLotForm>(k: K, val: StockLotForm[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-subtle p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          label="ชื่อ lot *"
          placeholder="เช่น Lot 2 กค 69"
          value={v.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <DateField
          label="วันที่ส่ง"
          value={v.lotDate ?? ""}
          onChange={(iso) => set("lotDate", iso)}
        />
        <TextField
          label="ผู้ฝากขาย"
          value={v.consignor}
          onChange={(e) => set("consignor", e.target.value)}
        />
        <TextField
          label="หมายเหตุ"
          value={v.note}
          onChange={(e) => set("note", e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-body">
        <input
          type="checkbox"
          checked={v.isActive}
          onChange={(e) => set("isActive", e.target.checked)}
          className="size-4 accent-brand"
        />
        เปิดใช้งาน (ให้ storefront เลือกสินค้าใน lot นี้ได้)
      </label>

      <div className="flex gap-2">
        <Button onClick={() => onSubmit(v)} disabled={submitting}>
          {submitting ? "กำลังบันทึก..." : submitLabel}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          ยกเลิก
        </Button>
      </div>
    </div>
  );
}

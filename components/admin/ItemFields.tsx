import { useState } from "react";
import type { StockItemForm } from "@/lib/stock/types";
import { TextField } from "@/components/ui/TextField";
import { NumberField } from "@/components/ui/NumberField";
import { Button } from "@/components/ui/Button";

type Props = {
  initial: StockItemForm;
  submitting: boolean;
  submitLabel: string;
  onSubmit: (values: StockItemForm) => void;
  onCancel: () => void;
};

export function ItemFields({
  initial,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [v, setV] = useState<StockItemForm>(initial);
  const set = <K extends keyof StockItemForm>(k: K, val: StockItemForm[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-brand-border bg-brand-soft/50 p-4">
      <TextField
        label="ชื่อสินค้า *"
        placeholder="เช่น lisa ถั่วลันเตา"
        value={v.name}
        onChange={(e) => set("name", e.target.value)}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NumberField
          label="ราคาฐาน (บาท)"
          prefix="฿"
          value={v.basePrice}
          step={1}
          onValueChange={(n) => set("basePrice", n)}
        />
        <NumberField
          label="เพดานกำไร/ชิ้น (บาท)"
          prefix="฿"
          value={v.profitCeiling}
          step={1}
          onValueChange={(n) => set("profitCeiling", n)}
        />
        <NumberField
          label="จำนวนที่ส่ง (ถ้ามี)"
          placeholder="-"
          value={v.qtySent ?? 0}
          step={1}
          onValueChange={(n) => set("qtySent", n || null)}
        />
      </div>
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

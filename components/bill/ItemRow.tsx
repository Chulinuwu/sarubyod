import type { BillItemInput } from "@/lib/bill/types";
import { TH } from "@/lib/bill/constants";
import { formatMoney } from "@/lib/bill/format";
import { TextField } from "@/components/ui/TextField";
import { NumberField } from "@/components/ui/NumberField";

type Props = {
  index: number;
  item: BillItemInput;
  lineTotal: number;
  baseTotal: number;
  lineCommission: number;
  canRemove: boolean;
  onChange: (index: number, patch: Partial<BillItemInput>) => void;
  onRemove: (index: number) => void;
  nameError?: string;
};

export function ItemRow({
  index,
  item,
  lineTotal,
  baseTotal,
  lineCommission,
  canRemove,
  onChange,
  onRemove,
  nameError,
}: Props) {
  return (
    <div className="py-4 first:pt-0">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold text-label">
          รายการที่{" "}
          <span className="tnum text-brand">
            {String(index + 1).padStart(2, "0")}
          </span>
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          aria-label={`ลบรายการที่ ${index + 1}`}
          className="text-xs font-semibold text-danger transition-colors hover:underline disabled:opacity-35 disabled:no-underline"
        >
          ลบรายการ
        </button>
      </div>

      <TextField
        label={TH.itemName}
        placeholder="เช่น lisa ถั่วลันเตา ทั้งหมด 7 ชิ้น"
        value={item.name}
        error={nameError}
        onChange={(e) => onChange(index, { name: e.target.value })}
      />

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <NumberField
          label="ราคาฐาน/ชิ้น (บาท)"
          prefix="฿"
          placeholder="0"
          value={item.basePrice}
          step={1}
          onValueChange={(n) => onChange(index, { basePrice: n })}
        />
        <NumberField
          label="ราคาขายจริง/ชิ้น (บาท)"
          prefix="฿"
          placeholder="0"
          value={item.salePrice}
          step={1}
          onValueChange={(n) => onChange(index, { salePrice: n })}
        />
        <NumberField
          label="จำนวนที่ขายได้ (ชิ้น)"
          placeholder="0"
          value={item.qty}
          step={1}
          onValueChange={(n) => onChange(index, { qty: n })}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between rounded-lg bg-subtle px-3.5 py-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted">
            โอนให้ผู้ฝากขาย ฿ {formatMoney(baseTotal)} · ค่าคอม ฿{" "}
            {formatMoney(lineCommission)}
          </span>
          <span className="text-xs font-semibold text-label">ยอดขายรวม</span>
        </div>
        <span className="tnum text-sm font-bold text-ink">
          ฿ {formatMoney(lineTotal)}
        </span>
      </div>
    </div>
  );
}

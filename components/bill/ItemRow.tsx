import type { BillItemInput } from "@/lib/bill/types";
import type { StockOption } from "@/lib/stock/types";
import { formatMoney } from "@/lib/bill/format";
import { NumberField } from "@/components/ui/NumberField";
import { StockPicker } from "./StockPicker";

type Props = {
  index: number;
  item: BillItemInput;
  stockOptions: StockOption[];
  lineTotal: number;
  baseTotal: number;
  lineCommission: number;
  canRemove: boolean;
  onChange: (index: number, patch: Partial<BillItemInput>) => void;
  onRemove: (index: number) => void;
  nameError?: string;
};

const clamp = (n: number, min: number, max: number): number =>
  Math.min(Math.max(n, min), max);

export function ItemRow({
  index,
  item,
  stockOptions,
  lineTotal,
  baseTotal,
  lineCommission,
  canRemove,
  onChange,
  onRemove,
  nameError,
}: Props) {
  const selected = stockOptions.find((o) => o.id === item.stockItemId) ?? null;
  const ceiling = selected?.profitCeiling ?? 0;
  const markup = Math.max(0, item.salePrice - item.basePrice);

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

      <StockPicker
        value={item.stockItemId}
        options={stockOptions}
        error={nameError}
        onSelect={(o) =>
          onChange(index, {
            stockItemId: o.id,
            name: o.name,
            basePrice: o.basePrice,
            salePrice: o.basePrice,
          })
        }
      />

      {item.stockItemId ? (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <NumberField
              label={`บวกเพิ่มจากฐาน/ชิ้น (สูงสุด ฿${formatMoney(ceiling)})`}
              prefix="฿"
              placeholder="0"
              value={markup}
              step={1}
              onValueChange={(n) =>
                onChange(index, {
                  salePrice: item.basePrice + clamp(n, 0, ceiling),
                })
              }
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
                ฐาน ฿ {formatMoney(item.basePrice)} · ขาย ฿{" "}
                {formatMoney(item.salePrice)} · โอน ฿ {formatMoney(baseTotal)} ·
                ค่าคอม ฿ {formatMoney(lineCommission)}
              </span>
              <span className="text-xs font-semibold text-label">ยอดขายรวม</span>
            </div>
            <span className="tnum text-sm font-bold text-ink">
              ฿ {formatMoney(lineTotal)}
            </span>
          </div>
        </>
      ) : (
        <p className="mt-2 text-xs text-muted">
          เลือกสินค้าก่อน แล้วกรอกจำนวน + บวกเพิ่มจากราคาฐาน
        </p>
      )}
    </div>
  );
}

import type { BillComputed, BillInput } from "@/lib/bill/types";
import { TH } from "@/lib/bill/constants";
import { formatMoney } from "@/lib/bill/format";

type Props = {
  input: BillInput;
  computed: BillComputed;
  setField: <K extends keyof BillInput>(key: K, value: BillInput[K]) => void;
};

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-body">{label}</span>
      <span className="tnum text-sm font-semibold text-ink">
        ฿ {formatMoney(value)}
      </span>
    </div>
  );
}

export function SummaryInputs({ input, computed, setField }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <Row label={TH.totalSales} value={computed.totalAmount} />
      <Row label={TH.commission} value={computed.commission} />
      <p className="-mt-1 text-xs text-muted">
        ค่าคอมคำนวณจาก ราคาขายจริง ลบ ราคาฐาน โดยอัตโนมัติ
      </p>

      <div className="flex items-center justify-between border-t border-line-strong pt-4">
        <span className="text-sm font-semibold text-ink">{TH.netTransfer}</span>
        <span className="tnum text-xl font-bold text-brand">
          ฿ {formatMoney(computed.netTransfer)}
        </span>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold tracking-wide text-label">
          {TH.note}
        </span>
        <textarea
          rows={2}
          placeholder="เช่น เหลือถั่วลันเตา 2 เค้กครีม 3"
          value={input.note}
          onChange={(e) => setField("note", e.target.value)}
          className="resize-none rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/15"
        />
      </label>
    </div>
  );
}

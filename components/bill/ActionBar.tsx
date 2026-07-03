import { Button } from "@/components/ui/Button";
import { TH } from "@/lib/bill/constants";

type Props = {
  onSave: () => void;
  onExport: () => void;
  saving: boolean;
  exporting: boolean;
  net: string;
};

export function ActionBar({ onSave, onExport, saving, exporting, net }: Props) {
  const busy = saving || exporting;
  return (
    <div className="sticky bottom-0 z-20 border-t border-line bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
        <div className="hidden flex-col sm:flex">
          <span className="text-[11px] text-muted">{TH.netTransfer}</span>
          <span className="tnum text-lg font-bold text-ink">฿ {net}</span>
        </div>
        <div className="flex flex-1 gap-2.5 sm:flex-none sm:ml-auto">
          <Button
            variant="secondary"
            className="flex-1 sm:flex-none"
            onClick={onExport}
            disabled={busy}
          >
            {exporting ? "กำลังสร้าง..." : "Export PDF"}
          </Button>
          <Button
            className="flex-1 sm:flex-none sm:px-8"
            onClick={onSave}
            disabled={busy}
          >
            {saving ? "กำลังบันทึก..." : "บันทึกบิล"}
          </Button>
        </div>
      </div>
    </div>
  );
}

import type { BillComputed } from "@/lib/bill/types";
import { TH } from "@/lib/bill/constants";
import { PreviewMeta } from "./preview/PreviewMeta";
import { PreviewItemsTable } from "./preview/PreviewItemsTable";
import { PreviewSummary } from "./preview/PreviewSummary";

export function BillPreview({ bill }: { bill: BillComputed }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-elevated">
      <div className="h-1.5 w-full bg-brand" />
      <div className="p-5 sm:p-7">
        <div className="mb-5 flex flex-col items-center">
          <h2 className="text-lg font-bold text-ink sm:text-xl">{TH.title}</h2>
          <span className="mt-2 h-[3px] w-10 rounded-full bg-brand" />
        </div>
        <div className="flex flex-col gap-3.5">
          <PreviewMeta bill={bill} />
          <PreviewItemsTable bill={bill} />
          <PreviewSummary bill={bill} />
        </div>
      </div>
    </div>
  );
}

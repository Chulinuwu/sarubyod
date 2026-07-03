import type { BillComputed } from "@/lib/bill/types";
import { TH } from "@/lib/bill/constants";
import { formatThaiDate } from "@/lib/bill/format";

function Pair({
  label,
  value,
  lastCol,
}: {
  label: string;
  value: string;
  lastCol?: boolean;
}) {
  return (
    <>
      <div className="w-20 shrink-0 border-r border-line-strong bg-canvas px-2.5 py-2 text-body">
        {label}
      </div>
      <div
        className={`flex-1 px-2.5 py-2 text-center font-semibold text-ink ${lastCol ? "" : "border-r border-line-strong"}`}
      >
        {value || " "}
      </div>
    </>
  );
}

function Row({
  a,
  b,
  top,
}: {
  a: { label: string; value: string };
  b: { label: string; value: string };
  top?: boolean;
}) {
  return (
    <div className={`flex ${top ? "border-t border-line-strong" : ""}`}>
      <Pair label={a.label} value={a.value} />
      <Pair label={b.label} value={b.value} lastCol />
    </div>
  );
}

export function PreviewMeta({ bill }: { bill: BillComputed }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line-strong text-xs">
      <Row
        a={{ label: TH.date, value: formatThaiDate(bill.billDate) }}
        b={{ label: TH.billNo, value: bill.billNo }}
      />
      <Row
        top
        a={{ label: TH.shop, value: bill.shopName }}
        b={{ label: TH.consignor, value: bill.consignor }}
      />
      <Row
        top
        a={{ label: TH.receiver, value: bill.receiver }}
        b={{ label: TH.phone, value: bill.phone }}
      />
    </div>
  );
}

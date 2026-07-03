import type { BillInput, BillComputed, BillItem, BillItemInput } from "./types";

const round2 = (n: number): number =>
  Math.round((n + Number.EPSILON) * 100) / 100;

export function computeItems(items: BillItemInput[]): BillItem[] {
  return items.map((it, i) => {
    const lineTotal = round2(it.salePrice * it.qty);
    const baseTotal = round2(it.basePrice * it.qty);
    return {
      ...it,
      seq: i + 1,
      lineTotal,
      baseTotal,
      commission: round2(lineTotal - baseTotal),
    };
  });
}

export function computeBill(input: BillInput): BillComputed {
  const { items: rawItems, ...rest } = input;
  const items = computeItems(rawItems);
  const totalAmount = round2(items.reduce((s, it) => s + it.lineTotal, 0));
  const netTransfer = round2(items.reduce((s, it) => s + it.baseTotal, 0));
  return {
    ...rest,
    items,
    totalAmount,
    netTransfer,
    commission: round2(totalAmount - netTransfer),
  };
}

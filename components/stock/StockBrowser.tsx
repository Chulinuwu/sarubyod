"use client";
import { useMemo, useState } from "react";
import type { StockLotWithItems } from "@/lib/stock/types";
import { formatThaiDate } from "@/lib/bill/format";
import { StockItemLine } from "./StockItemLine";

export function StockBrowser({ lots }: { lots: StockLotWithItems[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lots;
    return lots
      .map((lot) => ({
        ...lot,
        items: lot.items.filter((it) => it.name.toLowerCase().includes(q)),
      }))
      .filter((lot) => lot.items.length > 0);
  }, [lots, query]);

  const totalItems = useMemo(
    () => lots.reduce((s, l) => s + l.items.length, 0),
    [lots],
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-bold text-ink">สต๊อกสินค้า</h1>
        <p className="text-sm text-muted">
          {totalItems} รายการ ใน {lots.length} ล็อต (ดูอย่างเดียว)
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ค้นหาชื่อสินค้า"
        className="sticky top-16 z-10 rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/15"
      />

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-muted">
          {lots.length === 0 ? "ยังไม่มีสินค้าในสต๊อก" : "ไม่พบสินค้า"}
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {filtered.map((lot) => (
            <section key={lot.id}>
              <div className="mb-2 flex items-baseline justify-between gap-3 border-b border-line-strong pb-2">
                <h2 className="text-sm font-bold text-ink">{lot.name}</h2>
                <span className="shrink-0 text-xs text-muted">
                  {lot.consignor}
                  {lot.lotDate ? ` · ${formatThaiDate(lot.lotDate)}` : ""} ·{" "}
                  {lot.items.length} รายการ
                </span>
              </div>
              {lot.items.map((item) => (
                <StockItemLine key={item.id} item={item} />
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

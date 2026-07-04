import { useMemo, useState } from "react";
import type { StockLotSummary } from "@/lib/stock/types";
import { formatThaiDate } from "@/lib/bill/format";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

type Props = {
  lots: StockLotSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
};

export function LotSidebar({ lots, selectedId, onSelect, onNew }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lots;
    return lots.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.consignor.toLowerCase().includes(q),
    );
  }, [lots, query]);

  return (
    <div className="flex flex-col gap-3">
      <Button className="w-full" onClick={onNew}>
        + สร้าง lot ใหม่
      </Button>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ค้นหาล็อต"
        className="rounded-lg border border-line bg-surface px-3.5 py-2 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/15"
      />

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          {lots.length === 0 ? "ยังไม่มีล็อต" : "ไม่พบล็อต"}
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {filtered.map((lot) => (
            <button
              key={lot.id}
              type="button"
              onClick={() => onSelect(lot.id)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-left transition-colors",
                selectedId === lot.id
                  ? "bg-brand-soft"
                  : "hover:bg-subtle",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-ink">
                  {lot.name}
                </span>
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    lot.isActive ? "bg-success" : "bg-muted",
                  )}
                  aria-label={lot.isActive ? "เปิด" : "ปิด"}
                />
              </div>
              <p className="truncate text-xs text-muted">
                {lot.consignor}
                {lot.lotDate ? ` · ${formatThaiDate(lot.lotDate)}` : ""} ·{" "}
                {lot.itemCount} สินค้า
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

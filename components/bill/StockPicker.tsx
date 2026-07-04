import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/bill/format";
import type { StockOption } from "@/lib/stock/types";

type Props = {
  value: string | null;
  options: StockOption[];
  onSelect: (opt: StockOption) => void;
  error?: string;
};

export function StockPicker({ value, options, onSelect, error }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => options.find((o) => o.id === value) ?? null,
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.name.toLowerCase().includes(q) || o.lotName.toLowerCase().includes(q),
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <span className="text-xs font-semibold tracking-wide text-label">
        เลือกสินค้าจาก stocklist *
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-lg border bg-surface px-3.5 py-2.5 text-left text-sm outline-none transition-all",
            selected ? "text-ink" : "text-muted",
            error ? "border-danger" : open ? "border-brand ring-4 ring-brand/15" : "border-line",
          )}
        >
          <span className="truncate">
            {selected ? selected.name : "แตะเพื่อเลือกสินค้า"}
          </span>
          <span className="shrink-0 text-muted">▾</span>
        </button>

        {open ? (
          <div className="absolute left-0 top-full z-30 mt-2 max-h-72 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-elevated">
            <div className="border-b border-line p-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาชื่อสินค้า / lot"
                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
            <div className="max-h-56 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted">
                  {options.length === 0
                    ? "ยังไม่มีสินค้าใน stocklist"
                    : "ไม่พบสินค้า"}
                </p>
              ) : (
                filtered.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      onSelect(o);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-subtle"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-ink">
                        {o.name}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {o.lotName} · เพดานกำไร ฿ {formatMoney(o.profitCeiling)}
                      </span>
                    </span>
                    <span className="tnum shrink-0 text-xs font-semibold text-body">
                      ฐาน ฿ {formatMoney(o.basePrice)}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </div>
  );
}

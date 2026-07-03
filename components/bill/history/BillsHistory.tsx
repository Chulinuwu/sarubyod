"use client";
import { useMemo, useState } from "react";
import type { BillSummary } from "@/lib/bill/types";
import { formatThaiDate, formatMoney } from "@/lib/bill/format";
import { Calendar, type DayAgg } from "./Calendar";
import { BillList } from "./BillList";
import { MonthNav } from "./MonthNav";

type Props = {
  year: number;
  month1: number;
  today: string;
  bills: BillSummary[];
};

export function BillsHistory({ year, month1, today, bills }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const acc: Record<string, DayAgg> = {};
    for (const b of bills) {
      const a = acc[b.billDate] ?? (acc[b.billDate] = { count: 0, net: 0 });
      a.count += 1;
      a.net += b.netTransfer;
    }
    return acc;
  }, [bills]);

  const monthNet = useMemo(
    () => bills.reduce((s, b) => s + b.netTransfer, 0),
    [bills],
  );

  const filtered = useMemo(
    () => (selected ? bills.filter((b) => b.billDate === selected) : bills),
    [bills, selected],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonthNav year={year} month1={month1} />
        <div className="text-right">
          <p className="text-xs text-muted">ยอดสุทธิรวมทั้งเดือน</p>
          <p className="tnum text-lg font-bold text-ink">
            ฿ {formatMoney(monthNet)} · {bills.length} บิล
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="hidden md:block">
          <Calendar
            year={year}
            month1={month1}
            byDay={byDay}
            today={today}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">
              {selected ? formatThaiDate(selected) : "ทั้งเดือน"}
            </h2>
            {selected ? (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-xs font-semibold text-brand hover:underline"
              >
                ดูทั้งเดือน
              </button>
            ) : null}
          </div>
          <BillList bills={filtered} emptyText="ยังไม่มีบิลในช่วงนี้" />
        </div>
      </div>
    </div>
  );
}

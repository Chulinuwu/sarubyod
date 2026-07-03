import { useState } from "react";
import { cn } from "@/lib/cn";
import { thaiMonthYear } from "@/lib/bill/format";
import {
  isoDate,
  monthCells,
  parseISOParts,
  stepMonth,
  todayISO,
  WEEKDAYS_TH,
} from "@/lib/date";

type Props = {
  value: string;
  onSelect: (iso: string) => void;
};

const navBtn =
  "flex size-8 items-center justify-center rounded-lg text-body transition-colors hover:bg-subtle hover:text-brand";

export function DatePickerPanel({ value, onSelect }: Props) {
  const init = parseISOParts(value || todayISO());
  const [view, setView] = useState({ year: init.year, month1: init.month1 });
  const cells = monthCells(view.year, view.month1);
  const today = todayISO();

  return (
    <div className="absolute left-0 top-full z-30 mt-2 w-full min-w-72 rounded-xl border border-line bg-surface p-3 shadow-elevated">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="เดือนก่อนหน้า"
          className={navBtn}
          onClick={() => setView((v) => stepMonth(v.year, v.month1, -1))}
        >
          ‹
        </button>
        <span className="text-sm font-bold text-ink">
          {thaiMonthYear(view.year, view.month1)}
        </span>
        <button
          type="button"
          aria-label="เดือนถัดไป"
          className={navBtn}
          onClick={() => setView((v) => stepMonth(v.year, v.month1, 1))}
        >
          ›
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-semibold text-muted">
        {WEEKDAYS_TH.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`b-${i}`} />;
          const iso = isoDate(view.year, view.month1, day);
          const isSelected = iso === value;
          const isToday = iso === today;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect(iso)}
              className={cn(
                "tnum flex aspect-square items-center justify-center rounded-lg text-sm transition-colors",
                isSelected
                  ? "bg-brand font-bold text-white"
                  : cn(
                      "hover:bg-subtle",
                      isToday ? "font-bold text-brand" : "text-ink",
                    ),
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

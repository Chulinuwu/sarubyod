import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/bill/format";

export type DayAgg = { count: number; net: number };

type Props = {
  year: number;
  month1: number;
  byDay: Record<string, DayAgg>;
  today: string;
  selected: string | null;
  onSelect: (day: string | null) => void;
};

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function dayKey(year: number, month1: number, day: number): string {
  return `${year}-${String(month1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function Calendar({ year, month1, byDay, today, selected, onSelect }: Props) {
  const startWeekday = new Date(year, month1 - 1, 1).getDay();
  const daysInMonth = new Date(year, month1, 0).getDate();
  const cells = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-muted">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`b-${i}`} />;
          const key = dayKey(year, month1, day);
          const agg = byDay[key];
          const isSelected = selected === key;
          const isToday = today === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(isSelected ? null : key)}
              className={cn(
                "flex aspect-square flex-col items-start rounded-lg border p-1.5 text-left transition-colors sm:p-2",
                isSelected
                  ? "border-brand bg-brand-soft"
                  : agg
                    ? "border-brand-border bg-subtle hover:border-brand"
                    : "border-line hover:border-brand-border",
              )}
            >
              <span
                className={cn(
                  "tnum text-xs font-semibold",
                  isToday ? "text-brand" : "text-ink",
                )}
              >
                {day}
              </span>
              {agg ? (
                <span className="mt-auto w-full">
                  <span className="tnum block truncate text-[11px] font-bold text-ink">
                    {formatMoney(agg.net)}
                  </span>
                  <span className="text-[10px] text-muted">
                    {agg.count} บิล
                  </span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

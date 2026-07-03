import Link from "next/link";
import { thaiMonthYear } from "@/lib/bill/format";

const BILLS_PATH = "/storefront/bills";

function href(year: number, month1: number): string {
  return `${BILLS_PATH}?month=${year}-${String(month1).padStart(2, "0")}`;
}

const arrowClass =
  "flex size-9 items-center justify-center rounded-lg border border-line text-body transition-colors hover:border-brand-border hover:text-brand";

export function MonthNav({ year, month1 }: { year: number; month1: number }) {
  const prev = month1 === 1 ? { y: year - 1, m: 12 } : { y: year, m: month1 - 1 };
  const next = month1 === 12 ? { y: year + 1, m: 1 } : { y: year, m: month1 + 1 };

  return (
    <div className="flex items-center gap-3">
      <Link href={href(prev.y, prev.m)} aria-label="เดือนก่อนหน้า" className={arrowClass}>
        ‹
      </Link>
      <h1 className="min-w-40 text-center text-lg font-bold text-ink">
        {thaiMonthYear(year, month1)}
      </h1>
      <Link href={href(next.y, next.m)} aria-label="เดือนถัดไป" className={arrowClass}>
        ›
      </Link>
    </div>
  );
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function isoDate(year: number, month1: number, day: number): string {
  return `${year}-${pad2(month1)}-${pad2(day)}`;
}

export function todayISO(): string {
  const d = new Date();
  return isoDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

export function parseISOParts(iso: string): { year: number; month1: number; day: number } {
  const [y, m, d] = iso.split("-").map(Number);
  return { year: y, month1: m, day: d };
}

export function monthCells(year: number, month1: number): (number | null)[] {
  const startWeekday = new Date(year, month1 - 1, 1).getDay();
  const daysInMonth = new Date(year, month1, 0).getDate();
  return [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
}

export function stepMonth(
  year: number,
  month1: number,
  dir: 1 | -1,
): { year: number; month1: number } {
  if (dir === -1) {
    return month1 === 1 ? { year: year - 1, month1: 12 } : { year, month1: month1 - 1 };
  }
  return month1 === 12 ? { year: year + 1, month1: 1 } : { year, month1: month1 + 1 };
}

export const WEEKDAYS_TH = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

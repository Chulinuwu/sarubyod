import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  label?: string;
  value: number;
  onValueChange: (n: number) => void;
  error?: string;
  min?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  prefix?: string;
};

const parseNum = (s: string): number => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

export function NumberField({
  label,
  value,
  onValueChange,
  error,
  min = 0,
  step = 1,
  placeholder,
  className,
  ariaLabel,
  prefix,
}: Props) {
  const [raw, setRaw] = useState(value ? String(value) : "");

  useEffect(() => {
    setRaw((prev) => (parseNum(prev) === value ? prev : value ? String(value) : ""));
  }, [value]);

  const field = (
    <div className="relative">
      {prefix ? (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">
          {prefix}
        </span>
      ) : null}
      <input
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={raw}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => {
          setRaw(e.target.value);
          onValueChange(parseNum(e.target.value));
        }}
        className={cn(
          "tnum w-full rounded-lg border bg-surface py-2.5 text-sm text-ink outline-none transition-all duration-150 placeholder:text-muted focus:ring-4",
          prefix ? "pl-9 pr-3.5" : "px-3.5",
          error
            ? "border-danger focus:border-danger focus:ring-danger/15"
            : "border-line focus:border-brand focus:ring-brand/15",
          className,
        )}
      />
    </div>
  );

  if (!label) return field;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-wide text-label">
        {label}
      </span>
      {field}
      {error ? (
        <span className="text-xs font-medium text-danger">{error}</span>
      ) : null}
    </label>
  );
}

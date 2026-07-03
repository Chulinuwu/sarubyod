import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { formatThaiDate } from "@/lib/bill/format";
import { DatePickerPanel } from "./DatePickerPanel";

type Props = {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  error?: string;
};

export function DateField({ label, value, onChange, error }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg border bg-surface px-3.5 py-2.5 text-left text-sm outline-none transition-all",
            value ? "text-ink" : "text-muted",
            error
              ? "border-danger"
              : open
                ? "border-brand ring-4 ring-brand/15"
                : "border-line",
          )}
        >
          <span>{value ? formatThaiDate(value) : "เลือกวันที่"}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted"
            aria-hidden
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </button>
        {open ? (
          <DatePickerPanel
            value={value}
            onSelect={(iso) => {
              onChange(iso);
              setOpen(false);
            }}
          />
        ) : null}
      </div>
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </div>
  );
}

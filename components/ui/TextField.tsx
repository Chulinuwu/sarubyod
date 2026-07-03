import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({ label, error, hint, className, ...rest }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-wide text-label">
        {label}
      </span>
      <input
        className={cn(
          "rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-150 placeholder:text-muted focus:ring-4",
          error
            ? "border-danger focus:border-danger focus:ring-danger/15"
            : "border-line focus:border-brand focus:ring-brand/15",
          className,
        )}
        {...rest}
      />
      {error ? (
        <span className="text-xs font-medium text-danger">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const VARIANTS = {
  primary:
    "bg-brand text-white shadow-brand hover:bg-brand-hover focus-visible:ring-brand/40",
  secondary:
    "bg-surface text-brand border border-brand-border hover:bg-brand-soft focus-visible:ring-brand/30",
  danger:
    "bg-danger text-white hover:brightness-95 focus-visible:ring-danger/30",
  ghost:
    "text-body hover:bg-line hover:text-ink focus-visible:ring-line-strong",
} as const;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
};

export function Button({ variant = "primary", className, ...rest }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold outline-none transition-all duration-150 focus-visible:ring-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none",
        VARIANTS[variant],
        className,
      )}
      {...rest}
    />
  );
}

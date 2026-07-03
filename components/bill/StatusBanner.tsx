import { cn } from "@/lib/cn";

export type Status = { type: "success" | "error"; text: string } | null;

export function StatusBanner({ status }: { status: Status }) {
  if (!status) return null;
  const success = status.type === "success";
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium",
        success
          ? "border-success/25 bg-success-soft text-success"
          : "border-danger/25 bg-danger-soft text-danger",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full text-white",
          success ? "bg-success" : "bg-danger",
        )}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {success ? <path d="M20 6 9 17l-5-5" /> : <path d="M18 6 6 18M6 6l12 12" />}
        </svg>
      </span>
      {status.text}
    </div>
  );
}

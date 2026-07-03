import { cn } from "@/lib/cn";

type Props = {
  tone?: "ink" | "inverse";
  className?: string;
};

export function Wordmark({ tone = "ink", className }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="h-5 w-[3px] rounded-full bg-brand" />
      <span
        className={cn(
          "text-base font-bold tracking-tight",
          tone === "inverse" ? "text-white" : "text-ink",
        )}
      >
        sarubyod
      </span>
    </span>
  );
}

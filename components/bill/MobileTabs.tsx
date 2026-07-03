import { cn } from "@/lib/cn";
import { TABS, type Tab } from "./tabs";

type Props = {
  tab: Tab;
  onChange: (t: Tab) => void;
};

export function MobileTabs({ tab, onChange }: Props) {
  return (
    <div className="flex gap-1 rounded-xl border border-line bg-surface p-1 shadow-xs md:hidden">
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={cn(
            "flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-150",
            tab === t.key
              ? "bg-brand text-white shadow-brand"
              : "text-body hover:bg-canvas",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

"use client";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Wordmark } from "@/components/ui/Wordmark";

const BASE_NAV = [
  { key: "create", label: "สร้างบิล", href: "/storefront" },
  { key: "history", label: "สรุปยอด", href: "/storefront/bills" },
] as const;

const STOCK_NAV = { key: "stock", label: "สต๊อก", href: "/storefront/stock" } as const;
const ADMIN_NAV = { key: "admin", label: "จัดการสต็อก", href: "/admin" } as const;

type Props = {
  displayName: string;
  active: "create" | "history" | "stock" | "admin";
  isAdmin?: boolean;
};

export function TopBar({ displayName, active, isAdmin }: Props) {
  const nav = [...BASE_NAV, isAdmin ? ADMIN_NAV : STOCK_NAV];
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 sm:gap-6">
          <Wordmark />
          <nav className="flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.key}
                href={n.href}
                className={cn(
                  "whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors sm:px-3",
                  active === n.key
                    ? "bg-brand-soft text-brand"
                    : "text-body hover:bg-subtle hover:text-ink",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-body sm:inline">
            {displayName}
          </span>
          <button
            type="button"
            onClick={logout}
            aria-label="ออกจากระบบ"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-body transition-colors hover:bg-subtle hover:text-ink sm:px-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
}

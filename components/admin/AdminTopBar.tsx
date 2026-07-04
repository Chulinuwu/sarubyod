"use client";
import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";

const NAV = [
  { key: "stock", label: "จัดการสต็อก", href: "/admin" },
  { key: "create", label: "สร้างบิล", href: "/storefront" },
  { key: "history", label: "สรุปยอด", href: "/storefront/bills" },
] as const;

export function AdminTopBar({ displayName }: { displayName: string }) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 sm:gap-5">
          <Wordmark />
          <nav className="flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.key}
                href={n.href}
                className={
                  n.key === "stock"
                    ? "whitespace-nowrap rounded-lg bg-brand-soft px-2.5 py-1.5 text-sm font-semibold text-brand"
                    : "whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-semibold text-body transition-colors hover:bg-subtle hover:text-ink"
                }
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

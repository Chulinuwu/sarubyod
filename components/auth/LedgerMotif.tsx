const ROWS = [78, 92, 64, 88, 70, 84];

export function LedgerMotif() {
  return (
    <div aria-hidden className="mt-10 hidden select-none md:block">
      <div className="w-full max-w-xs rounded-t-md border border-white/12 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="h-2 w-16 rounded-full bg-white/25" />
          <span className="h-2 w-10 rounded-full bg-brand/70" />
        </div>
        <div className="flex flex-col gap-2.5">
          {ROWS.map((w, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <span
                className="h-1.5 rounded-full bg-white/15"
                style={{ width: `${w}%` }}
              />
              <span className="h-1.5 w-8 shrink-0 rounded-full bg-white/25" />
            </div>
          ))}
        </div>
      </div>
      <div
        className="h-3 w-full max-w-xs"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 50%, var(--color-ink) 50%), linear-gradient(-135deg, transparent 50%, var(--color-ink) 50%)",
          backgroundSize: "12px 12px",
          backgroundColor: "rgba(255,255,255,0.04)",
        }}
      />
    </div>
  );
}

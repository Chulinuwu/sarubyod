type Props = {
  title: string;
  step?: number;
  hint?: string;
  children: React.ReactNode;
};

export function Section({ title, step, hint, children }: Props) {
  return (
    <section className="border-t border-line-strong py-7 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-baseline gap-2.5">
        {step ? (
          <span className="tnum text-xs font-bold text-brand">
            {String(step).padStart(2, "0")}
          </span>
        ) : null}
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

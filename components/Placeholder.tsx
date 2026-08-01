import { cn } from "@/lib/utils";

/**
 * Marks content the client still has to supply.
 *
 * In development it renders a loud dashed chip so nothing ships by accident.
 * In production it renders nothing at all — an empty slot is honest, an invented
 * number is not. (unisonglobus.com's About page renders "0 +" for every stat
 * because the real figures live only in JS; crawlers and no-JS users see zeros.)
 */
export default function Placeholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border border-dashed border-amber-500 bg-amber-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-700",
        className
      )}
      data-placeholder
    >
      <span aria-hidden="true">⚑</span>
      {label}
    </span>
  );
}

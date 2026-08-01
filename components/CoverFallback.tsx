import Mark from "@/components/brand/Mark";
import { cn } from "@/lib/utils";

/**
 * Stand-in cover for articles published without an image.
 *
 * A flat block of colour reads as a broken image; a branded plate reads as a
 * deliberate choice. Decorative only — the article title is already adjacent in
 * the DOM, so this carries no alt text of its own.
 */
export default function CoverFallback({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-navy",
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[url('/assets/patterns/grid-gold.svg')] bg-repeat" />
      <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <Mark variant="outline" idPrefix={`cover-${label ?? "default"}`} className="h-14" />
        {label && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light/80">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

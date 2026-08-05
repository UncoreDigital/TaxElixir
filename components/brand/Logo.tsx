import Mark from "@/components/brand/Mark";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Full lockup rebuilt as live text: shield + wordmark + rule + tagline, in the
 * page's own Playfair, so it recolours for any background and stays crisp at
 * any size.
 *
 * ADMIN SURFACES ONLY. The public header and footer both render the client's
 * real artwork (site.headerLogo / site.footerLogo) — this is close to it but
 * not identical, and the client noticed the difference the moment it appeared
 * in the footer. Do not reintroduce it to a public page; if a new background
 * needs the lockup, ask for that export rather than approximating it here.
 */
export default function Logo({
  tone = "navy",
  showTagline = false,
  className,
  idPrefix = "logo",
}: {
  tone?: "navy" | "light";
  showTagline?: boolean;
  className?: string;
  idPrefix?: string;
}) {
  const light = tone === "light";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Mark
        variant={light ? "outline" : "gold"}
        idPrefix={idPrefix}
        className="h-full w-auto shrink-0"
      />

      <span className="flex flex-col justify-center">
        <span
          className={cn(
            "font-wordmark font-bold leading-none tracking-tight",
            "text-[1.45em]",
            light ? "text-white" : "text-navy"
          )}
        >
          {site.name}
        </span>

        {showTagline && (
          <span className="mt-1.5 flex items-center gap-2">
            <span
              className={cn(
                "h-px w-4 shrink-0",
                light ? "bg-gold/60" : "bg-navy/25"
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "whitespace-nowrap text-[0.5em] font-medium tracking-wide",
                light ? "text-white/70" : "text-ink-muted"
              )}
            >
              {site.tagline}
            </span>
            <span
              className={cn(
                "h-px w-4 shrink-0",
                light ? "bg-gold/60" : "bg-navy/25"
              )}
              aria-hidden="true"
            />
          </span>
        )}
      </span>
    </span>
  );
}

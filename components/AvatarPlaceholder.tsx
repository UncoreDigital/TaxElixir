import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Team-photo slot shown until the client supplies headshots.
 *
 * Deliberately not stock photography: a page introducing "our leadership" with
 * purchased faces is worse than an honest empty frame, and offshore providers
 * get asked who is actually accountable.
 */
export default function AvatarPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/60",
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[url('/assets/patterns/grid.svg')] bg-repeat" />
      <UserRound className="relative h-10 w-10 text-border" strokeWidth={1.25} />
    </div>
  );
}

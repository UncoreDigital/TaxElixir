import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Section headings render as <h2> by default. The <h1> belongs to the page and
 * appears exactly once — 13 pages on unisonglobus.com have no <h1> at all and
 * 40+ have two or three, which is what happens when hero components own the tag.
 */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
  className,
  invert = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h2" | "h3";
  className?: string;
  invert?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow mb-3", invert && "text-gold-light")}>{eyebrow}</p>
      )}
      <Tag
        className={cn(
          "text-3xl leading-[1.15] md:text-4xl",
          invert && "text-white"
        )}
      >
        {title}
      </Tag>
      <span
        className={cn("rule-gold mt-5", align === "center" && "mx-auto")}
        aria-hidden="true"
      />
      {intro && (
        <div
          className={cn(
            "mt-5 text-base leading-relaxed md:text-lg",
            invert ? "text-white/75" : "text-ink-muted"
          )}
        >
          {intro}
        </div>
      )}
    </div>
  );
}

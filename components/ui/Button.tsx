import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-navy text-white hover:bg-navy-light shadow-soft hover:shadow-card",
        gold: "bg-gradient-gold-x text-navy shadow-soft hover:shadow-gold",
        outline: "border border-navy/20 bg-transparent text-navy hover:border-navy hover:bg-navy hover:text-white",
        ghost: "text-navy hover:bg-muted",
        invert: "bg-white text-navy hover:bg-gold-light",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type BaseProps = VariantProps<typeof buttonVariants> & { className?: string };

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & BaseProps
>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";

export function ButtonLink({
  href,
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof Link> & BaseProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";

const headingVariants = cva("font-bold tracking-tight", {
  variants: {
    level: {
      1: "text-4xl lg:text-5xl",
      2: "text-3xl lg:text-4xl",
      3: "text-2xl lg:text-3xl",
      4: "text-xl lg:text-2xl",
    },
  },
  defaultVariants: { level: 1 },
});

interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {}

export const H1 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "level">>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn(headingVariants({ level: 1 }), className)} {...props} />
  ),
);
H1.displayName = "H1";

export const H2 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "level">>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn(headingVariants({ level: 2 }), className)} {...props} />
  ),
);
H2.displayName = "H2";

export const H3 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "level">>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn(headingVariants({ level: 3 }), className)} {...props} />
  ),
);
H3.displayName = "H3";

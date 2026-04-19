import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-neutral-900 dark:text-neutral-100",
      muted: "text-neutral-500 dark:text-neutral-400",
      error: "text-error",
      success: "text-success",
    },
    size: { xs: "text-xs", sm: "text-sm", base: "text-base", lg: "text-lg", xl: "text-xl" },
  },
  defaultVariants: { variant: "default", size: "base" },
});

interface TextProps
  extends HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ as: Component = "p", className, variant, size, ...props }, ref) => (
    <Component ref={ref} className={cn(textVariants({ variant, size }), className)} {...props} />
  ),
);
Text.displayName = "Text";

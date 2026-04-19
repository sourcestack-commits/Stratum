import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: { none: "gap-0", xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-8" },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: { gap: "md", align: "stretch" },
});

interface StackProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof stackVariants> {}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap, align, ...props }, ref) => (
    <div ref={ref} className={cn(stackVariants({ gap, align }), className)} {...props} />
  ),
);
Stack.displayName = "Stack";

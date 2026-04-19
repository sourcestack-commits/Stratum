import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";

const flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
      rowReverse: "flex-row-reverse",
      colReverse: "flex-col-reverse",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    gap: { none: "gap-0", xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-8" },
    wrap: { wrap: "flex-wrap", nowrap: "flex-nowrap", wrapReverse: "flex-wrap-reverse" },
  },
  defaultVariants: {
    direction: "row",
    align: "start",
    justify: "start",
    gap: "none",
    wrap: "nowrap",
  },
});

interface FlexProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof flexVariants> {}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, align, justify, gap, wrap, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(flexVariants({ direction, align, justify, gap, wrap }), className)}
      {...props}
    />
  ),
);
Flex.displayName = "Flex";

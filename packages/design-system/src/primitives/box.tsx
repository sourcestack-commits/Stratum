import { forwardRef } from "react";
import { cn } from "@repo/utils";
import type { BoxProps } from "../types";

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ as: Component = "div", className, ...props }, ref) => {
    return <Component ref={ref} className={cn(className)} {...props} />;
  },
);
Box.displayName = "Box";

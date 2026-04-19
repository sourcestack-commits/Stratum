import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";

export const Code = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        "relative rounded bg-neutral-100 px-[0.3rem] py-[0.2rem] font-mono text-sm dark:bg-neutral-800",
        className,
      )}
      {...props}
    />
  ),
);
Code.displayName = "Code";

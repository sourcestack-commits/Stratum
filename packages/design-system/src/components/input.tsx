import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@repo/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-50 dark:ring-offset-neutral-900 dark:placeholder:text-neutral-400 autofill:shadow-[inset_0_0_0px_1000px_rgb(38,38,38)] dark:autofill:shadow-[inset_0_0_0px_1000px_rgb(38,38,38)] autofill:[-webkit-text-fill-color:rgb(250,250,250)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

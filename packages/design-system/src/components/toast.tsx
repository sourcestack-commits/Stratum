import { Toaster as SonnerToaster, toast } from "sonner";
import type { ToasterProps } from "../types";

export function Toaster({ position = "bottom-right" }: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      toastOptions={{
        classNames: {
          toast:
            "group bg-white border border-neutral-200 shadow-lg rounded-lg text-sm text-neutral-900 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-50",
          title: "font-semibold text-neutral-900 dark:text-white",
          description: "text-neutral-600 dark:text-neutral-300",
          success: "border-success/30 bg-success/5",
          error: "border-error/30 bg-error/5",
          warning: "border-warning/30 bg-warning/5",
        },
      }}
    />
  );
}

export { toast };

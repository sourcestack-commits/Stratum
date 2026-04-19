import { cn } from "@repo/utils";
import {
  AlertCircle,
  ShieldX,
  Search,
  WifiOff,
  ServerCrash,
  Ban,
  Clock,
  type LucideIcon,
} from "lucide-react";
import type { ErrorCategory, ErrorViewProps, HttpErrorDefinition } from "../types";
import { resolveHttpError } from "../resolver";

const categoryIcons: Record<ErrorCategory, LucideIcon> = {
  client: AlertCircle,
  server: ServerCrash,
  network: WifiOff,
  unknown: AlertCircle,
};

const statusIcons: Record<number, LucideIcon> = {
  401: ShieldX,
  403: ShieldX,
  404: Search,
  405: Ban,
  408: Clock,
  429: Clock,
};

function getIcon(errorDef: HttpErrorDefinition): LucideIcon {
  return statusIcons[errorDef.status] ?? categoryIcons[errorDef.category];
}

export function ErrorView({ error, title, message, className, onRetry, onBack }: ErrorViewProps) {
  const errorDef = resolveHttpError(error ?? "unknown");
  const Icon = getIcon(errorDef);
  const displayTitle = title ?? errorDef.title;
  const displayMessage = message ?? errorDef.message;
  const showStatusBadge = errorDef.status > 0;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800",
        className,
      )}
      role="alert"
    >
      <div className="rounded-full bg-error/10 p-3">
        <Icon className="h-8 w-8 text-error" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          {showStatusBadge && (
            <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-mono font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              {errorDef.status}
            </span>
          )}
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {displayTitle}
          </h2>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{displayMessage}</p>
      </div>
      <div className="flex gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            Go Back
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

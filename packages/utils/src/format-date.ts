import { TIME_THRESHOLDS } from "@repo/config";

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < TIME_THRESHOLDS.justNowSeconds) return "just now";
  if (diffMin < TIME_THRESHOLDS.minutesInHour) return `${diffMin}m ago`;
  if (diffHour < TIME_THRESHOLDS.hoursInDay) return `${diffHour}h ago`;
  if (diffDay < TIME_THRESHOLDS.daysInMonth) return `${diffDay}d ago`;
  return formatDate(date);
}

import type { HttpErrorDefinition } from "../types";
import * as ErrorCodes from "../codes";

const ERROR_MAP: Record<number, HttpErrorDefinition> = {};

for (const def of Object.values(ErrorCodes)) {
  if (def.status >= 0) {
    ERROR_MAP[def.status] = def;
  }
}

export function resolveHttpError(error: number | Error | string): HttpErrorDefinition {
  if (typeof error === "number") {
    return ERROR_MAP[error] ?? { ...ErrorCodes.UNKNOWN_ERROR, status: error };
  }

  const msg = typeof error === "string" ? error : error.message;

  if (
    msg.toLowerCase().includes("failed to fetch") ||
    msg.toLowerCase().includes("network") ||
    msg.toLowerCase().includes("err_connection") ||
    msg.toLowerCase().includes("abort")
  ) {
    return ErrorCodes.NETWORK_ERROR;
  }

  const statusMatch = msg.match(/\b([4-5]\d{2})\b/);
  if (statusMatch) {
    const status = parseInt(statusMatch[1]!, 10);
    return ERROR_MAP[status] ?? { ...ErrorCodes.UNKNOWN_ERROR, status };
  }

  return ErrorCodes.UNKNOWN_ERROR;
}

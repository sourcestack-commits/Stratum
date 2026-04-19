import type { HttpErrorDefinition } from "../types";

// ─── 4xx Client Errors ───────────────────────────────────────

export const BAD_REQUEST: HttpErrorDefinition = {
  status: 400,
  title: "Bad Request",
  message: "The request was invalid or cannot be processed.",
  category: "client",
};

export const UNAUTHORIZED: HttpErrorDefinition = {
  status: 401,
  title: "Unauthorized",
  message: "You need to sign in to access this resource.",
  category: "client",
};

export const FORBIDDEN: HttpErrorDefinition = {
  status: 403,
  title: "Forbidden",
  message: "You don't have permission to access this resource.",
  category: "client",
};

export const NOT_FOUND: HttpErrorDefinition = {
  status: 404,
  title: "Not Found",
  message: "The page or resource you're looking for doesn't exist.",
  category: "client",
};

export const METHOD_NOT_ALLOWED: HttpErrorDefinition = {
  status: 405,
  title: "Method Not Allowed",
  message: "This action is not supported for the requested resource.",
  category: "client",
};

export const REQUEST_TIMEOUT: HttpErrorDefinition = {
  status: 408,
  title: "Request Timeout",
  message: "The server took too long to respond. Please try again.",
  category: "client",
};

export const CONFLICT: HttpErrorDefinition = {
  status: 409,
  title: "Conflict",
  message: "The request conflicts with the current state of the resource.",
  category: "client",
};

export const PAYLOAD_TOO_LARGE: HttpErrorDefinition = {
  status: 413,
  title: "Payload Too Large",
  message: "The file or data you're sending is too large.",
  category: "client",
};

export const VALIDATION_ERROR: HttpErrorDefinition = {
  status: 422,
  title: "Validation Error",
  message: "The submitted data is invalid. Please check your input.",
  category: "client",
};

export const TOO_MANY_REQUESTS: HttpErrorDefinition = {
  status: 429,
  title: "Too Many Requests",
  message: "You've made too many requests. Please wait and try again.",
  category: "client",
};

// ─── 5xx Server Errors ───────────────────────────────────────

export const INTERNAL_SERVER_ERROR: HttpErrorDefinition = {
  status: 500,
  title: "Internal Server Error",
  message: "Something went wrong on our end. Please try again later.",
  category: "server",
};

export const BAD_GATEWAY: HttpErrorDefinition = {
  status: 502,
  title: "Bad Gateway",
  message: "The server received an invalid response. Please try again.",
  category: "server",
};

export const SERVICE_UNAVAILABLE: HttpErrorDefinition = {
  status: 503,
  title: "Service Unavailable",
  message: "The service is temporarily unavailable. Please try again shortly.",
  category: "server",
};

export const GATEWAY_TIMEOUT: HttpErrorDefinition = {
  status: 504,
  title: "Gateway Timeout",
  message: "The server didn't respond in time. Please try again.",
  category: "server",
};

// ─── Non-HTTP Errors ─────────────────────────────────────────

export const NETWORK_ERROR: HttpErrorDefinition = {
  status: 0,
  title: "Connection Lost",
  message: "Unable to reach the server. Check your internet connection.",
  category: "network",
};

export const UNKNOWN_ERROR: HttpErrorDefinition = {
  status: -1,
  title: "Something Went Wrong",
  message: "An unexpected error occurred.",
  category: "unknown",
};

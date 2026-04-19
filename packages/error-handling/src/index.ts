// Types
export type {
  ErrorCategory,
  HttpErrorDefinition,
  ErrorViewProps,
  ErrorBoundaryProps,
  ErrorBoundaryState,
  GlobalErrorHandlerOptions,
  ErrorProviderProps,
  NotFoundPageProps,
} from "./types";

// Error Codes
export {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  METHOD_NOT_ALLOWED,
  REQUEST_TIMEOUT,
  CONFLICT,
  PAYLOAD_TOO_LARGE,
  VALIDATION_ERROR,
  TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR,
  BAD_GATEWAY,
  SERVICE_UNAVAILABLE,
  GATEWAY_TIMEOUT,
  NETWORK_ERROR,
  UNKNOWN_ERROR,
} from "./codes";

// Resolver
export { resolveHttpError } from "./resolver";

// Components
export { ErrorView } from "./components";
export { ErrorBoundary } from "./components";

// Hooks
export { useGlobalErrorHandler, emitGlobalError } from "./hooks";
export { useErrorHandler } from "./hooks";

// Providers
export { GlobalErrorProvider } from "./providers";

// Pages
export { NotFoundPage } from "./pages";
export { ErrorPage } from "./pages";

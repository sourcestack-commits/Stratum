import { Component, type ErrorInfo, type ReactNode } from "react";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "../types";
import { ErrorView } from "./error-view";

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorView error={this.state.error ?? "unknown"} onRetry={this.handleReset} />;
    }
    return this.props.children;
  }
}

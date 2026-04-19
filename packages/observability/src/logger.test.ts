import { describe, it, expect, vi } from "vitest";
import { logger } from "./logger";

describe("logger", () => {
  it("logs info messages", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    logger.info("test message");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("logs error messages", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("error message");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("redacts sensitive data", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    logger.info("login", { email: "test@test.com", password: "secret123" });
    const loggedData = spy.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(loggedData?.password).toBe("[REDACTED]");
    expect(loggedData?.email).toBe("test@test.com");
    spy.mockRestore();
  });

  it("redacts nested sensitive data", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    logger.info("auth", { user: { token: "abc123", name: "Alice" } });
    const loggedData = spy.mock.calls[0]?.[1] as Record<string, unknown>;
    const user = loggedData?.user as Record<string, unknown>;
    expect(user?.token).toBe("[REDACTED]");
    expect(user?.name).toBe("Alice");
    spy.mockRestore();
  });
});

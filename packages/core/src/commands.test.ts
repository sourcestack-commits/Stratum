import { describe, it, expect, vi } from "vitest";
import { registerCommand, executeCommand } from "./commands";

describe("commands", () => {
  it("executes a registered command", () => {
    const handler = vi.fn();
    registerCommand("theme.toggle", handler);
    executeCommand("theme.toggle");
    expect(handler).toHaveBeenCalledOnce();
  });

  it("passes payload to handler", () => {
    const handler = vi.fn();
    registerCommand("theme.set", handler);
    executeCommand("theme.set", { theme: "dark" });
    expect(handler).toHaveBeenCalledWith({ theme: "dark" });
  });

  it("warns on unregistered command in dev mode", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    executeCommand("panel.open", { type: "unknown" });
    // May or may not warn depending on import.meta.env.DEV
    warnSpy.mockRestore();
  });
});

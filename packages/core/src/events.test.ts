import { describe, it, expect, vi } from "vitest";
import { emit, on } from "./events";

describe("events", () => {
  it("calls listener when event is emitted", () => {
    const handler = vi.fn();
    on("panel.opened", handler);
    emit("panel.opened", { type: "dashboard" });
    expect(handler).toHaveBeenCalledWith({ type: "dashboard" });
  });

  it("supports multiple listeners", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    on("panel.closed", handler1);
    on("panel.closed", handler2);
    emit("panel.closed", { type: "settings" });
    expect(handler1).toHaveBeenCalledOnce();
    expect(handler2).toHaveBeenCalledOnce();
  });

  it("returns unsubscribe function", () => {
    const handler = vi.fn();
    const unsub = on("panel.opened", handler);
    unsub();
    emit("panel.opened", { type: "dashboard" });
    expect(handler).not.toHaveBeenCalled();
  });
});

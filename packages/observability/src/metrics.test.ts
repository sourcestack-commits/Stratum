import { describe, it, expect } from "vitest";
import { metrics } from "./metrics";

describe("metrics", () => {
  it("increments a counter", () => {
    metrics.increment("test.counter");
    expect(metrics.get("test.counter")).toBeGreaterThanOrEqual(1);
  });

  it("increments by custom amount", () => {
    const before = metrics.get("test.custom");
    metrics.increment("test.custom", 5);
    expect(metrics.get("test.custom")).toBe(before + 5);
  });

  it("returns 0 for unknown counters", () => {
    expect(metrics.get("nonexistent.counter." + Date.now())).toBe(0);
  });

  it("returns all counters", () => {
    metrics.increment("test.getall");
    const all = metrics.getAll();
    expect(all).toHaveProperty("test.getall");
  });
});

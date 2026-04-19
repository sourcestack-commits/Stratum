import { describe, it, expect, beforeEach } from "vitest";
import { useLayoutStore } from "./layout.store";

describe("layoutStore", () => {
  beforeEach(() => {
    useLayoutStore.setState({
      sidebarOpen: true,
      theme: "system",
      activePanels: [],
    });
  });

  it("toggles sidebar", () => {
    useLayoutStore.getState().toggleSidebar();
    expect(useLayoutStore.getState().sidebarOpen).toBe(false);
    useLayoutStore.getState().toggleSidebar();
    expect(useLayoutStore.getState().sidebarOpen).toBe(true);
  });

  it("sets theme", () => {
    useLayoutStore.getState().setTheme("dark");
    expect(useLayoutStore.getState().theme).toBe("dark");
  });

  it("opens and closes panels", () => {
    useLayoutStore.getState().openPanel("dashboard");
    expect(useLayoutStore.getState().activePanels).toHaveLength(1);
    expect(useLayoutStore.getState().activePanels[0]?.type).toBe("dashboard");

    useLayoutStore.getState().closePanel("dashboard");
    expect(useLayoutStore.getState().activePanels).toHaveLength(0);
  });

  it("does not duplicate panels", () => {
    useLayoutStore.getState().openPanel("dashboard");
    useLayoutStore.getState().openPanel("dashboard");
    expect(useLayoutStore.getState().activePanels).toHaveLength(1);
  });
});

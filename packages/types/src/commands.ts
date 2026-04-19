export type CommandMap = {
  "auth.login": { email: string; password: string };
  "auth.logout": void;
  "auth.signup": { email: string; password: string; name: string };
  "panel.open": { type: string; props?: Record<string, unknown> };
  "panel.close": { type: string };
  "cad.select-tool": { tool: string };
  "cad.zoom": { level: number };
  "cad.save": void;
  "theme.toggle": void;
  "theme.set": { theme: "light" | "dark" | "system" };
};

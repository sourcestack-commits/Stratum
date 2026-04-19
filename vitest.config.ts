import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["packages/**/src/**/*.test.{ts,tsx}", "packages/features/**/src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["packages/**/src/**/*.{ts,tsx}"],
      exclude: ["**/*.stories.tsx", "**/*.test.{ts,tsx}", "**/index.ts"],
    },
  },
});

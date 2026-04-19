import type { Config } from "tailwindcss";
import { tailwindPreset } from "@repo/tokens";

const config: Config = {
  presets: [tailwindPreset as Config],
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [],
};
export default config;

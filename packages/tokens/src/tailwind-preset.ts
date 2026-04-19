import type { Config } from "tailwindcss";
import { colors } from "./colors";
import { spacing } from "./spacing";
import { fontFamily, fontSize } from "./typography";
import { radius } from "./radius";

export const tailwindPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        neutral: colors.neutral,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
      },
      spacing,
      fontFamily: {
        sans: [...fontFamily.sans],
        mono: [...fontFamily.mono],
      },
      fontSize: fontSize as unknown as Record<string, string>,
      borderRadius: radius,
    },
  },
};

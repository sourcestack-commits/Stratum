import js from "@eslint/js";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      boundaries,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    settings: {
      "boundaries/elements": [
        { type: "apps", pattern: "apps/*" },
        { type: "features", pattern: "packages/features/*" },
        { type: "design-system", pattern: "packages/design-system/*" },
        { type: "store", pattern: "packages/store/*" },
        { type: "core", pattern: "packages/core/*" },
        { type: "services", pattern: "packages/services/*" },
        { type: "registry", pattern: "packages/registry/*" },
        { type: "observability", pattern: "packages/observability/*" },
        { type: "tokens", pattern: "packages/tokens/*" },
        { type: "config", pattern: "packages/config/*" },
        { type: "types", pattern: "packages/types/*" },
        { type: "utils", pattern: "packages/utils/*" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "apps",
              allow: [
                "features",
                "design-system",
                "store",
                "core",
                "services",
                "registry",
                "observability",
                "tokens",
                "config",
                "types",
                "utils",
              ],
            },
            {
              from: "features",
              allow: ["design-system", "store", "core", "services", "config", "types", "utils"],
            },
            { from: "design-system", allow: ["tokens", "types", "utils"] },
            { from: "store", allow: ["core", "types", "utils"] },
            {
              from: "core",
              allow: ["services", "observability", "config", "types", "utils"],
            },
            { from: "services", allow: ["config", "types", "utils"] },
            { from: "observability", allow: ["config", "types", "utils"] },
            {
              from: "registry",
              allow: ["features", "design-system", "types"],
            },
            { from: "tokens", allow: ["types"] },
            { from: "config", allow: ["types", "utils"] },
            { from: "utils", allow: ["types"] },
            { from: "types", allow: [] },
          ],
        },
      ],
    },
  },
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.turbo/**"],
  },
];

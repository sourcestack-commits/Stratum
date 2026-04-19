import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // Generator: Create a new app
  plop.setGenerator("app", {
    description: "Create a new app in the monorepo",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "App name (e.g. my-app):",
      },
      {
        type: "list",
        name: "type",
        message: "App type:",
        choices: ["web", "desktop"],
      },
    ],
    actions: () => {
      return [
        {
          type: "addMany",
          destination: "apps/{{name}}",
          templateFiles: "templates/app/**/*",
          base: "templates/app",
        },
      ];
    },
  });

  // Generator: Create a new package
  plop.setGenerator("package", {
    description: "Create a new shared package",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Package name (e.g. analytics, notifications):",
      },
      {
        type: "list",
        name: "type",
        message: "Package type:",
        choices: [
          { name: "Basic (types + utils only)", value: "basic" },
          { name: "React (with React components)", value: "react" },
          { name: "Store (Zustand state)", value: "store" },
        ],
      },
    ],
    actions: (data) => {
      const templateMap: Record<string, string> = {
        basic: "templates/package-basic/**/*",
        react: "templates/package-react/**/*",
        store: "templates/package-store/**/*",
      };
      const template =
        templateMap[(data as { type: string }).type] ?? "templates/package-basic/**/*";
      return [
        {
          type: "addMany",
          destination: "packages/{{name}}",
          templateFiles: template,
          base: template.replace("/**/*", ""),
        },
      ];
    },
  });

  // Generator: Create a new feature
  plop.setGenerator("feature", {
    description: "Create a new feature module",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Feature name (e.g. billing, notifications):",
      },
    ],
    actions: () => {
      return [
        {
          type: "addMany",
          destination: "packages/features/{{name}}",
          templateFiles: "templates/feature/**/*",
          base: "templates/feature",
        },
      ];
    },
  });

  // Generator: Create a new design-system component
  plop.setGenerator("component", {
    description: "Create a new design-system component with story",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (e.g. badge, avatar, tabs):",
      },
      {
        type: "list",
        name: "type",
        message: "Component category:",
        choices: [
          { name: "Component (Button, Card, etc.)", value: "components" },
          { name: "Primitive (Box, Stack, etc.)", value: "primitives" },
          { name: "Typography (H1, Text, etc.)", value: "typography" },
        ],
      },
    ],
    actions: () => {
      return [
        {
          type: "add",
          path: "packages/design-system/src/{{type}}/{{dashCase name}}.tsx",
          templateFile: "templates/component/component.tsx.hbs",
        },
        {
          type: "add",
          path: "packages/design-system/src/{{type}}/{{dashCase name}}.stories.tsx",
          templateFile: "templates/component/component.stories.tsx.hbs",
        },
      ];
    },
  });
}

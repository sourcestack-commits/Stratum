# Skill: /new-component

Create a new design-system component with Storybook story following all standards.

## When to Use

Run `/new-component [name]` when adding a reusable UI component (e.g., badge, avatar, tabs, sidebar).

## Steps

### 1. Generate the Component

```bash
pnpm gen:component
# Enter name and category (Component / Primitive / Typography)
```

### 2. Implement the Component

File: `packages/design-system/src/{category}/{name}.tsx`

Follow this pattern:

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";

const {name}Variants = cva("base-classes", {
  variants: {
    variant: {
      default: "light-classes dark:bg-neutral-800 dark:text-neutral-50",
      // more variants
    },
    size: {
      default: "size-classes",
      sm: "small-classes",
      lg: "large-classes",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface {Name}Props
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof {name}Variants> {}

export const {Name} = forwardRef<HTMLDivElement, {Name}Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn({name}Variants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
{Name}.displayName = "{Name}";
```

### 3. Dark Mode Rules

```
Surface background:  dark:bg-neutral-800
Borders:             dark:border-neutral-700
Primary text:        dark:text-neutral-50
Muted text:          dark:text-neutral-400
Ring offset:         dark:ring-offset-neutral-900
```

Never use `dark:bg-neutral-950` for components. That's page-level only.

### 4. Write the Story

File: `packages/design-system/src/{category}/{name}.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { {Name} } from "./{name}";

const meta: Meta<typeof {Name}> = {
  title: "{Category}/{Name}",
  component: {Name},
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", ...],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof {Name}>;

export const Default: Story = {
  args: { children: "{Name}" },
};

// Add variant stories
```

### 5. Export the Component

Add to `packages/design-system/src/{category}/index.ts`:

```ts
export { {Name} } from "./{name}";
```

Add to `packages/design-system/src/index.ts`:

```ts
export { {Name} } from "./{category}";
```

### 6. Verify

```bash
pnpm storybook    # Check component renders in Storybook
pnpm type-check   # No TypeScript errors
```

## Rules

- Under 300 lines
- Named export, not default
- `forwardRef` for DOM elements
- `displayName` set
- `cn()` from `@repo/utils` for class merging
- CVA for variants
- No business logic
- No data fetching
- No store access

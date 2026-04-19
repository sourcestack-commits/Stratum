import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "./stack";

const meta: Meta<typeof Stack> = {
  title: "Primitives/Stack",
  component: Stack,
  tags: ["autodocs"],
  argTypes: {
    gap: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  args: { gap: "md" },
  render: (args) => (
    <Stack {...args}>
      <div className="bg-primary-100 p-4 rounded">Item 1</div>
      <div className="bg-primary-200 p-4 rounded">Item 2</div>
      <div className="bg-primary-300 p-4 rounded">Item 3</div>
    </Stack>
  ),
};

export const SmallGap: Story = {
  args: { gap: "xs" },
  render: (args) => (
    <Stack {...args}>
      <div className="bg-primary-100 p-2 rounded">Item 1</div>
      <div className="bg-primary-200 p-2 rounded">Item 2</div>
      <div className="bg-primary-300 p-2 rounded">Item 3</div>
    </Stack>
  ),
};

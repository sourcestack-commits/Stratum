import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./text";

const meta: Meta<typeof Text> = {
  title: "Typography/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "muted", "error", "success"] },
    size: { control: "select", options: ["xs", "sm", "base", "lg", "xl"] },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: { children: "Default body text" },
};

export const Muted: Story = {
  args: { children: "Muted helper text", variant: "muted" },
};

export const Error: Story = {
  args: { children: "Error message", variant: "error" },
};

export const Success: Story = {
  args: { children: "Success message", variant: "success" },
};

export const Small: Story = {
  args: { children: "Small text", size: "sm" },
};

import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "./flex";

const meta: Meta<typeof Flex> = {
  title: "Primitives/Flex",
  component: Flex,
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "select", options: ["row", "col", "rowReverse", "colReverse"] },
    align: { control: "select", options: ["start", "center", "end", "stretch", "baseline"] },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
    gap: { control: "select", options: ["none", "xs", "sm", "md", "lg", "xl"] },
  },
};

export default meta;
type Story = StoryObj<typeof Flex>;

export const Row: Story = {
  args: { gap: "md", align: "center" },
  render: (args) => (
    <Flex {...args}>
      <div className="bg-primary-100 p-4 rounded">A</div>
      <div className="bg-primary-200 p-4 rounded">B</div>
      <div className="bg-primary-300 p-4 rounded">C</div>
    </Flex>
  ),
};

export const SpaceBetween: Story = {
  args: { justify: "between", align: "center", className: "w-full" },
  render: (args) => (
    <Flex {...args}>
      <div className="bg-primary-100 p-4 rounded">Left</div>
      <div className="bg-primary-300 p-4 rounded">Right</div>
    </Flex>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { H1, H2, H3 } from "./heading";

const meta: Meta<typeof H1> = {
  title: "Typography/Heading",
  component: H1,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof H1>;

export const Heading1: Story = {
  render: () => <H1>Heading 1</H1>,
};

export const Heading2: Story = {
  render: () => <H2>Heading 2</H2>,
};

export const Heading3: Story = {
  render: () => <H3>Heading 3</H3>,
};

export const AllHeadings: Story = {
  render: () => (
    <div className="space-y-4">
      <H1>Heading 1 — Page Title</H1>
      <H2>Heading 2 — Section Title</H2>
      <H3>Heading 3 — Subsection</H3>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { Toaster, toast } from "./toast";
import { Button } from "./button";

const meta: Meta<typeof Toaster> = {
  title: "Components/Toast",
  component: Toaster,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button onClick={() => toast("Default notification")}>Default</Button>
      <Button variant="outline" onClick={() => toast.success("Operation successful!")}>
        Success
      </Button>
      <Button variant="destructive" onClick={() => toast.error("Something went wrong!")}>
        Error
      </Button>
      <Button variant="secondary" onClick={() => toast.warning("Please be careful")}>
        Warning
      </Button>
    </div>
  ),
};

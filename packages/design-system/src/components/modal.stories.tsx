import type { Meta, StoryObj } from "@storybook/react";
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle } from "./modal";
import { Button } from "./button";

const meta: Meta = {
  title: "Components/Modal",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
        </ModalHeader>
        <p className="text-sm text-neutral-500">
          This is the modal content. You can put anything here.
        </p>
      </ModalContent>
    </Modal>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit Profile</ModalTitle>
        </ModalHeader>
        <div className="grid gap-4 py-4">
          <input
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Name"
          />
          <input
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Email"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </div>
      </ModalContent>
    </Modal>
  ),
};

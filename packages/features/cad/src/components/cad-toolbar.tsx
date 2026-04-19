import { Button, Flex } from "@repo/design-system";
import type { CadTool } from "@repo/types";
import { useCadTools } from "../hooks/use-cad-tools";

const tools: { id: CadTool; label: string }[] = [
  { id: "select", label: "Select" },
  { id: "line", label: "Line" },
  { id: "rect", label: "Rectangle" },
  { id: "circle", label: "Circle" },
  { id: "text", label: "Text" },
  { id: "pan", label: "Pan" },
];

export function CadToolbar() {
  const { selectedTool, handleSelectTool } = useCadTools();
  return (
    <Flex gap="xs" className="border-b border-neutral-200 p-2 dark:border-neutral-800">
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={selectedTool === tool.id ? "default" : "ghost"}
          size="sm"
          onClick={() => handleSelectTool(tool.id)}
        >
          {tool.label}
        </Button>
      ))}
    </Flex>
  );
}

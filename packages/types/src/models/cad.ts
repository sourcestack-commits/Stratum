export interface CadProject {
  id: string;
  name: string;
  description?: string;
  layers: CadLayer[];
  createdAt: string;
  updatedAt: string;
}

export interface CadLayer {
  id: string;
  name: string;
  isVisible: boolean;
  isLocked: boolean;
  elements: CadElement[];
}

export interface CadElement {
  id: string;
  type: "line" | "rect" | "circle" | "path" | "text";
  x: number;
  y: number;
  width?: number;
  height?: number;
  properties: Record<string, unknown>;
}

export type CadTool = "select" | "line" | "rect" | "circle" | "path" | "text" | "pan" | "zoom";

import type { CadProject } from "@repo/types";

export const MOCK_PROJECTS: CadProject[] = [
  {
    id: "prj_001",
    name: "Building A - Floor Plan",
    description: "Main office building floor plan",
    layers: [
      {
        id: "lyr_001",
        name: "Walls",
        isVisible: true,
        isLocked: false,
        elements: [],
      },
      {
        id: "lyr_002",
        name: "Doors & Windows",
        isVisible: true,
        isLocked: false,
        elements: [],
      },
      {
        id: "lyr_003",
        name: "Furniture",
        isVisible: true,
        isLocked: false,
        elements: [],
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-20T14:30:00Z",
  },
  {
    id: "prj_002",
    name: "Office Layout v2",
    description: "Second floor office redesign",
    layers: [
      {
        id: "lyr_004",
        name: "Structure",
        isVisible: true,
        isLocked: true,
        elements: [],
      },
      {
        id: "lyr_005",
        name: "Electrical",
        isVisible: false,
        isLocked: false,
        elements: [],
      },
    ],
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-03-25T11:00:00Z",
  },
];

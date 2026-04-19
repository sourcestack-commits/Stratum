import { http, HttpResponse, delay } from "msw";
import { MOCK_PROJECTS } from "../data/cad";

const BASE = "*/cad";

export const cadHandlers = [
  http.get(`${BASE}/projects`, async () => {
    await delay(400);
    return HttpResponse.json(MOCK_PROJECTS);
  }),

  http.get(`${BASE}/projects/:id`, async ({ params }) => {
    await delay(300);
    const project = MOCK_PROJECTS.find((p) => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ message: "Project not found" }, { status: 404 });
    }
    return HttpResponse.json(project);
  }),

  http.put(`${BASE}/projects/:id`, async ({ params, request }) => {
    await delay(400);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...body, id: params.id, updatedAt: new Date().toISOString() });
  }),

  http.delete(`${BASE}/projects/:id`, async () => {
    await delay(300);
    return HttpResponse.json({ success: true });
  }),
];

import { http, HttpResponse, delay } from "msw";
import { getSession } from "../data/users";

const BASE = "*/user";

export const userHandlers = [
  http.get(`${BASE}/profile`, async () => {
    await delay(300);
    const session = getSession();
    if (!session) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json(session.user);
  }),

  http.patch(`${BASE}/profile`, async ({ request }) => {
    await delay(400);
    const session = getSession();
    if (!session) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const updates = (await request.json()) as Record<string, unknown>;
    const updated = { ...session.user, ...updates };
    return HttpResponse.json(updated);
  }),
];

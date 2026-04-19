import { http, HttpResponse, delay } from "msw";
import { MOCK_USERS, createSession, getSession, setSession } from "../data/users";

const BASE = "*/auth";

export const authHandlers = [
  http.post(`${BASE}/login`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { email: string; password: string };

    const found = MOCK_USERS.find((u) => u.email === body.email && u.password === body.password);

    if (!found) {
      return HttpResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const session = createSession(found.user);
    return HttpResponse.json(session);
  }),

  http.post(`${BASE}/signup`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { email: string; password: string; name: string };

    const exists = MOCK_USERS.find((u) => u.email === body.email);
    if (exists) {
      return HttpResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      email: body.email,
      name: body.name,
      role: "user" as const,
      avatarUrl: undefined,
      createdAt: new Date().toISOString(),
    };

    const session = createSession(newUser);
    return HttpResponse.json(session);
  }),

  http.post(`${BASE}/logout`, async () => {
    await delay(200);
    setSession(null);
    return HttpResponse.json({ success: true });
  }),

  http.get(`${BASE}/session`, async () => {
    await delay(300);
    const session = getSession();
    if (!session) {
      return HttpResponse.json(null, { status: 401 });
    }
    return HttpResponse.json(session);
  }),
];

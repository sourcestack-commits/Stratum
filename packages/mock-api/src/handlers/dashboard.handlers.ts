import { http, HttpResponse, delay } from "msw";
import { MOCK_STATS, MOCK_ACTIVITY } from "../data/dashboard";

const BASE = "*/dashboard";

export const dashboardHandlers = [
  http.get(`${BASE}/stats`, async () => {
    await delay(400);
    return HttpResponse.json(MOCK_STATS);
  }),

  http.get(`${BASE}/activity`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);
    return HttpResponse.json(MOCK_ACTIVITY.slice(0, limit));
  }),
];

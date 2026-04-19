import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/auth.handlers";
import { dashboardHandlers } from "./handlers/dashboard.handlers";
import { cadHandlers } from "./handlers/cad.handlers";
import { userHandlers } from "./handlers/user.handlers";

export const worker = setupWorker(
  ...authHandlers,
  ...dashboardHandlers,
  ...cadHandlers,
  ...userHandlers,
);

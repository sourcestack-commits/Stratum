import { useNavigate, useLocation } from "react-router-dom";
import { Box, H3, Button } from "@repo/design-system";
import { useLayoutStore } from "@repo/store";
import { getAppName } from "@repo/config";
import type { LayoutProps } from "../types";

export function Layout({ children }: LayoutProps) {
  const sidebarOpen = useLayoutStore((s) => s.sidebarOpen);
  const navigate = useNavigate();
  const location = useLocation();

  function isActive(path: string): boolean {
    return location.pathname === path;
  }

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <aside className="w-64 border-r border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <H3 className="mb-6">{getAppName()}</H3>
          <nav className="flex flex-col gap-1">
            <Button
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant={isActive("/users") ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => navigate("/users")}
            >
              Users
            </Button>
            <Button
              variant={isActive("/settings") ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => navigate("/settings")}
            >
              Settings
            </Button>
          </nav>
        </aside>
      )}
      <Box as="main" className="flex-1 overflow-auto">
        {children}
      </Box>
    </div>
  );
}

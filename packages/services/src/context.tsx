import { createContext, useContext, useState, useEffect } from "react";
import { detectPlatform } from "@repo/config";
import type { Services, ServiceProviderProps } from "./types";
import { webAuthService, webCadService, webDashboardService, webUserService } from "./platform/web";

const ServiceContext = createContext<Services | null>(null);

function createWebServices(): Services {
  return {
    auth: webAuthService,
    cad: webCadService,
    dashboard: webDashboardService,
    user: webUserService,
  };
}

async function createTauriServices(): Promise<Services> {
  const tauri = await import("./platform/tauri");
  return {
    auth: tauri.tauriAuthService,
    cad: tauri.tauriCadService,
    dashboard: tauri.tauriDashboardService,
    user: tauri.tauriUserService,
  };
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const [services, setServices] = useState<Services | null>(() => {
    if (detectPlatform() === "web") return createWebServices();
    return null;
  });

  useEffect(() => {
    if (detectPlatform() === "tauri") {
      createTauriServices().then(setServices);
    }
  }, []);

  if (!services) return null;

  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>;
}

export function useServices(): Services {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("useServices must be used within ServiceProvider");
  return ctx;
}

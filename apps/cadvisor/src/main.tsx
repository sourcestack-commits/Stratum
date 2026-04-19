import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PlatformProvider } from "@repo/core";
import { ThemeProvider, Toaster } from "@repo/design-system";
import { APP_DEFAULTS } from "@repo/config";
import { App } from "./app/app";
import "./globals.css";

async function startApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import("@repo/mock-api");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <PlatformProvider>
        <ThemeProvider
          defaultTheme={APP_DEFAULTS.defaultTheme}
          storageKey={APP_DEFAULTS.themeStorageKey}
        >
          <App />
          <Toaster />
        </ThemeProvider>
      </PlatformProvider>
    </StrictMode>,
  );
}

startApp();

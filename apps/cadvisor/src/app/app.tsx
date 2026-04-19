import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "@repo/feature-auth";
import { DashboardPage } from "@repo/feature-dashboard";
import { CadCanvas, CadToolbar, CadLayerPanel } from "@repo/feature-cad";
import { SettingsPage } from "@repo/feature-settings";
import { GlobalErrorProvider, NotFoundPage } from "@repo/error-handling";
import { Layout } from "./layout";

function CadPage() {
  return (
    <div className="flex h-full flex-col">
      <CadToolbar />
      <div className="flex flex-1">
        <CadLayerPanel />
        <CadCanvas />
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <GlobalErrorProvider>
        <AuthGuard>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<CadPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage redirectTo="/dashboard" />} />
            </Routes>
          </Layout>
        </AuthGuard>
      </GlobalErrorProvider>
    </BrowserRouter>
  );
}

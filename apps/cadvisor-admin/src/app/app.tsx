import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "@repo/feature-auth";
import { DashboardPage } from "@repo/feature-dashboard";
import { SettingsPage } from "@repo/feature-settings";
import { GlobalErrorProvider, NotFoundPage } from "@repo/error-handling";
import { Layout } from "./layout";

export function App() {
  return (
    <BrowserRouter>
      <GlobalErrorProvider>
        <AuthGuard>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/users"
                element={<div className="p-6">User Management — Coming Soon</div>}
              />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage redirectTo="/dashboard" />} />
            </Routes>
          </Layout>
        </AuthGuard>
      </GlobalErrorProvider>
    </BrowserRouter>
  );
}

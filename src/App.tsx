import { Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { WorkspaceShell } from "@/components/overtrue/workspace/shell";
import { WorkspaceSurface } from "@/components/overtrue/workspace/primitives";
import { ToastProviderBridge } from "@/components/ui/toast";
import { workspacePages } from "@/data/workspace/routes";
import pages from "@/data/workspace/pages.json";

const aliases: Record<string, string> = {
  "/blank": "/empty",
  "/calendar": "/fullcalendar",
  "/dashboard/crypto": "/operations-overview",
  "/dashboard/crm": "/client-overview",
  "/forms/form-elements": "/form-elements",
  "/forms/form-layout": "/form-layout",
  "/auth/sign-in": "/sign-in",
  "/auth/sign-up": "/sign-up",
  "/auth/forgot-password": "/forgot-password",
  "/auth/lock": "/auth-lock",
};
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = `${pages.find((page) => page.path === pathname)?.title ?? "Components"} - overtrue/ui`;
  }, [pathname]);
  return (
    <ToastProviderBridge>
      <Suspense
        fallback={
          <div
            className="workspace-loading"
            role="status"
            aria-label="Loading page"
          />
        }
      >
        <Routes>
          {pages.map((meta) => {
            const Page =
              workspacePages[meta.path as keyof typeof workspacePages];
            return (
              <Route
                key={meta.path}
                path={meta.path}
                element={
                  <WorkspaceShell bare={meta.bare} layout={meta.layout}>
                    <WorkspaceSurface key={meta.path}>
                      <Page />
                    </WorkspaceSurface>
                  </WorkspaceShell>
                }
              />
            );
          })}
          {Object.entries(aliases).map(([from, to]) => (
            <Route
              key={from}
              path={from}
              element={<Navigate to={to} replace />}
            />
          ))}
          {pages.map((meta) => (
            <Route
              key={meta.file}
              path={`/${meta.file}`}
              element={<Navigate to={meta.path} replace />}
            />
          ))}
          <Route path="*" element={<Navigate to="/error-404" replace />} />
        </Routes>
      </Suspense>
    </ToastProviderBridge>
  );
}

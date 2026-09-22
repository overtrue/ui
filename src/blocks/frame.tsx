"use client";
import type { ReactNode } from "react";
import { MemoryRouter, useInRouterContext } from "react-router-dom";
import { WorkspaceSurface } from "@/components/overtrue/workspace/primitives";
import { ToastProviderBridge } from "@/components/ui/toast";

/** Each installed card owns its interaction state and can also use an app router. */
export function BlockFrame({ children }: { children: ReactNode }) {
  const inRouter = useInRouterContext();
  const content = (
    <div className="overtrue-workspace overtrue-block scene">
      <ToastProviderBridge>
        <WorkspaceSurface>{children}</WorkspaceSurface>
      </ToastProviderBridge>
    </div>
  );
  return inRouter ? content : <MemoryRouter>{content}</MemoryRouter>;
}

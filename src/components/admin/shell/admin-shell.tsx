"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="adm">
      <div className="grid min-h-screen lg:grid-cols-[248px_1fr]">
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-col">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="w-full flex-1 px-4 py-6 lg:px-7 lg:py-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

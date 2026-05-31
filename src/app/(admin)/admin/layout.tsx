"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AdminShell } from "@/components/admin/shell/admin-shell";
import { getQueryClient } from "@/lib/admin/query-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={getQueryClient()}>
        <AdminShell>{children}</AdminShell>
        <Toaster position="top-right" richColors closeButton />
        {process.env.NODE_ENV === "development" ? (
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        ) : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

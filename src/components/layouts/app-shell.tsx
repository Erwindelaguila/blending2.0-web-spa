"use client";

import type React from "react";
import { AppProviders } from "@/providers/app-providers";
import { AppLayout } from "@/components/layouts/app-layout";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AppProviders>
      <AppLayout>{children}</AppLayout>
    </AppProviders>
  )
}

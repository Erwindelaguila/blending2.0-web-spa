"use client";

import type React from "react";
import { AppThemeProvider } from "@/providers/theme-provider";
import { Provider } from "react-redux";
import { LoadingProvider } from "@/providers/loading-provider";
import { store } from "@/lib/store";

interface AppProvidersProps {
  children: React.ReactNode;
}
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LoadingProvider>
      <AppThemeProvider>
        <Provider store={store}> {children}</Provider>
      </AppThemeProvider>
    </LoadingProvider>
  );
}

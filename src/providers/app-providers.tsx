"use client"

import type React from "react"
import { AppThemeProvider } from "@/providers/theme-provider"
import { LoadingProvider } from "@/providers/loading-provider"

interface AppProvidersProps {
  children: React.ReactNode
}
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LoadingProvider>
      <AppThemeProvider>{children}</AppThemeProvider>
    </LoadingProvider>
  )
}

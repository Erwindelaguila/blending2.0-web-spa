"use client"

import { FluentProvider } from "@fluentui/react-components"
import type { ReactNode } from "react"
import { TASA_THEME } from "@/config/theme.config"

interface AppThemeProviderProps {
  children: ReactNode
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <FluentProvider theme={TASA_THEME} className="fluent-provider" style={{ minHeight: "100vh" }}>
      {children}
    </FluentProvider>
  )
}

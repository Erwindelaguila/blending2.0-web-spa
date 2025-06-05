"use client"

import { useState, useEffect, type ReactNode } from "react"
import { FluentProvider } from "@fluentui/react-components"
import { TASA_THEME } from "@/config/theme.config"

interface AppThemeProviderProps {
  readonly children: ReactNode
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  return (
    <FluentProvider 
      theme={TASA_THEME} 
      className="fluent-provider" 
      style={{ 
        minHeight: "100vh",
        visibility: "visible"
      }}
    >
      {children}
    </FluentProvider>
  )
}
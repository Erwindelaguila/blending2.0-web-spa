"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { usePathname } from "next/navigation"
import { AppThemeProvider } from "@/providers/theme-provider"
import { LoadingProvider } from "@/providers/loading-provider"
import { Sidebar } from "@/components/navigation/sidebar"
import { Header } from "@/components/navigation/header"
import { PageLoader } from "@/components/ui/page-loader"
import { AppSkeleton } from "@/components/ui/app-skeleton"
import { useProtectedNavigation } from "@/hooks/use-protected-navigation"

interface AppShellProps {
  children: React.ReactNode
}
function usePageLoader(pathname: string, isDashboard: boolean) {
  const [showPageLoader, setShowPageLoader] = useState(false)

  useEffect(() => {
    if (isDashboard) {
      setShowPageLoader(false)
      return
    }

    const isReload = typeof window !== "undefined" && window.performance?.navigation?.type === 1

    // Solo logs en desarrollo
    if (process.env.NODE_ENV === 'development') {
      if (isReload) {
        console.log("🔄 Recarga detectada (F5)")
      } else {
        console.log("🔄 Navegación a:", pathname)
      }
    }

    setShowPageLoader(true)

    const timer = setTimeout(
      () => {
        setShowPageLoader(false)
      },
      isReload ? 800 : 600,
    )

    return () => clearTimeout(timer)
  }, [pathname, isDashboard])

  return showPageLoader
}

// Hook para manejar el sidebar
function useSidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  return { sidebarCollapsed, toggleSidebar }
}

// Hook para manejar hidratación
function useClientSide() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

// Componente para layout del dashboard
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  )
}

// Componente para layout de la aplicación principal
interface AppLayoutProps {
  children: React.ReactNode
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

function AppLayout({ children, sidebarCollapsed, toggleSidebar }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden relative">
      <aside className="sidebar-container">
        <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="header-container">
          <Header toggleSidebar={toggleSidebar} />
        </header>
        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const isClient = useClientSide()
  const { sidebarCollapsed, toggleSidebar } = useSidebar()
  
  useProtectedNavigation()

  const isDashboard = useMemo(() => pathname === "/", [pathname])
  const showPageLoader = usePageLoader(pathname, isDashboard)

  // Mostrar skeleton durante la hidratación
  if (!isClient) {
    return <AppSkeleton />
  }

  return (
    <LoadingProvider>
      <AppThemeProvider>
        {/* Page Loader Global */}
        {showPageLoader && (
          <PageLoader isLoading={true} text="Cargando..." />
        )}

        {/* Layout condicional */}
        {isDashboard ? (
          <DashboardLayout>{children}</DashboardLayout>
        ) : (
          <AppLayout
            sidebarCollapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
          >
            {children}
          </AppLayout>
        )}
      </AppThemeProvider>
    </LoadingProvider>
  )
}
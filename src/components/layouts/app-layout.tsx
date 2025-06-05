"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ProtectedRoute } from "@/components/navigation/protected-route"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { MainLayout } from "@/components/layouts/main-layout"
import { PageLoader } from "@/components/ui/page-loader"
import { AppSkeleton } from "@/components/ui/app-skeleton"

interface AppLayoutProps {
  children: React.ReactNode
}
export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const isDashboard = pathname === "/"
  
  const [isAppReady, setIsAppReady] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsAppReady(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isDashboard && isAppReady) {
      setIsNavigating(true)
      const timer = setTimeout(() => setIsNavigating(false), 400)
      return () => clearTimeout(timer)
    }
    setIsNavigating(false)
  }, [pathname, isDashboard, isAppReady])

  if (!isAppReady) {
    return <AppSkeleton />
  }

  return (
    <ProtectedRoute>
      {isNavigating && <PageLoader isLoading text="Cargando..." />}
      {isDashboard ? (
        <DashboardLayout>{children}</DashboardLayout>
      ) : (
        <MainLayout>{children}</MainLayout>
      )}
    </ProtectedRoute>
  )
}
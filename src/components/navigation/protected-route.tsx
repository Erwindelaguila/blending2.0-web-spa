"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getSelectedModule, hasAccessToRoute, getDefaultRouteForModule } from "@/utils/module-manager"

interface ProtectedRouteProps {
  children: React.ReactNode
}
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === "/") return

    const selectedModule = getSelectedModule()
    if (!selectedModule) {
      router.replace("/")
      return
    }
    const hasAccess = hasAccessToRoute(pathname, selectedModule)
    
    if (!hasAccess) {
      const defaultRoute = getDefaultRouteForModule(selectedModule)
      router.replace(defaultRoute)
    }
  }, [pathname, router])

  return <>{children}</>
}

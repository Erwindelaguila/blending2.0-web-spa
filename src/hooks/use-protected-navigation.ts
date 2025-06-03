"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSelectedModule, hasAccessToRoute, getDefaultRouteForModule } from "@/utils/module-manager"


export function useProtectedNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {

    if (typeof window === "undefined") return

    if (pathname === "/") return

    const selectedModule = getSelectedModule()
    if (!selectedModule) {
      router.replace("/")
      return
    }

    const hasAccess = hasAccessToRoute(pathname, selectedModule)

    if (!hasAccess) {
      console.log(`🚫 Navegación bloqueada: ${pathname} no permitido para ${selectedModule}`)

      const defaultRoute = getDefaultRouteForModule(selectedModule)

      router.replace(defaultRoute)
    }
  }, [pathname, router])
}

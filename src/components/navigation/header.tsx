"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, useMemo, useCallback } from "react"
import { Button, Text } from "@fluentui/react-components"
import { NavigationRegular } from "@fluentui/react-icons"
import { getSelectedModule, hasAccessToRoute, getDefaultRouteForModule, type ModuleId } from "@/utils/module-manager"
import { MODULE_BREADCRUMBS, MODULE_NAMES } from "@/config/app.config.client"
import { useHeaderStyles } from "@/styles/header.styles"

interface HeaderProps {
  toggleSidebar: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const styles = useHeaderStyles()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  const [selectedModule, setSelectedModule] = useState<ModuleId | null>(null)

  useEffect(() => {
    setIsClient(true)
    try {
      const currentModule = getSelectedModule()
      setSelectedModule(currentModule)
      if (currentModule) {
        console.log(`📦 Header: Módulo detectado: ${currentModule}`)
      }
    } catch (error) {
      console.warn("Error reading module:", error)
      setSelectedModule(null)
    }
  }, []) 

  const breadcrumbInfo = useMemo(() => {
    if (pathname === "/" || !selectedModule) {
      return {
        breadcrumb: "Dashboard",
        currentModule: null,
      }
    }
    const hasAccess = hasAccessToRoute(pathname, selectedModule)
    const moduleBreadcrumbs = MODULE_BREADCRUMBS[selectedModule]

    let breadcrumb: string

    if (!hasAccess) {

      const defaultRoute = getDefaultRouteForModule(selectedModule)
      breadcrumb = moduleBreadcrumbs?.[defaultRoute as keyof typeof moduleBreadcrumbs] || "Dashboard"
      console.log(`🚫 Header: Sin acceso a ${pathname}, mostrando breadcrumb por defecto: ${breadcrumb}`)
    } else {
      breadcrumb = moduleBreadcrumbs?.[pathname as keyof typeof moduleBreadcrumbs] || "Dashboard"
      console.log(`✅ Header: Acceso válido a ${pathname}, breadcrumb: ${breadcrumb}`)
    }

    return {
      breadcrumb,
      currentModule: MODULE_NAMES[selectedModule] || null,
    }
  }, [pathname, selectedModule])

 
  const handleToggleSidebar = useCallback(() => {
    toggleSidebar()
  }, [toggleSidebar])


  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Button
          appearance="subtle"
          icon={<NavigationRegular />}
          onClick={handleToggleSidebar}
          className={styles.menuButton}
          aria-label="Toggle navigation menu"
        />
        <Text className={styles.breadcrumb}>{breadcrumbInfo.breadcrumb}</Text>
      </div>

      <div className={styles.headerRight}>
        <div className={styles.userInfo}>
          <div className={styles.userGreeting} suppressHydrationWarning>
            <Text className={styles.userName}>¡Hola Juan Perez!</Text>
            {isClient && breadcrumbInfo.currentModule && (
              <Text className={styles.moduleIndicator}>{breadcrumbInfo.currentModule}</Text>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

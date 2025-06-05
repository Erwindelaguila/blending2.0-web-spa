"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { Button, Text } from "@fluentui/react-components"
import { NavigationRegular } from "@fluentui/react-icons"
import { MODULE_BREADCRUMBS, MODULE_NAMES } from "@/config/app.config.client"
import { getSelectedModule } from "@/utils/module-manager"
import { useHeaderStyles } from "@/styles/header.styles"

interface HeaderProps {
  toggleSidebar: () => void
}
export function Header({ toggleSidebar }: HeaderProps) {
  const styles = useHeaderStyles()
  const pathname = usePathname()

  const breadcrumbInfo = useMemo(() => {
    if (pathname === "/") {
      return { breadcrumb: "Dashboard", currentModule: null }
    }

    const selectedModule = getSelectedModule()
    if (!selectedModule) {
      return { breadcrumb: "Dashboard", currentModule: null }
    }

    const moduleBreadcrumbs = MODULE_BREADCRUMBS[selectedModule as keyof typeof MODULE_BREADCRUMBS]
    const breadcrumb = moduleBreadcrumbs?.[pathname as keyof typeof moduleBreadcrumbs] || "Dashboard"
    const moduleName = MODULE_NAMES[selectedModule as keyof typeof MODULE_NAMES]

    return { breadcrumb, currentModule: moduleName || null }
  }, [pathname])

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Button
          appearance="subtle"
          icon={<NavigationRegular />}
          onClick={toggleSidebar}
          className={styles.menuButton}
          aria-label="Toggle navigation menu"
        />
        <Text className={styles.breadcrumb}>
          {breadcrumbInfo.breadcrumb}
        </Text>
      </div>
      
      <div className={styles.headerRight}>
        <div className={styles.userInfo}>
          <div className={styles.userGreeting}>
            <Text className={styles.userName}>¡Hola Juan Pérez!</Text>
            {breadcrumbInfo.currentModule && (
              <Text className={styles.moduleIndicator}>
                {breadcrumbInfo.currentModule}
              </Text>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
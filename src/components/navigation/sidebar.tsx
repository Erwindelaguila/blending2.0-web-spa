"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button, mergeClasses } from "@fluentui/react-components"
import { HomeRegular, ChevronDownRegular, ChevronRightRegular, SignOutRegular } from "@fluentui/react-icons"
import { NAVIGATION_MENU, type ModuleId } from "@/config/app.config.client"
import { filterNavigationByModule } from "@/utils/navigation"
import { clearSelectedModule, getSelectedModule, navigateToRoute } from "@/utils/module-manager"
import { useSidebarStyles } from "@/styles/sidebar.styles"

interface SidebarProps {
  collapsed: boolean
  toggleSidebar: () => void
}

export function Sidebar({ collapsed }: SidebarProps) {
  const styles = useSidebarStyles()
  const pathname = usePathname()
  const router = useRouter()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const [selectedModule, setSelectedModule] = useState<ModuleId | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const saved = getSelectedModule()
      if (saved) {
        setSelectedModule(saved)
        console.log(`📦 Sidebar: Módulo detectado: ${saved}`)
      }
    } catch (e) {
      console.warn("Error reading module:", e)
    }
  }, []) 

  const filteredNavigation = useMemo(() => {
    if (!selectedModule) {
      console.log("🔍 Sidebar: Sin módulo seleccionado")
      return []
    }

    const filtered = filterNavigationByModule(NAVIGATION_MENU, selectedModule)
    console.log(`🔍 Sidebar: Navegación filtrada para ${selectedModule}:`, filtered)
    return filtered
  }, [selectedModule])

  const activeStates = useMemo(() => {
    const isActive = (href: string) => pathname === href
    const isMenuActive = (menuId: string) =>
      filteredNavigation.find((item) => item.id === menuId)?.items?.some((subItem) => pathname === subItem.href)

    return { isActive, isMenuActive }
  }, [pathname, filteredNavigation])

  useEffect(() => {
    if (!isClient || !selectedModule || filteredNavigation.length === 0) return

    const segments = pathname.split("/").filter(Boolean)
    if (segments.length > 0) {
      const mainSegment = segments[0]
      const menuToOpen = filteredNavigation.find((menuItem) =>
        menuItem.items?.some((subItem) => subItem.href.includes(`/${mainSegment}/`)),
      )

      if (menuToOpen) {
        setOpenMenus((prev) => ({ ...prev, [menuToOpen.id]: true }))
        console.log(`📂 Sidebar: Auto-abriendo menú: ${menuToOpen.id}`)
      }
    }
  }, [pathname, filteredNavigation, isClient, selectedModule])

  const toggleMenu = useCallback((menuId: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }))
  }, [])

  const handleDashboardClick = useCallback(() => {
    clearSelectedModule()
    setSelectedModule(null)
    router.push("/")
  }, [router])

  const handleSubmenuClick = useCallback(
    (href: string) => {
      console.log("🔗 Sidebar: Navegando a:", href)
      navigateToRoute(href, router)
    },
    [router],
  )

  return (
    <aside className={collapsed ? `${styles.sidebar} ${styles.sidebarCollapsed}` : styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>T</div>
        {!collapsed && <div className={styles.logoText}>TASA</div>}
      </div>

      <nav className={styles.nav}>
        {/* Dashboard Item */}
        <div
          className={mergeClasses(styles.menuItem, activeStates.isActive("/") && styles.menuItemActive)}
          onClick={handleDashboardClick}
        >
          <div className={styles.menuItemContent}>
            <HomeRegular className={styles.menuIcon} />
            {!collapsed && <span className={styles.menuText}>Dashboard</span>}
          </div>
        </div>

        {/* Navigation Items */}
        {filteredNavigation.map((item) => {
          const IconComponent = item.icon
          const isMenuOpen = openMenus[item.id]
          const isMenuActiveState = activeStates.isMenuActive(item.id)

          return (
            <div key={item.id}>
              {/* Main Menu Item */}
              <div
                className={mergeClasses(styles.menuItem, isMenuActiveState && styles.menuItemActive)}
                onClick={() => toggleMenu(item.id)}
              >
                <div className={styles.menuItemContent}>
                  {IconComponent && <IconComponent className={styles.menuIcon} />}
                  {!collapsed && <span className={styles.menuText}>{item.label}</span>}
                </div>
                {!collapsed && <span>{isMenuOpen ? <ChevronDownRegular /> : <ChevronRightRegular />}</span>}
              </div>

              {/* Submenu Items */}
              {!collapsed && (
                <div className={mergeClasses(styles.submenu, isMenuOpen && styles.submenuOpen)}>
                  {item.items?.map((subItem) => {
                    const SubIconComponent = subItem.icon

                    if (!subItem.href || subItem.href === "#") {
                      return null
                    }

                    return (
                      <div
                        key={subItem.id}
                        className={mergeClasses(
                          styles.submenuItem,
                          activeStates.isActive(subItem.href) && styles.submenuItemActive,
                        )}
                        onClick={() => handleSubmenuClick(subItem.href)}
                      >
                        {SubIconComponent && <SubIconComponent className={styles.submenuIcon} />}
                        <span>{subItem.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className={styles.footer}>
        <Button appearance="subtle" className={styles.signOutButton} icon={<SignOutRegular />}>
          {!collapsed && "Cerrar sesión"}
        </Button>
      </div>
    </aside>
  )
}

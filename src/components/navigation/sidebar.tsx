"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button, mergeClasses } from "@fluentui/react-components"
import { HomeRegular, ChevronDownRegular, ChevronRightRegular, SignOutRegular } from "@fluentui/react-icons"
import { NAVIGATION_MENU } from "@/config/app.config.client"
import { getSelectedModule, clearSelectedModule } from "@/utils/module-manager"
import { filterNavigationByModule } from "@/utils/navigation"
import { useSidebarStyles } from "@/styles/sidebar.styles"
import type { ModuleId } from "@/config/app.config.server"

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

  useEffect(() => {
    const moduleSelect = getSelectedModule()
    setSelectedModule(moduleSelect)
  }, [pathname])

  useEffect(() => {
    if (!selectedModule) return

    const segments = pathname.split("/").filter(Boolean)
    if (segments.length > 0) {
      const filteredNav = filterNavigationByModule(NAVIGATION_MENU, selectedModule)
      const mainSegment = segments[0]
      const menuToOpen = filteredNav.find((menuItem) =>
        menuItem.items?.some((subItem) => subItem.href.includes(`/${mainSegment}/`))
      )

      if (menuToOpen) {
        setOpenMenus((prev) => ({ ...prev, [menuToOpen.id]: true }))
      }
    }
  }, [pathname, selectedModule])

  const filteredNavigation = useMemo(() => {
    if (!selectedModule) return []
    return filterNavigationByModule(NAVIGATION_MENU, selectedModule)
  }, [selectedModule])

  const navigationStates = useMemo(() => {
    const isActive = (href: string) => pathname === href
    const isMenuActive = (menuId: string) =>
      filteredNavigation.find((item) => item.id === menuId)?.items?.some((subItem) => pathname === subItem.href)

    return { isActive, isMenuActive }
  }, [pathname, filteredNavigation])

  const toggleMenu = useCallback((menuId: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }))
  }, [])

  const handleDashboardClick = useCallback(() => {
    router.push("/")
  }, [router])

  const handleSubmenuClick = useCallback((href: string) => {
    router.push(href)
  }, [router])

  const handleLogout = useCallback(() => {
    clearSelectedModule()
    router.push("/")
  }, [router])

  return (
    <aside className={collapsed ? `${styles.sidebar} ${styles.sidebarCollapsed}` : styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>T</div>
        {!collapsed && <div className={styles.logoText}>TASA</div>}
      </div>

      {/* Navegación */}
      <nav className={styles.nav}>
        {/* Dashboard */}
        <div
          className={mergeClasses(styles.menuItem, navigationStates.isActive("/") && styles.menuItemActive)}
          onClick={handleDashboardClick}
        >
          <div className={styles.menuItemContent}>
            <HomeRegular className={styles.menuIcon} />
            {!collapsed && <span className={styles.menuText}>Dashboard</span>}
          </div>
        </div>

        {/* Navegación filtrada por módulo */}
        {filteredNavigation.map((item) => {
          const IconComponent = item.icon
          const isMenuOpen = openMenus[item.id]
          const isMenuActiveState = navigationStates.isMenuActive(item.id)

          return (
            <div key={item.id}>
              {/* Menú principal */}
              <div
                className={mergeClasses(styles.menuItem, isMenuActiveState && styles.menuItemActive)}
                onClick={() => toggleMenu(item.id)}
              >
                <div className={styles.menuItemContent}>
                  {IconComponent && <IconComponent className={styles.menuIcon} />}
                  {!collapsed && <span className={styles.menuText}>{item.label}</span>}
                </div>
                {!collapsed && (
                  <span>{isMenuOpen ? <ChevronDownRegular /> : <ChevronRightRegular />}</span>
                )}
              </div>

              {/* Submenú */}
              {!collapsed && (
                <div className={mergeClasses(styles.submenu, isMenuOpen && styles.submenuOpen)}>
                  {item.items?.map((subItem) => {
                    const SubIconComponent = subItem.icon

                    if (!subItem.href || subItem.href === "#") return null

                    return (
                      <div
                        key={subItem.id}
                        className={mergeClasses(
                          styles.submenuItem,
                          navigationStates.isActive(subItem.href) && styles.submenuItemActive
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

      {/* Footer */}
      <div className={styles.footer}>
        <Button 
          appearance="subtle" 
          className={styles.signOutButton} 
          icon={<SignOutRegular />} 
          onClick={handleLogout}
        >
          {!collapsed && "Cerrar sesión"}
        </Button>
      </div>
    </aside>
  )
}
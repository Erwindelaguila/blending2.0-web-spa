"use client"
import { NAVIGATION_MENU, type ModuleId, type MenuItem } from "@/config/app.config.client"
import { MODULES } from "@/config/app.config.server"
import { getSelectedModule, hasAccessToRoute } from "@/utils/module-manager"
export type { MenuItem } from "@/config/app.config.client"

export function getBreadcrumbFromPath(pathname: string): string {
  if (pathname === "/") return "Dashboard"

  const selectedModule = getSelectedModule()
  if (!selectedModule) return "Dashboard"

  if (!hasAccessToRoute(pathname, selectedModule)) {
    return MODULES[selectedModule].name
  }
  for (const mainItem of NAVIGATION_MENU) {
    if (mainItem.items) {
      for (const subItem of mainItem.items) {
        if (subItem.href === pathname) {
          return subItem.label
        }
      }
    }
  }
  return "Dashboard"
}
export function filterNavigationByModule(navigation: MenuItem[], moduleId: ModuleId): MenuItem[] {
  console.log(`Filtrando navegación para módulo: ${moduleId}`)

  switch (moduleId) {
    case "logistica":
      return navigation
        .filter((item) => ["modelos", "consultas"].includes(item.id))
        .map((item) => ({
          ...item,
          items:
            item.items?.filter((subItem) =>
              item.id === "modelos" ? subItem.id === "homo-contenedores" : subItem.id === "historico-contenedores",
            ) || [],
        }))
        .filter((item) => item.items && item.items.length > 0)

    case "calidad":
      return navigation
        .filter((item) => ["modelos", "consultas"].includes(item.id))
        .map((item) => ({
          ...item,
          items:
            item.items?.filter((subItem) =>
              item.id === "modelos" ? subItem.id === "homo-harina" : subItem.id === "historico-harina",
            ) || [],
        }))
        .filter((item) => item.items && item.items.length > 0)

    case "administrador":
      return navigation
        .filter((item) => ["mantenimientos", "configuraciones"].includes(item.id))
        .filter((item) => item.items && item.items.length > 0)

    default:
      console.warn(`⚠️ Módulo desconocido: ${moduleId}`)
      return []
  }
}

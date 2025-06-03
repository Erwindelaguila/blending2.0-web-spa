"use client"

import { MODULES, STORAGE_KEYS, type ModuleId } from "@/config/app.config.server"

export type { ModuleId } from "@/config/app.config.server"

export function setSelectedModule(moduleId: ModuleId): void {
  try {
    localStorage.setItem(STORAGE_KEYS.selectedModule, moduleId)
    document.cookie = `${STORAGE_KEYS.selectedModule}=${moduleId}; path=/; max-age=${60 * 60 * 24 * 7}`
    console.log(`📦 Módulo seleccionado: ${moduleId}`)
  } catch (error) {
    console.error("Error al establecer módulo:", error)
  }
}

export function getSelectedModule(): ModuleId | null {
  try {
    if (typeof window === "undefined") return null
    const saved = localStorage.getItem(STORAGE_KEYS.selectedModule)
    if (saved && isValidModuleId(saved)) {
      return saved as ModuleId
    }
    return null
  } catch (error) {
    console.error("Error al obtener módulo:", error)
    return null
  }
}

function isValidModuleId(value: string): value is ModuleId {
  return value in MODULES
}

export function clearSelectedModule(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.selectedModule)
    document.cookie = `${STORAGE_KEYS.selectedModule}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
    console.log("🗑️ Módulo limpiado")
  } catch (error) {
    console.error("Error al limpiar módulo:", error)
  }
}

export function hasAccessToRoute(pathname: string, moduleId?: ModuleId): boolean {
  const currentModule = moduleId || getSelectedModule()
  if (!currentModule) return false

  const moduleConfig = MODULES[currentModule]
  return moduleConfig.routes.some((route) => pathname.startsWith(route))
}

export function getDefaultRouteForModule(moduleId: ModuleId): string {
  return MODULES[moduleId].defaultRoute
}

export function navigateToRoute(pathname: string, router: { push: (path: string) => void }): boolean {
  const selectedModule = getSelectedModule()

  if (!selectedModule) {
    console.warn("No hay módulo seleccionado")
    router.push("/")
    return false
  }

  if (!hasAccessToRoute(pathname, selectedModule)) {
    console.warn(`Acceso denegado a ${pathname} para módulo ${selectedModule}`)
    return false
  }

  router.push(pathname)
  return true
}

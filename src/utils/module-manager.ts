"use client"

import { MODULES, STORAGE_KEYS, type ModuleId } from "@/config/app.config.server"

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

export type { ModuleId } from "@/config/app.config.server"

interface Router {
  readonly push: (path: string) => void
}

interface ModuleOperationResult {
  readonly success: boolean
  readonly error?: string
}

// ============================================================================
// CONSTANTES
// ============================================================================

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 días
const COOKIE_EXPIRY_DATE = "Thu, 01 Jan 1970 00:00:01 GMT"

// ============================================================================
// GUARDS Y VALIDACIONES
// ============================================================================

const isClientSide = (): boolean => typeof window !== "undefined"

const isValidModuleId = (value: string): value is ModuleId => {
  return typeof value === "string" && value in MODULES
}

const handleError = (operation: string, error: unknown): void => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error(`❌ [ModuleManager] ${operation}:`, errorMessage)
}

// ============================================================================
// OPERACIONES DE STORAGE
// ============================================================================


export const setSelectedModule = (moduleId: ModuleId): ModuleOperationResult => {
  if (!isClientSide()) {
    return { success: false, error: "Operación solo disponible en cliente" }
  }

  if (!isValidModuleId(moduleId)) {
    const error = `Módulo inválido: ${moduleId}`
    console.error(`❌ [ModuleManager] ${error}`)
    return { success: false, error }
  }

  try {
    localStorage.setItem(STORAGE_KEYS.selectedModule, moduleId)
    const cookieValue = `${STORAGE_KEYS.selectedModule}=${moduleId}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
    document.cookie = cookieValue
    
    console.log(`📦 [ModuleManager] Módulo establecido: ${moduleId}`)
    return { success: true }
    
  } catch (error) {
    handleError("setSelectedModule", error)
    return { success: false, error: "Error al establecer módulo" }
  }
}

export const getSelectedModule = (): ModuleId | null => {
  if (!isClientSide()) return null

  try {
    const storedModule = localStorage.getItem(STORAGE_KEYS.selectedModule)
    if (storedModule && isValidModuleId(storedModule)) {
      return storedModule
    }

    const cookieModule = getCookieValue(STORAGE_KEYS.selectedModule)
    if (cookieModule && isValidModuleId(cookieModule)) {
      localStorage.setItem(STORAGE_KEYS.selectedModule, cookieModule)
      return cookieModule
    }

    return null
    
  } catch (error) {
    handleError("getSelectedModule", error)
    return null
  }
}
export const clearSelectedModule = (): ModuleOperationResult => {
  if (!isClientSide()) {
    return { success: false, error: "Operación solo disponible en cliente" }
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.selectedModule)
  
    document.cookie = `${STORAGE_KEYS.selectedModule}=; path=/; expires=${COOKIE_EXPIRY_DATE}`
    
    console.log("🗑️ [ModuleManager] Módulo limpiado exitosamente")
    return { success: true }
    
  } catch (error) {
    handleError("clearSelectedModule", error)
    return { success: false, error: "Error al limpiar módulo" }
  }
}

// ============================================================================
// UTILIDADES DE COOKIES
// ============================================================================

const getCookieValue = (name: string): string | null => {
  if (!isClientSide()) return null

  try {
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    return match ? decodeURIComponent(match[2]) : null
  } catch (error) {
    handleError("getCookieValue", error)
    return null
  }
}

// ============================================================================
// GESTIÓN DE RUTAS Y ACCESO
// ============================================================================

export const hasAccessToRoute = (pathname: string, moduleId?: ModuleId): boolean => {
  const targetModule = moduleId ?? getSelectedModule()
  
  if (!targetModule || !isValidModuleId(targetModule)) {
    return false
  }

  try {
    const moduleConfig = MODULES[targetModule]
    return moduleConfig.routes.some(route => pathname.startsWith(route))
  } catch (error) {
    handleError("hasAccessToRoute", error)
    return false
  }
}

export const getDefaultRouteForModule = (moduleId: ModuleId): string => {
  if (!isValidModuleId(moduleId)) {
    console.warn(`⚠️ [ModuleManager] Módulo inválido: ${moduleId}`)
    return "/"
  }

  return MODULES[moduleId].defaultRoute
}

export const navigateToRoute = (pathname: string, router: Router): boolean => {
  const selectedModule = getSelectedModule()
  if (!selectedModule) {
    console.warn("⚠️ [ModuleManager] No hay módulo seleccionado, redirigiendo a home")
    router.push("/")
    return false
  }
  if (!hasAccessToRoute(pathname, selectedModule)) {
    console.warn(`⚠️ [ModuleManager] Acceso denegado a ${pathname} para módulo ${selectedModule}`)
    
    const defaultRoute = getDefaultRouteForModule(selectedModule)
    router.push(defaultRoute)
    return false
  }

  router.push(pathname)
  console.log(`✅ [ModuleManager] Navegando a: ${pathname}`)
  return true
}

// ============================================================================
// UTILIDADES DE DEBUGGING Y DIAGNÓSTICO
// ============================================================================

export const getModuleManagerState = () => {
  if (!isClientSide()) {
    return { error: "No disponible en servidor" }
  }

  const selectedModule = getSelectedModule()
  const storedInLocalStorage = localStorage.getItem(STORAGE_KEYS.selectedModule)
  const storedInCookie = getCookieValue(STORAGE_KEYS.selectedModule)

  return {
    selectedModule,
    storage: {
      localStorage: storedInLocalStorage,
      cookie: storedInCookie,
    },
    isValid: selectedModule ? isValidModuleId(selectedModule) : false,
    availableModules: Object.keys(MODULES),
  }
}
export const validateModuleSystem = (): boolean => {
  try {
    const hasModules = Object.keys(MODULES).length > 0
    const hasStorageKeys = Boolean(STORAGE_KEYS?.selectedModule)
    const isClientEnvironment = isClientSide()

    return hasModules && hasStorageKeys && isClientEnvironment
  } catch (error) {
    handleError("validateModuleSystem", error)
    return false
  }
}

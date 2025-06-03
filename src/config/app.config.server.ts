/**
 * Configuración central de la aplicación - PARTE SERVIDOR
 * Single Source of Truth - SIN duplicaciones
 */
import type { Metadata } from "next"

// ============================================================================
// INFORMACIÓN BASE DE LA APLICACIÓN (ÚNICA FUENTE DE VERDAD)
// ============================================================================
const BASE_APP_INFO = {
  name: "Blending 2.0",
  version: "2.0.0",
  description: "Sistema de gestión de homogenización TASA",
  company: "TASA",
} as const

// ============================================================================
// INFORMACIÓN DERIVADA (SE CALCULA AUTOMÁTICAMENTE)
// ============================================================================
export const APP_INFO = {
  // Información base
  ...BASE_APP_INFO,

  // Información derivada para el tema
  theme: {
    name: `${BASE_APP_INFO.company} Light Theme`,
    version: "1.0.0",
  },

  // Metadata derivada para Next.js
  metadata: {
    title: BASE_APP_INFO.name,
    description: BASE_APP_INFO.description,
    authors: [{ name: BASE_APP_INFO.company }],
    keywords: ["blending", "homogenización", BASE_APP_INFO.company.toLowerCase(), "contenedores", "harina"],
  } as Metadata,
} as const

// ============================================================================
// SISTEMA DE COLORES CENTRALIZADO
// ============================================================================
export const COLORS = {
  // Colores principales de TASA
  primary: "#1e4a72",
  primaryLight: "#2563eb",
  primaryDark: "#1e3a8a",
  accent: "#fbbf24",

  // Colores de superficie
  background: "#f8fafc",
  surface: "#ffffff",

  // Colores de texto
  text: "#1e293b",
  textSecondary: "#64748b",

  // Colores de módulos
  modules: {
    logistica: "#22c55e",
    calidad: "#3b82f6",
    administrador: "#8b5cf6",
  },

  // Estados
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
} as const

// ============================================================================
// CONFIGURACIÓN DE UI
// ============================================================================
export const UI_CONFIG = {
  sidebar: {
    width: "280px",
    collapsedWidth: "60px",
    transitionDuration: "0.3s",
  },
  header: {
    height: "64px",
  },
} as const

// ============================================================================
// CONFIGURACIÓN DE STORAGE
// ============================================================================
export const STORAGE_KEYS = {
  selectedModule: "selectedModule",
  userPreferences: "userPreferences",
  sidebarState: "sidebarState",
} as const

// ============================================================================
// TIPOS DE MÓDULOS Y CONFIGURACIÓN
// ============================================================================
export type ModuleId = "logistica" | "calidad" | "administrador"

export interface ModuleConfig {
  id: ModuleId
  name: string
  description: string
  defaultRoute: string
  color: string
  routes: string[]
}

// ============================================================================
// CONFIGURACIÓN DE MÓDULOS (Single Source of Truth)
// ============================================================================
export const MODULES: Record<ModuleId, ModuleConfig> = {
  logistica: {
    id: "logistica",
    name: "Logística",
    description: "Gestión de homogenización de contenedores",
    defaultRoute: "/modelos/contenedores",
    color: COLORS.modules.logistica,
    routes: ["/modelos/contenedores", "/consultas/historico-contenedores"],
  },
  calidad: {
    id: "calidad",
    name: "Calidad",
    description: "Gestión de homogenización de harina",
    defaultRoute: "/modelos/harina",
    color: COLORS.modules.calidad,
    routes: ["/modelos/harina", "/consultas/historico-harina"],
  },
  administrador: {
    id: "administrador",
    name: "Administrador",
    description: "Configuración y mantenimiento del sistema",
    defaultRoute: "/mantenimientos/plantas",
    color: COLORS.modules.administrador,
    routes: [
      "/mantenimientos/plantas",
      "/mantenimientos/calidades",
      "/mantenimientos/parametros",
      "/configuraciones/valores-calidad",
      "/configuraciones/aplicacion",
    ],
  },
} as const

// ============================================================================
// UTILIDADES DERIVADAS
// ============================================================================
export const AVAILABLE_MODULES = Object.values(MODULES)

export function getModuleConfig(moduleId: string): ModuleConfig | undefined {
  return MODULES[moduleId as ModuleId]
}

export function isValidModuleId(moduleId: string): moduleId is ModuleId {
  return moduleId in MODULES
}

export function getModuleRoutes(moduleId: ModuleId): string[] {
  return MODULES[moduleId].routes
}

export function getModuleColor(moduleId: ModuleId): string {
  return MODULES[moduleId].color
}

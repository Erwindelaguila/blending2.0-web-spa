import type { Metadata } from "next";
// ============================================================================
// INFORMACIÓN BASE DE LA APLICACIÓN (ÚNICA FUENTE DE VERDAD)
// ============================================================================
const BASE_APP_INFO = {
  name: "Blending 2.0",
  version: "2.0.0",
  description: "Sistema de gestión de homogenización TASA",
  company: "TASA",
} as const;

// ============================================================================
// INFORMACIÓN DERIVADA (SE CALCULA AUTOMÁTICAMENTE)
// ============================================================================
export const APP_INFO = {
  ...BASE_APP_INFO,
  theme: {
    name: `${BASE_APP_INFO.company} Light Theme`,
    version: "1.0.0",
  },

  metadata: {
    title: BASE_APP_INFO.name,
    description: BASE_APP_INFO.description,
    authors: [{ name: BASE_APP_INFO.company }],
    keywords: [
      "blending",
      "homogenización",
      BASE_APP_INFO.company.toLowerCase(),
      "contenedores",
      "harina",
    ],
  } as Metadata,
} as const;

// ============================================================================
// SISTEMA DE COLORES CENTRALIZADO
// ============================================================================
export const COLORS = {
  // Colores principales
  primary: "#1e4a72",
  primaryLight: "#2563eb",
  primaryDark: "#1e3a8a",
  accent: "#fbbf24",

  // Superficie y fondo
  background: "#f8fafc",
  surface: "#ffffff",
  surfaceHover: "#f1f5f9",

  // Texto
  text: "#1e293b",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",

  // Módulos
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

  // Bordes y divisores
  border: "#e2e8f0",
  borderHover: "#cbd5e1",
} as const;

// ============================================================================
// CONFIGURACIÓN DE UI
// ============================================================================
export const UI_CONFIG = {
  sidebar: {
    width: "20%",
    collapsedWidth: "5%",
    transitionDuration: "0.3s",
  },
  header: {
    height: "64px",
  },

  footer: {
    height: "48px",
  },
  
} as const;

export const OrgColors = {
  // Colores principales
  azulOscuro: "#184a7d", // RGB(24,74,125)
  verde: "#76a140", // RGB(118,162,64)
  celeste: "#56bdeb", // RGB(86,189,236)

  // Colores secundarios
  blanco: "#ffffff",
  grisTexto: "#808080",

  // Complementarios (Paleta SEROT)
  serotVerde: "#76a140", // mismo que verde principal
  serotAmarillo: "#ffc700", // RGB(255,199,0)
  serotAzul: "#1c73ae", // RGB(28,115,174)
  serotRojo: "#ca2d00", // RGB(200,45,0)
};

// ============================================================================
// CONFIGURACIÓN DE STORAGE
// ============================================================================
export const STORAGE_KEYS = {
  selectedModule: "selectedModule",
  userPreferences: "userPreferences",
  sidebarState: "sidebarState",
} as const;

// ============================================================================
// TIPOS DE MÓDULOS Y CONFIGURACIÓN
// ============================================================================
export type ModuleId = "logistica" | "calidad" | "administrador";

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  description: string;
  defaultRoute: string;
  color: string;
  routes: string[];
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
} as const;

// ============================================================================
// UTILIDADES DERIVADAS
// ============================================================================
export const AVAILABLE_MODULES = Object.values(MODULES);

export function getModuleConfig(moduleId: string): ModuleConfig | undefined {
  return MODULES[moduleId as ModuleId];
}

export function isValidModuleId(moduleId: string): moduleId is ModuleId {
  return moduleId in MODULES;
}

export function getModuleRoutes(moduleId: ModuleId): string[] {
  return MODULES[moduleId].routes;
}

export function getModuleColor(moduleId: ModuleId): string {
  return MODULES[moduleId].color;
}

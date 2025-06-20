"use client"

/**
 * Configuración central de la aplicación - PARTE CLIENTE
 * Importa componentes de React y código del cliente
 */
import {
  GridRegular,
  SearchRegular,
  SettingsRegular,
  OptionsRegular,
  BuildingRegular,
  ClipboardTaskRegular,
  HistoryRegular,
  GaugeRegular,
  WrenchRegular,
} from "@fluentui/react-icons"
import type { ComponentType } from "react"

// ============================================================================
// CONFIGURACIÓN DE NAVEGACIÓN CON ICONOS (SOLO CLIENTE)
// ============================================================================
export interface MenuItem {
  id: string
  label: string
  icon?: ComponentType<{ className?: string; fontSize?: number }>
  href: string
  items?: MenuItem[]
}

export const NAVIGATION_MENU: MenuItem[] = [
  {
    id: "modelos",
    label: "Modelos",
    icon: GridRegular,
    href: "#",
    items: [
      {
        id: "homo-contenedores",
        label: "Homogenización de Contenedores",
        icon: BuildingRegular,
        href: "/modelos/contenedores",
      },
      {
        id: "homo-harina",
        label: "Homogenización de Harina",
        icon: ClipboardTaskRegular,
        href: "/modelos/harina",
      },
    ],
  },
  {
    id: "consultas",
    label: "Consultas",
    icon: SearchRegular,
    href: "#",
    items: [
      {
        id: "historico-contenedores",
        label: "Histórico Homo. Contenedores",
        icon: HistoryRegular,
        href: "/consultas/historico-contenedores",
      },
      {
        id: "historico-harina",
        label: "Histórico Homo. Harina",
        icon: HistoryRegular,
        href: "/consultas/historico-harina",
      },
    ],
  },
  {
    id: "mantenimientos",
    label: "Mantenimientos",
    icon: WrenchRegular,
    href: "#",
    items: [
      {
        id: "plantas-homogenizacion",
        label: "Plantas de Homogenización",
        icon: BuildingRegular,
        href: "/mantenimientos/plantas",
      },
      {
        id: "calidades",
        label: "Calidades",
        icon: GaugeRegular,
        href: "/mantenimientos/calidades",
      },
      {
        id: "parametros-calidad",
        label: "Parámetros de Calidad",
        icon: ClipboardTaskRegular,
        href: "/mantenimientos/parametros",
      },
    ],
  },
  {
    id: "configuraciones",
    label: "Configuraciones",
    icon: OptionsRegular,
    href: "#",
    items: [
      {
        id: "valores-calidad",
        label: "Valores de Calidad - Parámetros",
        icon: GaugeRegular,
        href: "/configuraciones/valores-calidad",
      },
      {
        id: "config-aplicacion",
        label: "Configuración de la Aplicación",
        icon: SettingsRegular,
        href: "/configuraciones/aplicacion",
      },
    ],
  },
] as const

// ============================================================================
// MAPEO DE MÓDULOS A ICONOS (SOLO CLIENTE)
// ============================================================================
export const MODULE_ICONS = {
  logistica: BuildingRegular,
  calidad: ClipboardTaskRegular,
  administrador: SettingsRegular,
} as const

// ============================================================================
// BREADCRUMBS POR MÓDULO (SOLO CLIENTE)
// ============================================================================
export const MODULE_BREADCRUMBS = {
  logistica: {
    "/modelos/contenedores": "Homogenización de Contenedores",
    "/consultas/historico-contenedores": "Histórico Homo. Contenedores",
  },
  calidad: {
    "/modelos/harina": "Homogenización de Harina",
    "/consultas/historico-harina": "Histórico Homo. Harina",
    "/consultas/historico-harina/ver-reporte" : "Ver Reporte"
  },
  administrador: {
    "/mantenimientos/plantas": "Plantas de Homogenización",
    "/mantenimientos/calidades": "Calidades",
    "/mantenimientos/parametros": "Parámetros de Calidad",
    "/configuraciones/valores-calidad": "Valores de Calidad - Parámetros",
    "/configuraciones/aplicacion": "Configuración de la Aplicación",
  },
} as const

// ============================================================================
// NOMBRES DE MÓDULOS PARA DISPLAY (SOLO CLIENTE)
// ============================================================================
export const MODULE_NAMES = {
  logistica: "Logística",
  calidad: "Calidad",
  administrador: "Administrador",
} as const

export * from "./app.config.server"

"use client";
/**
 * Configuración central de la aplicación - PARTE CLIENTE
 * ✅ MIGRADO A MENÚ DINÁMICO: El menú ahora viene del backend
 * Este archivo solo mantiene configuraciones estáticas auxiliares
 */
import {
  SettingsRegular,
  BuildingRegular,
  ClipboardTaskRegular,
} from "@fluentui/react-icons";
import type { ComponentType } from "react";

// ============================================================================
// ⚠️  NOTA: NAVIGATION_MENU ELIMINADO 
// ============================================================================
// El menú ahora es dinámico y viene del backend via useUserMenu()
// Ver: src/hooks/use-user-menu.ts y src/services/menu-new.service.ts


// ============================================================================
// MAPEO DE MÓDULOS A ICONOS (SOLO CLIENTE)
// ============================================================================
export const MODULE_ICONS = {
  logistica: BuildingRegular,
  calidad: ClipboardTaskRegular,
  administrador: SettingsRegular,
} as const;

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
    "/consultas/historico-harina/ver-reporte": "Ver Reporte",
  },
  administrador: {
    "/mantenimientos/plantas": "Plantas de Homogenización",
    "/mantenimientos/produccion": "Producción",
    "/mantenimientos/parametros": "Parámetros de Calidad",
    "/configuraciones/valores-calidad": "Valores de Calidad - Parámetros",
    "/configuraciones/aplicacion": "Configuración de la Aplicación",
  },
} as const;

// ============================================================================
// NOMBRES DE MÓDULOS PARA DISPLAY (SOLO CLIENTE)
// ============================================================================
export const MODULE_NAMES = {
  logistica: "Logística",
  calidad: "Calidad",
  administrador: "Administrador",
} as const;

export * from "./app.config.server";

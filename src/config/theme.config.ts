"use client"

import { 
  createLightTheme, 
  type BrandVariants, 
  type Theme 
} from "@fluentui/react-components"
import { COLORS } from "./app.config.server"

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

export interface ThemeConfig {
  readonly name: string
  readonly version: string
  readonly description: string
  readonly brandColors: {
    readonly primary: string
    readonly accent: string
    readonly modules: Record<string, string>
  }
  readonly fluentVersion: string
}

export interface DesignTokens {
  readonly spacing: Record<string, string>
  readonly borderRadius: Record<string, string>
  readonly shadows: Record<string, string>
  readonly transitions: Record<string, string>
}

// ============================================================================
// CONSTANTES DE CONFIGURACIÓN
// ============================================================================

const THEME_METADATA = {
  name: "TASA Design System",
  version: "2.0.0",
  description: "Sistema de diseño para aplicaciones TASA",
  fluentVersion: "9.x",
} as const

const THEME_SHADES = {
  DARK_BASE: "#020305",
  DARK_SECONDARY: "#0f172a",
  DARK_PRIMARY: "#1e293b",
  
  INTERACTION_HOVER: "#60a5fa",
  INTERACTION_ACTIVE: "#0085fc",
  INTERACTION_FOCUSED: "#dbeafe",
  
  SURFACE_LIGHT: "#eff6ff",
  SURFACE_HOVER: "#f1f5f9",
  TEXT_DISABLED: "#94a3b8",
} as const

// ============================================================================
// PALETA DE COLORES TASA
// ============================================================================

export const TASA_BRAND_RAMP: BrandVariants = {
  // Tonos oscuros (10-30) - Texto y contraste alto
  10: THEME_SHADES.DARK_BASE,
  20: THEME_SHADES.DARK_SECONDARY, 
  30: THEME_SHADES.DARK_PRIMARY,

  // Tonos primarios (40-60) - Identidad TASA
  40: COLORS.primary,
  50: COLORS.primaryLight,
  60: COLORS.modules.calidad,

  // Tonos medios (70-90) - Interacciones y hover
  70: THEME_SHADES.INTERACTION_HOVER,
  80: THEME_SHADES.INTERACTION_ACTIVE,
  90: THEME_SHADES.INTERACTION_FOCUSED,

  // Tonos claros (100-160) - Fondos y bordes
  100: THEME_SHADES.SURFACE_LIGHT,
  110: COLORS.background,
  120: THEME_SHADES.SURFACE_HOVER,
  130: COLORS.border,
  140: COLORS.borderHover,
  150: THEME_SHADES.TEXT_DISABLED,
  160: COLORS.textSecondary,
} as const

// ============================================================================
// TEMA PRINCIPAL
// ============================================================================

export const TASA_THEME: Theme = createLightTheme(TASA_BRAND_RAMP)

// ============================================================================
// CONFIGURACIÓN DEL TEMA
// ============================================================================

export const THEME_CONFIG: ThemeConfig = {
  ...THEME_METADATA,
  brandColors: {
    primary: COLORS.primary,
    accent: COLORS.accent,
    modules: COLORS.modules,
  },
} as const

// ============================================================================
// TOKENS DE DISEÑO
// ============================================================================

export const DESIGN_TOKENS: DesignTokens = {
  spacing: {
    xs: "4px",
    sm: "8px", 
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  borderRadius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
  transitions: {
    fast: "0.15s ease",
    normal: "0.3s ease",
    slow: "0.5s ease",
  },
} as const

// ============================================================================
// UTILIDADES DE TEMA
// ============================================================================

export const getBrandColor = (shade: keyof typeof TASA_BRAND_RAMP): string => {
  return TASA_BRAND_RAMP[shade]
}

export const getModuleThemeColor = (moduleId: keyof typeof COLORS.modules): string => {
  return COLORS.modules[moduleId]
}
export const isThemeValid = (): boolean => {
  const hasTheme = Boolean(TASA_THEME)
  const hasBrandRamp = Boolean(TASA_BRAND_RAMP)
  const hasRequiredShades = Object.keys(TASA_BRAND_RAMP).length >= 10
  
  return hasTheme && hasBrandRamp && hasRequiredShades
}

export const getSpacing = (size: keyof typeof DESIGN_TOKENS.spacing): string => {
  return DESIGN_TOKENS.spacing[size]
}

export const getShadow = (level: keyof typeof DESIGN_TOKENS.shadows): string => {
  return DESIGN_TOKENS.shadows[level]
}
export default TASA_THEME



import { webLightTheme, createLightTheme, type BrandVariants, type Theme } from "@fluentui/react-components"
import { COLORS, APP_INFO } from "./app.config.server"

/**
 * Paleta de colores TASA para Fluent UI
 * Cada número representa un tono diferente usado para estados automáticos
 */
export const TASA_BRAND_RAMP: BrandVariants = {
  // Tonos oscuros (10-30) - Para texto y elementos de contraste
  10: "#020305",
  20: "#111928",
  30: "#16263d",

  // Tonos principales (40-60) - Colores primarios de TASA
  40: COLORS.primary, 
  50: COLORS.primaryLight, 
  60: "#3b82f6", 

  // Tonos claros (70-90) - Para hover y estados activos
  70: "#60a5fa",
  80: "#93c5fd",
  90: "#dbeafe",

  // Tonos muy claros (100-160) - Para fondos y bordes
  100: "#eff6ff",
  110: COLORS.background, // #f8fafc - Fondo principal
  120: "#f1f5f9",
  130: "#e2e8f0",
  140: "#cbd5e1",
  150: "#94a3b8",
  160: COLORS.textSecondary, // #64748b - Texto secundario
} as const


export const TASA_THEME: Theme = {
  ...webLightTheme,
  ...createLightTheme(TASA_BRAND_RAMP),
} as const


export const THEME_CONFIG = {
  name: APP_INFO.theme.name,
  version: APP_INFO.theme.version,
  description: APP_INFO.description,
} as const

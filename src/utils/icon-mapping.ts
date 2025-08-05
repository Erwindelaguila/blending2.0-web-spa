import {
  SettingsRegular,
  BuildingRegular,
  ClipboardTaskRegular,
  ArchiveSettings24Filled,
  DataLine24Filled,
  DocumentTableSearch24Filled,
  AppsList24Filled,
  PuzzleCube24Filled,
  ClipboardTaskListRtl24Filled,
  WrenchSettings24Filled,
  Options24Color,
  BuildingFactory24Filled,
  Beaker24Filled,
  ClipboardDataBar24Filled,
  TableSettings24Filled,
  Settings24Filled,
  LayerDiagonal24Filled,
} from "@fluentui/react-icons";
import type { ComponentType } from "react";

// ============================================================================
// MAPEO DE NOMBRES DE ICONOS A COMPONENTES
// ============================================================================
export const ICON_MAP: Record<string, ComponentType<{ className?: string; fontSize?: number }>> = {
  // Iconos principales
  'SettingsRegular': SettingsRegular,
  'BuildingRegular': BuildingRegular,
  'ClipboardTaskRegular': ClipboardTaskRegular,
  'DataLine24Filled': DataLine24Filled,
  'DocumentTableSearch24Filled': DocumentTableSearch24Filled,
  'WrenchSettings24Filled': WrenchSettings24Filled,
  'Options24Color': Options24Color,
  
  // Iconos de submenu
  'ArchiveSettings24Filled': ArchiveSettings24Filled,
  'AppsList24Filled': AppsList24Filled,
  'PuzzleCube24Filled': PuzzleCube24Filled,
  'ClipboardTaskListRtl24Filled': ClipboardTaskListRtl24Filled,
  'BuildingFactory24Filled': BuildingFactory24Filled,
  'Beaker24Filled': Beaker24Filled,
  'ClipboardDataBar24Filled': ClipboardDataBar24Filled,
  'TableSettings24Filled': TableSettings24Filled,
  'Settings24Filled': Settings24Filled,
  'LayerDiagonal24Filled': LayerDiagonal24Filled,
};

/**
 * Convierte un nombre de icono (string) a componente React
 */
export function getIconComponent(iconName?: string): ComponentType<{ className?: string; fontSize?: number }> | undefined {
  if (!iconName) return undefined;
  return ICON_MAP[iconName];
}

/**
 * Convierte los items del menú del backend agregando los componentes de iconos
 */
export function mapMenuItemsWithIcons(items: Array<{
  id: string;
  label: string;
  iconName?: string;
  href: string;
  items?: Array<any>;
}>): Array<{
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string; fontSize?: number }>;
  href: string;
  items?: Array<any>;
}> {
  return items.map(item => ({
    ...item,
    icon: getIconComponent(item.iconName),
    items: item.items ? mapMenuItemsWithIcons(item.items) : undefined,
  }));
}

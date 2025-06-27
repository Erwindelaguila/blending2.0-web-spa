import type { FilaDato, ColumnConfig } from "@/interface/quality/quality-matrix.interfaces"

export class ColumnConfigurationUtils {
  static buildConfiguration(filas: FilaDato[]): ColumnConfig {
    const keys = Object.keys(filas[0])
    const keyCalidad = keys[0] // "CALIDAD" se mantiene fijo
    const columnas = keys.slice(1) // Todas las demás columnas
    
    // Ahora todas las columnas son editables (no hay columnas fijas)
    const columnasFijas: string[] = [] // Vacío - no hay columnas fijas
    const columnasParams = columnas // Todas las columnas son parámetros editables
    const paramsGridColumns = `repeat(${columnasParams.length}, 1fr)`

    return {
      keys,
      keyCalidad,
      columnas,
      columnasFijas,
      columnasParams,
      paramsGridColumns,
    }
  }
}

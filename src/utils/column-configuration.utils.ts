import type { FilaDato, ColumnConfig } from "@/interface/quality/quality-matrix.interfaces"

export class ColumnConfigurationUtils {
  static buildConfiguration(filas: FilaDato[]): ColumnConfig {
    const keys = Object.keys(filas[0])
    const keyCalidad = keys[0]
    const columnas = keys.slice(1)
    const columnasFijas = ["CADMIO", "TOTAL"]
    const columnasParams = columnas.filter((col) => !columnasFijas.includes(col))
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

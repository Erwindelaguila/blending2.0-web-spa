import type { FilaDato } from "@/interface/quality/quality-matrix.interfaces"
import { ValidationUtils } from "@/utils/validation-utils"

export class DataTransformationUtils {
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
  }

  static updateCellValue(filas: FilaDato[], filaIndex: number, columna: string, value: string): FilaDato[] {
    if (!ValidationUtils.isValidPositiveDecimal(value)) return filas

    const nuevasFilas = [...filas]
    nuevasFilas[filaIndex][columna] = value
    return nuevasFilas
  }

  static applyAdjustmentToColumn(
    filas: FilaDato[],
    columnasParams: string[],
    adjustmentIndex: number,
    adjustmentValue: number,
  ): FilaDato[] {
    return filas.map((fila) => {
      const nuevaFila = { ...fila }
      const key = columnasParams[adjustmentIndex]
      const currentValue = ValidationUtils.parseNumberSafely(nuevaFila[key] ?? "0")
      const result = currentValue + adjustmentValue

      nuevaFila[key] = result < 0 ? "0" : result.toFixed(2)
      return nuevaFila
    })
  }

  static detectChanges(currentData: FilaDato[], originalData: FilaDato[]): boolean {
    return currentData.some((fila, index) =>
      Object.keys(fila).some((key) => {
        // ✅ Manejamos undefined en ambos lados de la comparación
        const currentVal = fila[key] ?? ""
        const originalVal = originalData[index]?.[key] ?? ""
        return currentVal !== originalVal
      }),
    )
  }
}

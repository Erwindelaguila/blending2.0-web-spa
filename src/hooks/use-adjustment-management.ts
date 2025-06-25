"use client"

import { useState } from "react"
import type { FilaDato } from "@/interface/quality/quality-matrix.interfaces"
import { ValidationUtils } from "@/utils/validation-utils"
import { DataTransformationUtils } from "@/utils/data-transformation.utils"

export const useAdjustmentManagement = (columnasParams: string[]) => {
  const initialAdjustments = columnasParams.map(() => "0")
  const [encabezadoSuperior, setEncabezadoSuperior] = useState<string[]>(initialAdjustments)

  const updateAdjustment = (index: number, value: string) => {
    if (!ValidationUtils.isValidSignedDecimal(value)) return

    const nuevos = [...encabezadoSuperior]
    nuevos[index] = value
    setEncabezadoSuperior(nuevos)
  }

  const applyAdjustment = (index: number, filas: FilaDato[], onFilasUpdate: (newFilas: FilaDato[]) => void) => {
    const adjustmentValue = ValidationUtils.parseNumberSafely(encabezadoSuperior[index])
    if (adjustmentValue === 0) return

    const updatedFilas = DataTransformationUtils.applyAdjustmentToColumn(filas, columnasParams, index, adjustmentValue)

    onFilasUpdate(updatedFilas)

    //Resetear solo el ajuste aplicado a "0"
    const resetAdjustments = [...encabezadoSuperior]
    resetAdjustments[index] = "0"
    setEncabezadoSuperior(resetAdjustments)
  }

  //función para resetear TODOS los ajustes a su estado inicial
  const resetAllAdjustments = () => {
    setEncabezadoSuperior([...initialAdjustments])
  }

  //Función para verificar si hay ajustes pendientes (diferentes de "0")
  const hasAdjustments = () => {
    return encabezadoSuperior.some((adj) => adj !== "0")
  }

  return {
    encabezadoSuperior,
    updateAdjustment,
    applyAdjustment,
    resetAllAdjustments,
    hasAdjustments,
  }
}

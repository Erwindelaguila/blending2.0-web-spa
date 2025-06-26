"use client"

import { useState } from "react"
import type { FilaDato } from "@/interface/quality/quality-matrix.interfaces"
import { DataTransformationUtils } from "@/utils/data-transformation.utils"

export const useQualityDataManagement = (initialData: FilaDato[]) => {
  const [filas, setFilas] = useState<FilaDato[]>(initialData)
  const [filasOriginales] = useState<FilaDato[]>(DataTransformationUtils.deepClone(initialData))
  const [hasChanges, setHasChanges] = useState(false)

  const detectChanges = () => {
    const changesDetected = DataTransformationUtils.detectChanges(filas, filasOriginales)
    setHasChanges(changesDetected)
  }

  const updateCell = (filaIndex: number, columna: string, value: string) => {
    const updatedFilas = DataTransformationUtils.updateCellValue(filas, filaIndex, columna, value)
    if (updatedFilas !== filas) {
      setFilas(updatedFilas)
      // Detectar cambios automáticamente después de actualizar
      const changesDetected = DataTransformationUtils.detectChanges(updatedFilas, filasOriginales)
      setHasChanges(changesDetected)
    }
  }

  const resetToOriginal = () => {
    setFilas(DataTransformationUtils.deepClone(filasOriginales))
    setHasChanges(false)
  }

  // Función para actualizar filas y detectar cambios automáticamente
  const updateFilas = (newFilas: FilaDato[]) => {
    setFilas(newFilas)
    const changesDetected = DataTransformationUtils.detectChanges(newFilas, filasOriginales)
    setHasChanges(changesDetected)
  }

  return {
    filas,
    filasOriginales,
    hasChanges,
    detectChanges,
    updateCell,
    resetToOriginal,
    setFilas,
    updateFilas,
  }
}

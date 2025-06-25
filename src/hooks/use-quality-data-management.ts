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
    }
  }

  const resetToOriginal = () => {
    setFilas(DataTransformationUtils.deepClone(filasOriginales))
    setHasChanges(false)
  }

  return {
    filas,
    filasOriginales,
    hasChanges,
    detectChanges,
    updateCell,
    resetToOriginal,
    setFilas,
  }
}

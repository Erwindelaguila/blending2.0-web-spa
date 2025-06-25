"use client"

import { useCallback, useState } from "react"
import type { HoveredCell, MouseHandlers } from "@/interface/quality/quality-matrix.interfaces"

export const useMouseHandlers = (): [HoveredCell | null, MouseHandlers] => {
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null)

  const handleMouseEnter = useCallback((row: number, col: string, type: "header" | "data") => {
    setHoveredCell({ row, col, type })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null)
  }, [])

  return [hoveredCell, { handleMouseEnter, handleMouseLeave }]
}

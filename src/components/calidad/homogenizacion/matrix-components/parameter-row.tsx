"use client"

import { memo } from "react"
import { MatrixCell } from "./matrix-cell"
import type { ParameterRowProps } from "@/interface/quality/quality-matrix.interfaces"

export const ParameterRow = memo(function ParameterRow({
  fila,
  filaIndex,
  columnasParams,
  paramsGridColumns,
  onCellUpdate,
  isSelected,
}: ParameterRowProps) {
  return (
    <div
      className={`grid gap-0 min-w-fit w-full min-h-10 ${isSelected ? "bg-blue-50" : ""}`}
      style={{ gridTemplateColumns: paramsGridColumns }}
    >
      {columnasParams.map((col, colIdx) => (
        <div
          key={`param-${filaIndex}-${colIdx}`}
          className={`min-w-[80px] w-full border-r-2 border-[#8bc34a] border-b border-[#8bc34a] p-0.5 bg-transparent flex items-center justify-center ${
            colIdx === columnasParams.length - 1 ? "!border-r-0" : ""
          }`}
        >
          <MatrixCell
            value={fila[col] ?? ""}
            onUpdate={(value) => onCellUpdate(filaIndex, col, value)}
            className="w-full h-full text-right text-xs !border-0 bg-transparent font-medium pr-2"
          />
        </div>
      ))}
    </div>
  )
})

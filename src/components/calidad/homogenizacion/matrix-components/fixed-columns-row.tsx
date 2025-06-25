"use client"

import { memo } from "react"
import { MatrixCell } from "./matrix-cell"
import type { FixedColumnsRowProps } from "@/interface/quality/quality-matrix.interfaces"

export const FixedColumnsRow = memo(function FixedColumnsRow({
  fila,
  filaIndex,
  columnasFijas,
  onCellUpdate,
  isSelected,
}: FixedColumnsRowProps) {
  return (
    <div
      className={`grid gap-0 min-h-10 ${isSelected ? "bg-blue-50" : ""}`}
      style={{ gridTemplateColumns: "90px 90px" }}
    >
      {columnasFijas.map((col, colIdx) => (
        <div
          key={`fixed-${filaIndex}-${colIdx}`}
          className={`border-r-2 border-[#8bc34a] border-b border-[#8bc34a] p-0.5 bg-transparent flex items-center justify-center h-10 min-h-10 max-w-[90px] min-w-[90px] w-[90px] flex-[0_0_90px] ${
            colIdx === columnasFijas.length - 1 ? "!border-r-0" : ""
          }`}
        >
          <MatrixCell
            value={fila[col] ?? ""}
            onUpdate={(value) => onCellUpdate(filaIndex, col, value)}
            className="w-full h-full text-center text-xs !border-0 bg-transparent font-medium"
            readOnly={true}
          />
        </div>
      ))}
    </div>
  )
})

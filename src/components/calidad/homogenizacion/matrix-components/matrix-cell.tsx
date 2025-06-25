"use client"

import { memo } from "react"
import { Input } from "@fluentui/react-components"
import type { MatrixCellProps } from "@/interface/quality/quality-matrix.interfaces"

export const MatrixCell = memo(function MatrixCell({
  value,
  onUpdate,
  readOnly = false,
  className = "",
  type = "text",
  placeholder,
}: MatrixCellProps) {
  return (
    <Input
      value={value}
      onChange={(_, data) => onUpdate(data.value)}
      className={className}
      type={type}
      readOnly={readOnly}
      placeholder={placeholder}
    />
  )
})

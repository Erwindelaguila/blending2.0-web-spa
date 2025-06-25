"use client"

import type React from "react"

import { memo, useCallback } from "react"
import { Input } from "@fluentui/react-components"
import type { AdjustmentInputProps } from "@/interface/quality/quality-matrix.interfaces"

export const AdjustmentInput = memo(function AdjustmentInput({
  value,
  index,
  onUpdate,
  onApply,
  className = "",
}: AdjustmentInputProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        onApply(index)
      }
    },
    [index, onApply],
  )

  const handleChange = useCallback(
    (e: any, data: any) => {
      onUpdate(index, data.value)
    },
    [index, onUpdate],
  )

  return <Input value={value} onKeyDown={handleKeyDown} onChange={handleChange} className={className} placeholder="0" />
})
